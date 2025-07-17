// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GreenPoints
 * @dev ERC20 token for consumer rewards in AgriDAO ecosystem
 * Features:
 * - Unlimited supply for consumer rewards
 * - Multiple minters (authorized contracts)
 * - Predefined point values for different actions
 * - Pausable for emergency situations
 */
contract GreenPoints is ERC20, Ownable, Pausable {
    // Authorized minters (contracts that can mint points)
    mapping(address => bool) public minters;
    
    // Point values for different consumer actions
    uint256 public constant SCAN_POINTS = 10 * 10**18;       // 10 GREEN points
    uint256 public constant RATE_POINTS = 20 * 10**18;       // 20 GREEN points
    uint256 public constant SHARE_POINTS = 25 * 10**18;      // 25 GREEN points
    uint256 public constant REFERRAL_POINTS = 100 * 10**18;  // 100 GREEN points
    
    // Consumer activity tracking
    mapping(address => uint256) public totalScans;
    mapping(address => uint256) public totalRatings;
    mapping(address => uint256) public totalShares;
    mapping(address => uint256) public totalReferrals;
    
    // Events
    event PointsAwarded(address indexed user, uint256 amount, string action);
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event PointsRedeemed(address indexed user, uint256 amount, string redemption);
    
    /**
     * @dev Constructor sets token name and symbol
     */
    constructor() ERC20("Green Points", "GREEN") Ownable(msg.sender) {}
    
    /**
     * @dev Modifier to check if caller is authorized minter
     */
    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "GreenPoints: Not authorized to mint");
        _;
    }
    
    /**
     * @dev Add authorized minter (only owner)
     * @param minter Address to authorize for minting
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "GreenPoints: Cannot add zero address as minter");
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove authorized minter (only owner)
     * @param minter Address to remove from minters
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Award points to user with custom amount and action (only minters)
     * @param user Address to award points to
     * @param amount Amount of points to award
     * @param action Description of action performed
     */
    function awardPoints(address user, uint256 amount, string memory action) 
        external 
        onlyMinter 
        whenNotPaused 
    {
        require(user != address(0), "GreenPoints: Cannot award to zero address");
        require(amount > 0, "GreenPoints: Amount must be greater than 0");
        
        _mint(user, amount);
        emit PointsAwarded(user, amount, action);
    }
    
    /**
     * @dev Award points for scanning a product (only minters)
     * @param user Address to award scan points to
     */
    function awardScanPoints(address user) external onlyMinter whenNotPaused {
        require(user != address(0), "GreenPoints: Cannot award to zero address");
        
        totalScans[user]++;
        _mint(user, SCAN_POINTS);
        emit PointsAwarded(user, SCAN_POINTS, "scan");
    }
    
    /**
     * @dev Award points for rating a product (only minters)
     * @param user Address to award rating points to
     */
    function awardRatePoints(address user) external onlyMinter whenNotPaused {
        require(user != address(0), "GreenPoints: Cannot award to zero address");
        
        totalRatings[user]++;
        _mint(user, RATE_POINTS);
        emit PointsAwarded(user, RATE_POINTS, "rate");
    }
    
    /**
     * @dev Award points for sharing a product (only minters)
     * @param user Address to award share points to
     */
    function awardSharePoints(address user) external onlyMinter whenNotPaused {
        require(user != address(0), "GreenPoints: Cannot award to zero address");
        
        totalShares[user]++;
        _mint(user, SHARE_POINTS);
        emit PointsAwarded(user, SHARE_POINTS, "share");
    }
    
    /**
     * @dev Award points for referring new users (only minters)
     * @param user Address to award referral points to
     */
    function awardReferralPoints(address user) external onlyMinter whenNotPaused {
        require(user != address(0), "GreenPoints: Cannot award to zero address");
        
        totalReferrals[user]++;
        _mint(user, REFERRAL_POINTS);
        emit PointsAwarded(user, REFERRAL_POINTS, "referral");
    }
    
    /**
     * @dev Redeem points for rewards (burns tokens)
     * @param amount Amount of points to redeem
     * @param redemption Description of what points were redeemed for
     */
    function redeemPoints(uint256 amount, string memory redemption) external whenNotPaused {
        require(amount > 0, "GreenPoints: Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "GreenPoints: Insufficient balance");
        
        _burn(msg.sender, amount);
        emit PointsRedeemed(msg.sender, amount, redemption);
    }
    
    /**
     * @dev Get user's total activity stats
     * @param user Address to get stats for
     */
    function getUserStats(address user) external view returns (
        uint256 scans,
        uint256 ratings,
        uint256 shares,
        uint256 referrals,
        uint256 balance
    ) {
        return (
            totalScans[user],
            totalRatings[user],
            totalShares[user],
            totalReferrals[user],
            balanceOf(user)
        );
    }
    
    /**
     * @dev Batch award points to multiple users (gas efficient)
     * @param users Array of user addresses
     * @param amounts Array of point amounts
     * @param action Description of action performed
     */
    function batchAwardPoints(
        address[] calldata users,
        uint256[] calldata amounts,
        string memory action
    ) external onlyMinter whenNotPaused {
        require(users.length == amounts.length, "GreenPoints: Arrays length mismatch");
        require(users.length > 0, "GreenPoints: Empty arrays");
        
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "GreenPoints: Cannot award to zero address");
            require(amounts[i] > 0, "GreenPoints: Amount must be greater than 0");
            
            _mint(users[i], amounts[i]);
            emit PointsAwarded(users[i], amounts[i], action);
        }
    }
    
    /**
     * @dev Emergency pause (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override _update to prevent transfers when paused
     * This replaces the old _beforeTokenTransfer hook
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }
}