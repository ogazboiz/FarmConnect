// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/FarmToken.sol";
import "../src/GreenPoints.sol";
import "../src/CropNFT.sol";
import "../src/FarmerDAO.sol";
import "../src/AgriBounties.sol";

contract AgriDAOIntegrationTest is Test {
    // Contracts
    FarmToken public farmToken;
    GreenPoints public greenPoints;
    CropNFT public cropNFT;
    FarmerDAO public farmerDAO;
    AgriBounties public agriBounties;
    
    // Test accounts
    address public owner = address(this);
    address public maria = makeAddr("maria");      // Farmer 1
    address public john = makeAddr("john");        // Farmer 2
    address public grace = makeAddr("grace");      // Farmer 3
    address public alice = makeAddr("alice");      // Consumer
    address public techCorp = makeAddr("techCorp"); // Company
    address public researcher = makeAddr("researcher"); // Researcher
    
    // Test constants
    uint256 constant INITIAL_FARM_SUPPLY = 1000000 * 10**18;
    uint256 constant FARMER_INITIAL_BALANCE = 10000 * 10**18;
    
    function setUp() public {
        // Deploy contracts
        farmToken = new FarmToken();
        greenPoints = new GreenPoints();
        cropNFT = new CropNFT(address(greenPoints));
        farmerDAO = new FarmerDAO(address(farmToken));
        agriBounties = new AgriBounties(address(farmToken), address(techCorp));
        
        // Setup permissions
        greenPoints.addMinter(address(cropNFT));
        farmToken.addMinter(address(agriBounties));
        
        // Fund test accounts with FARM tokens
        farmToken.mint(maria, FARMER_INITIAL_BALANCE);
        farmToken.mint(john, FARMER_INITIAL_BALANCE);
        farmToken.mint(grace, FARMER_INITIAL_BALANCE);
        farmToken.mint(techCorp, 100000 * 10**18); // Large amount for bounties
        
        // Label addresses for better debugging
        vm.label(maria, "Maria");
        vm.label(john, "John");
        vm.label(grace, "Grace");
        vm.label(alice, "Alice");
        vm.label(techCorp, "TechCorp");
        vm.label(researcher, "Researcher");
    }
    
    function test_FullWorkflow() public {
        // Test the complete AgriDAO workflow
        _testCropCreationAndTraceability();
        _testDAOGovernance();
        _testBountySystem();
        _testIntegratedEcosystem();
    }
    
    function _testCropCreationAndTraceability() internal {
        console.log("=== Testing Crop Creation & Traceability ===");
        
        // Maria creates a crop batch
        vm.startPrank(maria);
        uint256 tokenId = cropNFT.createCropBatch(
            "Organic Cherry Tomatoes",
            "Kiambu County, Kenya",
            true,
            500,
            "ipfs://QmTomatoPhoto123"
        );
        vm.stopPrank();
        
        assertEq(tokenId, 1, "First token should have ID 1");
        assertEq(cropNFT.ownerOf(tokenId), maria, "Maria should own the NFT");
        
        // Add certifications
        vm.prank(maria);
        cropNFT.addCertification(tokenId, "Kenya Organic Certified");
        
        // Consumer (Alice) interacts with the crop
        vm.startPrank(alice);
        cropNFT.scanProduct(tokenId);
        assertEq(greenPoints.balanceOf(alice), greenPoints.SCAN_POINTS(), "Alice should receive scan points");
        
        cropNFT.rateProduct(tokenId, 5);
        assertEq(greenPoints.balanceOf(alice), greenPoints.SCAN_POINTS() + greenPoints.RATE_POINTS(), "Alice should receive rate points");
        
        cropNFT.shareProduct(tokenId);
        uint256 expectedTotal = greenPoints.SCAN_POINTS() + greenPoints.RATE_POINTS() + greenPoints.SHARE_POINTS();
        assertEq(greenPoints.balanceOf(alice), expectedTotal, "Alice should receive share points");
        vm.stopPrank();
        
        // Check farmer reputation increased
        assertGt(cropNFT.farmerReputation(maria), 0, "Maria's reputation should have increased");
        
        console.log("Crop creation and consumer engagement working");
    }
    
    function _testDAOGovernance() internal {
        console.log("=== Testing DAO Governance ===");
        
        // Farmers join DAO
        vm.prank(maria);
        farmerDAO.joinDAO("Kiambu County, Kenya");
        
        vm.prank(john);
        farmerDAO.joinDAO("Nakuru County, Kenya");
        
        vm.prank(grace);
        farmerDAO.joinDAO("Eldoret, Kenya");
        
        assertEq(farmerDAO.getMemberCount(), 3, "Should have 3 DAO members");
        
        // Farmers stake tokens
        vm.startPrank(maria);
        farmToken.approve(address(farmerDAO), 1000 * 10**18);
        farmerDAO.stakeTokens(1000 * 10**18);
        vm.stopPrank();
        
        vm.startPrank(john);
        farmToken.approve(address(farmerDAO), 500 * 10**18);
        farmerDAO.stakeTokens(500 * 10**18);
        vm.stopPrank();
        
        vm.startPrank(grace);
        farmToken.approve(address(farmerDAO), 300 * 10**18);
        farmerDAO.stakeTokens(300 * 10**18);
        vm.stopPrank();
        
        // Fund DAO treasury
        vm.deal(maria, 10 ether);
        vm.prank(maria);
        farmerDAO.fundTreasury{value: 5 ether}();
        
        assertEq(address(farmerDAO).balance, 5 ether, "DAO should have 5 ETH in treasury");
        
        // Maria creates a proposal
        vm.prank(maria);
        uint256 proposalId = farmerDAO.createProposal(
            "Buy Community Tractor",
            "Purchase shared tractor for local farmers",
            2 ether,
            FarmerDAO.ProposalType.EQUIPMENT,
            john
        );
        
        assertEq(proposalId, 1, "First proposal should have ID 1");
        
        // All farmers vote
        vm.prank(maria);
        farmerDAO.vote(proposalId, true);
        
        vm.prank(john);
        farmerDAO.vote(proposalId, true);
        
        vm.prank(grace);
        farmerDAO.vote(proposalId, true);
        
        // Fast forward time to end voting period
        vm.warp(block.timestamp + 8 days);
        
        // Execute proposal
        uint256 johnBalanceBefore = john.balance;
        farmerDAO.executeProposal(proposalId);
        
        assertEq(john.balance, johnBalanceBefore + 2 ether, "John should receive 2 ETH for tractor");
        
        console.log("DAO governance working correctly");
    }
    
    function _testBountySystem() internal {
        console.log("=== Testing Bounty System ===");
        
        // TechCorp creates a bounty
        vm.startPrank(techCorp);
        farmToken.approve(address(agriBounties), 20000 * 10**18);
        uint256 bountyId = agriBounties.createBounty(
            "Drought-Resistant Maize",
            "Develop maize variety surviving 60+ days without water",
            "Crop Development",
            10000 * 10**18,
            30
        );
        vm.stopPrank();
        
        assertEq(bountyId, 1, "First bounty should have ID 1");
        
        // Give researcher some reputation
        // vm.prank(address(agriBounties));
        agriBounties.verifyExpert(researcher);
        
        // Researcher submits solution
        vm.prank(researcher);
        uint256 submissionId = agriBounties.submitToBounty(
            bountyId,
            "ipfs://QmResearchSolution123"
        );
        
        assertEq(submissionId, 1, "First submission should have ID 1");
        
        // TechCorp completes bounty and selects winner
        vm.prank(techCorp);
        agriBounties.completeBounty(bountyId, submissionId);
        
        // Check researcher received reward
        assertEq(farmToken.balanceOf(researcher), 10000 * 10**18, "Researcher should receive 10,000 FARM tokens");
        
        console.log(" Bounty system working correctly");
    }
    
    function _testIntegratedEcosystem() internal {
        console.log("=== Testing Integrated Ecosystem ===");
        
        // Test that all systems work together
        
        // 1. Check token balances across system
        uint256 totalFarmInSystem = farmToken.balanceOf(maria) + 
                                   farmToken.balanceOf(john) + 
                                   farmToken.balanceOf(grace) + 
                                   farmToken.balanceOf(researcher) +
                                   farmToken.balanceOf(address(farmerDAO)) +
                                   farmToken.balanceOf(address(agriBounties));
        
        // Should be close to initial supply (minus fees and burns)
        assertLe(totalFarmInSystem, INITIAL_FARM_SUPPLY + FARMER_INITIAL_BALANCE * 4 + 100000 * 10**18, "Token conservation check");
        
        // 2. Check cross-contract interactions
        assertTrue(greenPoints.minters(address(cropNFT)), "CropNFT should be authorized to mint GREEN points");
        assertTrue(farmToken.minters(address(agriBounties)), "AgriBounties should be authorized to mint FARM tokens");
        
        // 3. Check that farmers have reputation from crop interactions
        assertGt(cropNFT.farmerReputation(maria), 0, "Maria should have reputation from consumer interactions");
        
        // 4. Check DAO voting power includes reputation
        uint256 mariaPower = farmerDAO.getVotingPower(maria);
        assertGe(mariaPower, 1000 * 10**18, "Maria's voting power should include reputation bonus");
        
        console.log("Integrated ecosystem working correctly");
    }
    
    // Test edge cases and security
    function test_SecurityChecks() public {
        // Test unauthorized access
        vm.expectRevert();
        vm.prank(alice);
        greenPoints.awardScanPoints(alice); // Alice can't mint points directly
        
        // Test double scanning prevention
        vm.startPrank(maria);
        uint256 tokenId = cropNFT.createCropBatch("Test Crop", "Test Location", false, 100, "ipfs://test");
        vm.stopPrank();
        
        vm.startPrank(alice);
        cropNFT.scanProduct(tokenId);
        
        vm.expectRevert("CropNFT: Already scanned by this user");
        cropNFT.scanProduct(tokenId); // Should fail on second scan
        vm.stopPrank();
        
        // Test DAO proposal requirements
        vm.expectRevert("FarmerDAO: Not a DAO member");
        vm.prank(alice);
        farmerDAO.createProposal("Test", "Test", 1 ether, FarmerDAO.ProposalType.FUNDING, alice);
        
        console.log(" Security checks passed");
    }
    
    // Test gas usage
    function test_GasUsage() public {
        uint256 gasBefore = gasleft();
        
        vm.prank(maria);
        cropNFT.createCropBatch("Gas Test Crop", "Test Location", true, 1000, "ipfs://test");
        
        uint256 gasUsed = gasBefore - gasleft();
        console.log("Gas used for crop creation:", gasUsed);
        
        // Ensure reasonable gas usage (should be under 500k)
        assertLt(gasUsed, 500000, "Crop creation should use reasonable gas");
    }
    
    // Fuzz testing
    function testFuzz_CropCreation(uint256 quantity, bool isOrganic) public {
        vm.assume(quantity > 0 && quantity < type(uint128).max);
        
        vm.prank(maria);
        uint256 tokenId = cropNFT.createCropBatch(
            "Fuzz Crop",
            "Fuzz Location",
            isOrganic,
            quantity,
            "ipfs://fuzz"
        );
        
        assertEq(cropNFT.ownerOf(tokenId), maria);
        
        (,,,bool organic, uint256 qty,,,,,) = cropNFT.cropBatches(tokenId);
        assertEq(organic, isOrganic);
        assertEq(qty, quantity);
    }
}