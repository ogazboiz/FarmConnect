// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/FarmToken.sol";
import "../src/GreenPoints.sol";
import "../src/CropNFT.sol";
import "../src/FarmerDAO.sol";
import "../src/AgriBounties.sol";

contract DeployAgriDAO is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying AgriDAO contracts...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy FarmToken
        console.log("Deploying FarmToken...");
        FarmToken farmToken = new FarmToken();
        console.log("FarmToken deployed at:", address(farmToken));
        
        // 2. Deploy GreenPoints
        console.log("Deploying GreenPoints...");
        GreenPoints greenPoints = new GreenPoints();
        console.log("GreenPoints deployed at:", address(greenPoints));
        
        // 3. Deploy CropNFT
        console.log("Deploying CropNFT...");
        CropNFT cropNFT = new CropNFT(address(greenPoints));
        console.log("CropNFT deployed at:", address(cropNFT));
        
        // 4. Deploy FarmerDAO
        console.log("Deploying FarmerDAO...");
        FarmerDAO farmerDAO = new FarmerDAO(address(farmToken));
        console.log("FarmerDAO deployed at:", address(farmerDAO));
        
        // 5. Deploy AgriBounties
        console.log("Deploying AgriBounties...");
        AgriBounties agriBounties = new AgriBounties(address(farmToken), deployer);
        console.log("AgriBounties deployed at:", address(agriBounties));
        
        // 6. Setup permissions
        console.log("Setting up permissions...");
        greenPoints.addMinter(address(cropNFT));
        farmToken.addMinter(address(agriBounties));
        
        vm.stopBroadcast();
        
        console.log("=== AgriDAO Deployment Complete ===");
        console.log("FarmToken:", address(farmToken));
        console.log("GreenPoints:", address(greenPoints));
        console.log("CropNFT:", address(cropNFT));
        console.log("FarmerDAO:", address(farmerDAO));
        console.log("AgriBounties:", address(agriBounties));
        
        // Save addresses to file for frontend integration
        string memory addresses = string(abi.encodePacked(
            "export const FARM_TOKEN = '", vm.toString(address(farmToken)), "';\n",
            "export const GREEN_POINTS = '", vm.toString(address(greenPoints)), "';\n",
            "export const CROP_NFT = '", vm.toString(address(cropNFT)), "';\n",
            "export const FARMER_DAO = '", vm.toString(address(farmerDAO)), "';\n",
            "export const AGRI_BOUNTIES = '", vm.toString(address(agriBounties)), "';\n"
        ));
        
        vm.writeFile("./deployed-addresses.js", addresses);
        console.log("Contract addresses saved to deployed-addresses.js");
    }
}