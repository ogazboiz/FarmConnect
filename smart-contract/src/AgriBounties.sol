// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// Interface for FarmToken contract
import { IFarmToken } from "./interfaces/IFarmToken.sol";
/**
 * @title AgriBounties
 * @dev Decentralized innovation platform for agricultural challenges
 * Features:
 * - Create bounties for agricultural problems
 * - Submit solutions to earn rewards
 * - Community-driven innovation funding
 * - Multi-category organization
 * - Milestone-based rewards
 */
contract AgriBounties is Ownable, Pausable, ReentrancyGuard {
    IFarmToken public farmToken;
    
    uint256 private _bountyIdCounter;
    uint256 private _submissionIdCounter;
    
    // Bounty structure (optimized)
    struct Bounty {
        uint256 id;
        address creator;
        string title;
        string requirements;
        string category;
        uint256 reward;
        BountyStatus status;
        uint256 createdAt;
        uint256 deadline;
        uint256 submissionCount;
        address winner;
        bool rewardDistributed;
    }
    
    // Bounty settings (separate struct to avoid stack depth)
    struct BountySettings {
        string tags;
        uint256 minReputationRequired;
        bool allowMultipleWinners;
        uint256 maxWinners;
        uint256 platformFee;
    }
    
    // Bounty status
    enum BountyStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED,
        EXPIRED
    }
    
    // Submission structure
    struct Submission {
        uint256 submissionId;
        address submitter;
        uint256 bountyId;
        string submissionData;
        uint256 timestamp;
        bool selected;
        uint256 votes;
        string feedback;
        bool isActive;
    }
    
    // User profile
    struct UserProfile {
        uint256 reputation;
        uint256 bountiesCreated;
        uint256 bountiesWon;
        uint256 submissionsMade;
        uint256 totalEarned;
        bool isVerified;
    }
    
    // Mappings
    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => BountySettings) public bountySettings;
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => uint256[]) public bountySubmissions;
    mapping(address => uint256[]) public creatorBounties;
    mapping(address => uint256[]) public submitterBounties;
    mapping(uint256 => mapping(address => bool)) public hasSubmitted;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public verifiedExperts;
    
    // Constants
    uint256 public constant MIN_BOUNTY_AMOUNT = 50 * 10**18; // 50 FARM tokens
    uint256 public constant MAX_BOUNTY_DURATION = 365 days;  // 1 year max
    uint256 public constant MIN_BOUNTY_DURATION = 1 days;    // 1 day min
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 250;   // 2.5%
    
    // Platform settings
    uint256 public platformFee = PLATFORM_FEE_PERCENTAGE;
    address public feeRecipient;
    bool public communityVotingEnabled = true;
    
    // Events
    event BountyCreated(
        uint256 indexed bountyId,
        address indexed creator,
        string title,
        string category,
        uint256 reward,
        uint256 deadline
    );
    
    event SubmissionMade(
        uint256 indexed bountyId,
        uint256 indexed submissionId,
        address indexed submitter
    );
    
    event SubmissionVoted(
        uint256 indexed bountyId,
        uint256 indexed submissionId,
        address indexed voter,
        bool support
    );
    
    event BountyCompleted(
        uint256 indexed bountyId,
        address indexed winner,
        uint256 reward
    );
    
    event BountyCancelled(uint256 indexed bountyId, string reason);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    event ExpertVerified(address indexed expert);
    
    constructor(address _farmToken, address _feeRecipient) Ownable(msg.sender) {
        require(_farmToken != address(0), "AgriBounties: FarmToken address cannot be zero");
        require(_feeRecipient != address(0), "AgriBounties: Fee recipient cannot be zero");
        
        farmToken = IFarmToken(_farmToken);
        feeRecipient = _feeRecipient;
        _bountyIdCounter = 1;
        _submissionIdCounter = 1;
    }
    
    /**
     * @dev Create a new bounty (optimized to avoid stack depth)
     */
    function createBounty(
        string memory title,
        string memory requirements,
        string memory category,
        uint256 reward,
        uint256 durationInDays
    ) external whenNotPaused returns (uint256) {
        require(bytes(title).length > 0, "AgriBounties: Title cannot be empty");
        require(bytes(requirements).length > 0, "AgriBounties: Requirements cannot be empty");
        require(bytes(category).length > 0, "AgriBounties: Category cannot be empty");
        require(reward >= MIN_BOUNTY_AMOUNT, "AgriBounties: Reward too low");
        require(
            durationInDays >= MIN_BOUNTY_DURATION / 1 days && 
            durationInDays <= MAX_BOUNTY_DURATION / 1 days,
            "AgriBounties: Invalid duration"
        );
        require(farmToken.balanceOf(msg.sender) >= reward, "AgriBounties: Insufficient balance");
        
        uint256 feeAmount = (reward * platformFee) / 10000;
        uint256 totalAmount = reward + feeAmount;
        
        require(
            farmToken.transferFrom(msg.sender, address(this), totalAmount),
            "AgriBounties: Transfer failed"
        );
        
        if (feeAmount > 0) {
            farmToken.transfer(feeRecipient, feeAmount);
        }
        
        uint256 bountyId = _bountyIdCounter;
        _bountyIdCounter += 1;
        
        uint256 deadline = block.timestamp + (durationInDays * 1 days);
        
        bounties[bountyId] = Bounty({
            id: bountyId,
            creator: msg.sender,
            title: title,
            requirements: requirements,
            category: category,
            reward: reward,
            status: BountyStatus.ACTIVE,
            createdAt: block.timestamp,
            deadline: deadline,
            submissionCount: 0,
            winner: address(0),
            rewardDistributed: false
        });
        
        // Initialize default settings
        bountySettings[bountyId] = BountySettings({
            tags: "",
            minReputationRequired: 0,
            allowMultipleWinners: false,
            maxWinners: 1,
            platformFee: feeAmount
        });
        
        creatorBounties[msg.sender].push(bountyId);
        userProfiles[msg.sender].bountiesCreated += 1;
        
        emit BountyCreated(bountyId, msg.sender, title, category, reward, deadline);
        return bountyId;
    }
    
    /**
     * @dev Set bounty settings separately to avoid stack depth
     */
    function setBountySettings(
        uint256 bountyId,
        string memory tags,
        uint256 minReputationRequired,
        bool allowMultipleWinners,
        uint256 maxWinners
    ) external {
        require(bounties[bountyId].creator == msg.sender, "AgriBounties: Not bounty creator");
        require(bounties[bountyId].status == BountyStatus.ACTIVE, "AgriBounties: Bounty not active");
        
        if (allowMultipleWinners) {
            require(maxWinners > 1 && maxWinners <= 10, "AgriBounties: Invalid max winners");
        } else {
            maxWinners = 1;
        }
        
        bountySettings[bountyId].tags = tags;
        bountySettings[bountyId].minReputationRequired = minReputationRequired;
        bountySettings[bountyId].allowMultipleWinners = allowMultipleWinners;
        bountySettings[bountyId].maxWinners = maxWinners;
    }
    
    /**
     * @dev Submit a solution to a bounty
     */
    function submitToBounty(uint256 bountyId, string memory submissionData) 
        external 
        whenNotPaused 
        returns (uint256)
    {
        require(bounties[bountyId].status == BountyStatus.ACTIVE, "AgriBounties: Bounty not active");
        require(block.timestamp <= bounties[bountyId].deadline, "AgriBounties: Bounty deadline passed");
        require(!hasSubmitted[bountyId][msg.sender], "AgriBounties: Already submitted");
        require(bytes(submissionData).length > 0, "AgriBounties: Submission data cannot be empty");
        require(
            userProfiles[msg.sender].reputation >= bountySettings[bountyId].minReputationRequired,
            "AgriBounties: Insufficient reputation"
        );
        
        hasSubmitted[bountyId][msg.sender] = true;
        uint256 submissionId = _submissionIdCounter;
        _submissionIdCounter += 1;
        
        submissions[submissionId] = Submission({
            submissionId: submissionId,
            submitter: msg.sender,
            bountyId: bountyId,
            submissionData: submissionData,
            timestamp: block.timestamp,
            selected: false,
            votes: 0,
            feedback: "",
            isActive: true
        });
        
        bountySubmissions[bountyId].push(submissionId);
        bounties[bountyId].submissionCount += 1;
        
        submitterBounties[msg.sender].push(bountyId);
        userProfiles[msg.sender].submissionsMade += 1;
        
        emit SubmissionMade(bountyId, submissionId, msg.sender);
        return submissionId;
    }
    
    /**
     * @dev Vote on a submission (community voting)
     */
    function voteOnSubmission(uint256 submissionId, bool support) external whenNotPaused {
        require(communityVotingEnabled, "AgriBounties: Community voting disabled");
        require(submissions[submissionId].isActive, "AgriBounties: Submission not active");
        require(!hasVoted[submissionId][msg.sender], "AgriBounties: Already voted");
        
        uint256 bountyId = submissions[submissionId].bountyId;
        require(bounties[bountyId].status == BountyStatus.ACTIVE, "AgriBounties: Bounty not active");
        require(bounties[bountyId].creator != msg.sender, "AgriBounties: Creator cannot vote");
        
        hasVoted[submissionId][msg.sender] = true;
        
        if (support) {
            submissions[submissionId].votes += 1;
        }
        
        emit SubmissionVoted(bountyId, submissionId, msg.sender, support);
    }
    
    /**
     * @dev Complete bounty and select winner
     */
    function completeBounty(uint256 bountyId, uint256 submissionId) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.creator == msg.sender, "AgriBounties: Not bounty creator");
        require(bounty.status == BountyStatus.ACTIVE, "AgriBounties: Bounty not active");
        require(!bounty.rewardDistributed, "AgriBounties: Reward already distributed");
        require(submissions[submissionId].bountyId == bountyId, "AgriBounties: Invalid submission");
        
        bounty.status = BountyStatus.COMPLETED;
        bounty.winner = submissions[submissionId].submitter;
        bounty.rewardDistributed = true;
        
        submissions[submissionId].selected = true;
        
        // Transfer reward to winner
        address winner = submissions[submissionId].submitter;
        require(farmToken.transfer(winner, bounty.reward), "AgriBounties: Transfer failed");
        
        // Update user profiles
        userProfiles[winner].bountiesWon += 1;
        userProfiles[winner].totalEarned += bounty.reward;
        userProfiles[winner].reputation += 100; // Bonus reputation for winning
        
        emit BountyCompleted(bountyId, winner, bounty.reward);
        emit ReputationUpdated(winner, userProfiles[winner].reputation);
    }
    
    /**
     * @dev Cancel a bounty and refund creator
     */
    function cancelBounty(uint256 bountyId, string memory reason) external nonReentrant whenNotPaused {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.creator == msg.sender, "AgriBounties: Not bounty creator");
        require(bounty.status == BountyStatus.ACTIVE, "AgriBounties: Bounty not active");
        require(bounty.submissionCount == 0, "AgriBounties: Cannot cancel with submissions");
        
        bounty.status = BountyStatus.CANCELLED;
        
        // Refund reward to creator
        require(farmToken.transfer(msg.sender, bounty.reward), "AgriBounties: Refund failed");
        
        emit BountyCancelled(bountyId, reason);
    }
    
    /**
     * @dev Mark bounty as expired if deadline passed
     */
    function expireBounty(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.ACTIVE, "AgriBounties: Bounty not active");
        require(block.timestamp > bounty.deadline, "AgriBounties: Bounty not expired");
        
        bounty.status = BountyStatus.EXPIRED;
        
        // Refund reward to creator
        require(farmToken.transfer(bounty.creator, bounty.reward), "AgriBounties: Refund failed");
        
        emit BountyCancelled(bountyId, "Expired");
    }
    
    /**
     * @dev Verify an expert (only owner)
     */
    function verifyExpert(address expert) external onlyOwner {
        verifiedExperts[expert] = true;
        userProfiles[expert].isVerified = true;
        userProfiles[expert].reputation += 500; // Bonus reputation for verification
        
        emit ExpertVerified(expert);
        emit ReputationUpdated(expert, userProfiles[expert].reputation);
    }
    
    /**
     * @dev Add feedback to submission (only bounty creator)
     */
    function addFeedback(uint256 submissionId, string memory feedback) external {
        uint256 bountyId = submissions[submissionId].bountyId;
        require(bounties[bountyId].creator == msg.sender, "AgriBounties: Not bounty creator");
        
        submissions[submissionId].feedback = feedback;
    }
    
    // View functions
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }
    
    function getBountySettings(uint256 bountyId) external view returns (BountySettings memory) {
        return bountySettings[bountyId];
    }
    
    function getSubmission(uint256 submissionId) external view returns (Submission memory) {
        return submissions[submissionId];
    }
    
    function getBountySubmissions(uint256 bountyId) external view returns (uint256[] memory) {
        return bountySubmissions[bountyId];
    }}