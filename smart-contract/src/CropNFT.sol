// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// Interface for GreenPoints contract
interface IGreenPoints {
    function awardScanPoints(address user) external;
    function awardRatePoints(address user) external;
    function awardSharePoints(address user) external;
}

/**
 * @title CropNFT
 * @dev NFT contract for crop batch traceability with single picture support
 */
contract CropNFT is ERC721URIStorage, Ownable, Pausable {
    IGreenPoints public greenPoints;
    uint256 private _tokenIdCounter;
    
    // Simplified crop batch with single picture
    struct CropBatch {
        address farmer;
        string cropType;
        string location;
        bool isOrganic;
        uint256 quantity;
        uint256 createdAt;
        uint256 harvestDate;
        string status;
        string certifications;
        string cropImage;  // Single IPFS hash for crop picture
    }
    
    // Consumer engagement data
    struct EngagementData {
        uint256 totalScans;
        uint256 totalRatings;
        uint256 averageRating;
        uint256 socialShares;
    }
    
    // Mappings
    mapping(uint256 => CropBatch) public cropBatches;
    mapping(uint256 => EngagementData) public engagementData;
    mapping(uint256 => mapping(address => bool)) public hasScanned;
    mapping(uint256 => mapping(address => bool)) public hasRated;
    mapping(uint256 => mapping(address => uint256)) public ratings;
    mapping(address => uint256[]) public farmerCrops;
    mapping(address => uint256) public farmerReputation;
    
    // Constants
    uint256 public constant MAX_RATING = 5;
    uint256 public constant RATING_PRECISION = 100;
    
    // Events
    event CropBatchCreated(uint256 indexed tokenId, address indexed farmer, string cropType);
    event CropScanned(uint256 indexed tokenId, address indexed scanner, uint256 scanCount);
    event CropRated(uint256 indexed tokenId, address indexed rater, uint256 rating);
    event CropShared(uint256 indexed tokenId, address indexed sharer, uint256 shareCount);
    event StatusUpdated(uint256 indexed tokenId, string newStatus);
    event CertificationAdded(uint256 indexed tokenId, string certification);
    event CropImageUpdated(uint256 indexed tokenId, string newImage);
    
    constructor(address _greenPoints) ERC721("AgriDAO Crop", "CROP") Ownable(msg.sender) {
        require(_greenPoints != address(0), "CropNFT: GreenPoints address cannot be zero");
        greenPoints = IGreenPoints(_greenPoints);
        _tokenIdCounter = 1;
    }
    
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return tokenId > 0 && tokenId < _tokenIdCounter && _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Create crop batch with single picture
     */
    function createCropBatch(
        string memory cropType,
        string memory location,
        bool isOrganic,
        uint256 quantity,
        string memory cropImage
    ) external whenNotPaused returns (uint256) {
        require(bytes(cropType).length > 0, "CropNFT: Crop type cannot be empty");
        require(bytes(location).length > 0, "CropNFT: Location cannot be empty");
        require(quantity > 0, "CropNFT: Quantity must be greater than 0");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        
        _safeMint(msg.sender, tokenId);
        
        cropBatches[tokenId] = CropBatch({
            farmer: msg.sender,
            cropType: cropType,
            location: location,
            isOrganic: isOrganic,
            quantity: quantity,
            createdAt: block.timestamp,
            harvestDate: 0,
            status: "planted",
            certifications: "",
            cropImage: cropImage
        });
        
        engagementData[tokenId] = EngagementData({
            totalScans: 0,
            totalRatings: 0,
            averageRating: 0,
            socialShares: 0
        });
        
        farmerCrops[msg.sender].push(tokenId);
        
        emit CropBatchCreated(tokenId, msg.sender, cropType);
        return tokenId;
    }
    
    /**
     * @dev Update crop image
     */
    function updateCropImage(uint256 tokenId, string memory newImage) external {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "CropNFT: Not token owner");
        require(bytes(newImage).length > 0, "CropNFT: Image cannot be empty");
        
        cropBatches[tokenId].cropImage = newImage;
        emit CropImageUpdated(tokenId, newImage);
    }
    
    /**
     * @dev Add certifications
     */
    function addCertification(uint256 tokenId, string memory certification) external {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "CropNFT: Not token owner");
        require(bytes(certification).length > 0, "CropNFT: Certification cannot be empty");
        
        string memory currentCerts = cropBatches[tokenId].certifications;
        if (bytes(currentCerts).length > 0) {
            cropBatches[tokenId].certifications = string(abi.encodePacked(currentCerts, ",", certification));
        } else {
            cropBatches[tokenId].certifications = certification;
        }
        
        emit CertificationAdded(tokenId, certification);
    }
    
    function scanProduct(uint256 tokenId) external whenNotPaused {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        require(!hasScanned[tokenId][msg.sender], "CropNFT: Already scanned by this user");
        
        hasScanned[tokenId][msg.sender] = true;
        engagementData[tokenId].totalScans += 1;
        
        greenPoints.awardScanPoints(msg.sender);
        farmerReputation[cropBatches[tokenId].farmer] += 1;
        
        emit CropScanned(tokenId, msg.sender, engagementData[tokenId].totalScans);
    }
    
    function rateProduct(uint256 tokenId, uint256 rating) external whenNotPaused {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        require(rating >= 1 && rating <= MAX_RATING, "CropNFT: Rating must be between 1-5");
        require(hasScanned[tokenId][msg.sender], "CropNFT: Must scan before rating");
        require(!hasRated[tokenId][msg.sender], "CropNFT: Already rated by this user");
        
        hasRated[tokenId][msg.sender] = true;
        ratings[tokenId][msg.sender] = rating;
        
        _updateAverageRating(tokenId, rating);
        
        greenPoints.awardRatePoints(msg.sender);
        farmerReputation[cropBatches[tokenId].farmer] += rating;
        
        emit CropRated(tokenId, msg.sender, rating);
    }
    
    function shareProduct(uint256 tokenId) external whenNotPaused {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        require(hasScanned[tokenId][msg.sender], "CropNFT: Must scan before sharing");
        
        engagementData[tokenId].socialShares += 1;
        
        greenPoints.awardSharePoints(msg.sender);
        farmerReputation[cropBatches[tokenId].farmer] += 2;
        
        emit CropShared(tokenId, msg.sender, engagementData[tokenId].socialShares);
    }
    
    function updateStatus(uint256 tokenId, string memory newStatus) external whenNotPaused {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "CropNFT: Not token owner");
        require(bytes(newStatus).length > 0, "CropNFT: Status cannot be empty");
        
        cropBatches[tokenId].status = newStatus;
        
        if (keccak256(bytes(newStatus)) == keccak256(bytes("harvested"))) {
            cropBatches[tokenId].harvestDate = block.timestamp;
        }
        
        emit StatusUpdated(tokenId, newStatus);
    }
    
    function bulkScan(uint256[] calldata tokenIds) external whenNotPaused {
        require(tokenIds.length > 0, "CropNFT: Empty token array");
        require(tokenIds.length <= 20, "CropNFT: Too many tokens at once");
        
        uint256 scannedCount = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            if (tokenExists(tokenId) && !hasScanned[tokenId][msg.sender]) {
                hasScanned[tokenId][msg.sender] = true;
                engagementData[tokenId].totalScans += 1;
                farmerReputation[cropBatches[tokenId].farmer] += 1;
                scannedCount += 1;
                
                emit CropScanned(tokenId, msg.sender, engagementData[tokenId].totalScans);
            }
        }
        
        if (scannedCount > 0) {
            for (uint256 j = 0; j < scannedCount; j++) {
                greenPoints.awardScanPoints(msg.sender);
            }
        }
    }
    
    function _updateAverageRating(uint256 tokenId, uint256 newRating) internal {
        EngagementData storage engagement = engagementData[tokenId];
        uint256 totalRatingSum = (engagement.averageRating * engagement.totalRatings) + (newRating * RATING_PRECISION);
        engagement.totalRatings += 1;
        engagement.averageRating = totalRatingSum / engagement.totalRatings;
    }
    
    // View functions
    function getFarmerCrops(address farmer) external view returns (uint256[] memory) {
        return farmerCrops[farmer];
    }
    
    function getCropBatch(uint256 tokenId) external view returns (CropBatch memory) {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        return cropBatches[tokenId];
    }
    
    function getEngagementData(uint256 tokenId) external view returns (EngagementData memory) {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        return engagementData[tokenId];
    }
    
    function getCropRating(uint256 tokenId) external view returns (uint256, uint256, uint256) {
        require(tokenExists(tokenId), "CropNFT: Token does not exist");
        EngagementData memory engagement = engagementData[tokenId];
        
        return (
            engagement.averageRating / RATING_PRECISION,
            engagement.totalRatings,
            engagement.averageRating
        );
    }
    
    function getFarmerStats(address farmer) external view returns (uint256, uint256, uint256, uint256) {
        uint256[] memory crops = farmerCrops[farmer];
        uint256 totalScans = 0;
        uint256 totalRatings = 0;
        
        for (uint256 i = 0; i < crops.length; i++) {
            totalScans += engagementData[crops[i]].totalScans;
            totalRatings += engagementData[crops[i]].totalRatings;
        }
        
        return (crops.length, farmerReputation[farmer], totalScans, totalRatings);
    }
    
    function updateGreenPointsContract(address _greenPoints) external onlyOwner {
        require(_greenPoints != address(0), "CropNFT: GreenPoints address cannot be zero");
        greenPoints = IGreenPoints(_greenPoints);
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function _update(address to, uint256 tokenId, address auth) internal override whenNotPaused returns (address) {
        return super._update(to, tokenId, auth);
    }
}