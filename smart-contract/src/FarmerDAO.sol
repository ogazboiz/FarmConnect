// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// Interface for FarmToken contract
import { IFarmToken } from "./interfaces/IFarmToken.sol";

/**
 * @title FarmerDAO
 * @dev Simplified governance system for AgriDAO farmers
 * Features:
 * - Membership system for farmers
 * - Proposal creation and voting
 * - Treasury management
 * - Reputation-based governance
 */
contract FarmerDAO is Ownable, Pausable, ReentrancyGuard {
    IFarmToken public farmToken;
    
    uint256 private _proposalIdCounter;
    
    // Simplified proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 amount;
        ProposalType proposalType;
        ProposalStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        address recipient;
        bool executed;
    }
    
    // Proposal types
    enum ProposalType {
        FUNDING,        // Fund a farmer or project
        GOVERNANCE,     // Change DAO parameters
        CERTIFICATION,  // Approve certification programs
        EQUIPMENT,      // Purchase shared equipment
        RESEARCH        // Fund agricultural research
    }
    
    // Proposal status
    enum ProposalStatus {
        ACTIVE,
        PASSED,
        FAILED,
        EXECUTED,
        CANCELLED
    }
    
    // Simplified member structure
    struct Member {
        bool isMember;
        uint256 joinedAt;
        string farmLocation;
        uint256 reputation;
        uint256 proposalsCreated;
        uint256 votesParticipated;
        bool isVerified;
    }
    
    // Mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public voteChoice;
    mapping(address => Member) public members;
    mapping(address => uint256[]) public memberProposals;
    mapping(address => uint256) public stakedBalance;
    
    // DAO parameters
    uint256 public constant MIN_STAKE_TO_PROPOSE = 100 * 10**18; // 100 FARM tokens
    uint256 public constant MIN_STAKE_TO_VOTE = 10 * 10**18;     // 10 FARM tokens
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant QUORUM_PERCENTAGE = 10; // 10% of total staked tokens
    uint256 public constant SUPER_MAJORITY = 67;    // 67% for governance changes
    
    // DAO state
    address[] public memberList;
    uint256 public treasuryBalance;
    uint256 public totalMembers;
    uint256 public totalStaked;
    
    // Events
    event MemberJoined(address indexed member, string farmLocation);
    event MemberVerified(address indexed member, address verifier);
    event TokensStaked(address indexed member, uint256 amount);
    event TokensUnstaked(address indexed member, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    event TreasuryFunded(address indexed funder, uint256 amount);
    event TreasuryWithdrawal(address indexed recipient, uint256 amount);
    
    constructor(address _farmToken) Ownable(msg.sender) {
        require(_farmToken != address(0), "FarmerDAO: FarmToken address cannot be zero");
        farmToken = IFarmToken(_farmToken);
        _proposalIdCounter = 1;
    }
    
    /**
     * @dev Join the DAO as a farmer
     */
    function joinDAO(string memory farmLocation) external whenNotPaused {
        require(!members[msg.sender].isMember, "FarmerDAO: Already a member");
        require(farmToken.balanceOf(msg.sender) > 0, "FarmerDAO: Must hold FARM tokens");
        require(bytes(farmLocation).length > 0, "FarmerDAO: Farm location cannot be empty");
        
        members[msg.sender] = Member({
            isMember: true,
            joinedAt: block.timestamp,
            farmLocation: farmLocation,
            reputation: 0,
            proposalsCreated: 0,
            votesParticipated: 0,
            isVerified: false
        });
        
        memberList.push(msg.sender);
        totalMembers += 1;
        
        emit MemberJoined(msg.sender, farmLocation);
    }
    
    /**
     * @dev Stake FARM tokens for governance participation
     */
    function stakeTokens(uint256 amount) external whenNotPaused {
        require(members[msg.sender].isMember, "FarmerDAO: Not a member");
        require(amount > 0, "FarmerDAO: Amount must be greater than 0");
        require(farmToken.balanceOf(msg.sender) >= amount, "FarmerDAO: Insufficient balance");
        
        require(
            farmToken.transferFrom(msg.sender, address(this), amount),
            "FarmerDAO: Transfer failed"
        );
        
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake FARM tokens
     */
    function unstakeTokens(uint256 amount) external nonReentrant whenNotPaused {
        require(members[msg.sender].isMember, "FarmerDAO: Not a member");
        require(amount > 0, "FarmerDAO: Amount must be greater than 0");
        require(stakedBalance[msg.sender] >= amount, "FarmerDAO: Insufficient staked balance");
        
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        
        require(farmToken.transfer(msg.sender, amount), "FarmerDAO: Transfer failed");
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    /**
     * @dev Verify a member (only owner)
     */
    function verifyMember(address member) external onlyOwner {
        require(members[member].isMember, "FarmerDAO: Not a member");
        require(!members[member].isVerified, "FarmerDAO: Already verified");
        
        members[member].isVerified = true;
        members[member].reputation += 100; // Verification bonus
        
        emit MemberVerified(member, msg.sender);
    }
    
    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        uint256 amount,
        ProposalType proposalType,
        address recipient
    ) external whenNotPaused returns (uint256) {
        require(members[msg.sender].isMember, "FarmerDAO: Not a DAO member");
        require(stakedBalance[msg.sender] >= MIN_STAKE_TO_PROPOSE, "FarmerDAO: Insufficient staked tokens");
        require(bytes(title).length > 0, "FarmerDAO: Title cannot be empty");
        
        // Validate proposal based on type
        if (proposalType == ProposalType.FUNDING || proposalType == ProposalType.EQUIPMENT) {
            require(amount > 0, "FarmerDAO: Amount must be greater than 0");
            require(recipient != address(0), "FarmerDAO: Recipient cannot be zero address");
        }
        
        uint256 proposalId = _proposalIdCounter;
        _proposalIdCounter += 1;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            amount: amount,
            proposalType: proposalType,
            status: ProposalStatus.ACTIVE,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + VOTING_PERIOD,
            recipient: recipient,
            executed: false
        });
        
        members[msg.sender].proposalsCreated += 1;
        memberProposals[msg.sender].push(proposalId);
        
        emit ProposalCreated(proposalId, msg.sender, title);
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 proposalId, bool support) external whenNotPaused {
        require(members[msg.sender].isMember, "FarmerDAO: Not a DAO member");
        require(proposals[proposalId].status == ProposalStatus.ACTIVE, "FarmerDAO: Proposal not active");
        require(block.timestamp <= proposals[proposalId].deadline, "FarmerDAO: Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "FarmerDAO: Already voted");
        require(stakedBalance[msg.sender] >= MIN_STAKE_TO_VOTE, "FarmerDAO: Insufficient staked tokens");
        
        hasVoted[proposalId][msg.sender] = true;
        voteChoice[proposalId][msg.sender] = support;
        
        uint256 voterWeight = stakedBalance[msg.sender] + (members[msg.sender].reputation / 100);
        
        if (support) {
            proposals[proposalId].votesFor += voterWeight;
        } else {
            proposals[proposalId].votesAgainst += voterWeight;
        }
        
        members[msg.sender].votesParticipated += 1;
        
        emit VoteCast(proposalId, msg.sender, support, voterWeight);
    }
    
    /**
     * @dev Execute a proposal after voting period ends
     */
    function executeProposal(uint256 proposalId) external nonReentrant whenNotPaused {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.ACTIVE, "FarmerDAO: Proposal not active");
        require(block.timestamp > proposal.deadline, "FarmerDAO: Voting period not ended");
        require(!proposal.executed, "FarmerDAO: Proposal already executed");
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 quorumRequired = (totalStaked * QUORUM_PERCENTAGE) / 100;
        
        bool quorumMet = totalVotes >= quorumRequired;
        bool majorityReached = proposal.votesFor > proposal.votesAgainst;
        
        // Governance proposals need super majority
        if (proposal.proposalType == ProposalType.GOVERNANCE) {
            majorityReached = (proposal.votesFor * 100) >= (totalVotes * SUPER_MAJORITY);
        }
        
        bool passed = quorumMet && majorityReached;
        
        if (passed) {
            proposal.status = ProposalStatus.PASSED;
            
            // Execute funding/equipment proposals
            if ((proposal.proposalType == ProposalType.FUNDING || 
                 proposal.proposalType == ProposalType.EQUIPMENT) &&
                proposal.amount > 0 && 
                proposal.recipient != address(0) &&
                address(this).balance >= proposal.amount) {
                
                (bool success, ) = proposal.recipient.call{value: proposal.amount}("");
                if (success) {
                    treasuryBalance -= proposal.amount;
                    proposal.executed = true;
                    proposal.status = ProposalStatus.EXECUTED;
                    emit TreasuryWithdrawal(proposal.recipient, proposal.amount);
                }
            } else {
                // Non-funding proposals are considered executed when passed
                proposal.executed = true;
                proposal.status = ProposalStatus.EXECUTED;
            }
        } else {
            proposal.status = ProposalStatus.FAILED;
        }
        
        emit ProposalExecuted(proposalId, passed);
    }
    
    /**
     * @dev Cancel a proposal (only by proposer)
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.proposer == msg.sender, "FarmerDAO: Not proposal creator");
        require(proposal.status == ProposalStatus.ACTIVE, "FarmerDAO: Proposal not active");
        
        proposal.status = ProposalStatus.CANCELLED;
    }
    
    /**
     * @dev Fund the DAO treasury
     */
    function fundTreasury() external payable {
        require(msg.value > 0, "FarmerDAO: Must send value");
        treasuryBalance += msg.value;
        emit TreasuryFunded(msg.sender, msg.value);
    }
    
    // View functions
    function getMemberCount() external view returns (uint256) {
        return totalMembers;
    }
    
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }
    
    function getMemberProposals(address member) external view returns (uint256[] memory) {
        return memberProposals[member];
    }
    
    function getVotingPower(address member) external view returns (uint256) {
        if (!members[member].isMember) return 0;
        return stakedBalance[member] + (members[member].reputation / 100);
    }
    
    function hasUserVoted(uint256 proposalId, address user) external view returns (bool) {
        return hasVoted[proposalId][user];
    }
    
    function getUserVoteChoice(uint256 proposalId, address user) external view returns (bool) {
        return voteChoice[proposalId][user];
    }
    
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](_proposalIdCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i < _proposalIdCounter; i++) {
            if (proposals[i].status == ProposalStatus.ACTIVE && 
                block.timestamp <= proposals[i].deadline) {
                activeIds[count] = i;
                count += 1;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeIds[i];
        }
        
        return result;
    }
    
    function getTotalProposals() external view returns (uint256) {
        return _proposalIdCounter - 1;
    }
    
    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "FarmerDAO: Insufficient balance");
        treasuryBalance -= amount;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "FarmerDAO: Emergency withdrawal failed");
        
        emit TreasuryWithdrawal(owner(), amount);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Receive native currency for treasury funding
     */
    receive() external payable {
        treasuryBalance += msg.value;
        emit TreasuryFunded(msg.sender, msg.value);
    }
}