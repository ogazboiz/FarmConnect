-include .env


deploy:
	@echo "Deploying to mantle netwwork chain_id=5003..."
	@forge script ./script/Deploy.s.sol --rpc-url ${MANTLE_RPC_URL}  --broadcast --private-key ${PRIVATE_KEY} --etherscan-api-key ${MANTLE_SCAN} --verify -vvvvv
	# @forge script ./script/Deploy.s.sol --rpc-url ${MANTLE_RPC_URL}  --broadcast --private-key ${PRIVATE_KEY} -vvvvv

verify_farm_token:
	@echo "verify farmer token"
	@forge verify-contract \
  --rpc-url https://rpc.sepolia.mantle.xyz \
  --verifier blockscout \
  --verifier-url 'https://explorer.sepolia.mantle.xyz/api/' \
  	0x212Db2eb8E12cdf932ae3BE8aED63161dE053dEb \
  	src/FarmToken.sol:FarmToken


verify_agric_bounty: 
	@echo "verify the agric bounty"
	@forge verify-contract \
	--rpc-url https://rpc.sepolia.mantle.xyz \
	--verifier blockscout \
	--verifier-url 'https://explorer.sepolia.mantle.xyz/api/' \
	0x01355D158Ad72c5c01A602fc590Db2516fD15d24 \
	src/AgriBounties.sol:AgriBounties

verify_farmer_dao:
	@echo "verify farmer dao"
	@forge verify-contract \
	--rpc-url https://rpc.sepolia.mantle.xyz \
	--verifier blockscout \
	--verifier-url 'https://explorer.sepolia.mantle.xyz/api/' \
	0x572348b44031573DA6B3cFF61622F03C0486D99b \
	src/FarmerDAO.sol:FarmerDAO

verify_crop_nft:
	@echo "verify crop nft"
	@forge verify-contract \
	--rpc-url https://rpc.sepolia.mantle.xyz \
	--verifier blockscout \
	--verifier-url 'https://explorer.sepolia.mantle.xyz/api/' \
	0x0AC277ce98C04fc57cf7AABb61FF7b7312439cf0 \
	src/CropNFT.sol:CropNFT

verify_green_point:
	@echo "verify green point "
	@forge verify-contract \
	--rpc-url https://rpc.sepolia.mantle.xyz \
	--verifier blockscout \
	--verifier-url 'https://explorer.sepolia.mantle.xyz/api/' \
	0x706636B0aB3F4a00733deb17A55Ed67CBa0178e6 \
	src/GreenPoints.sol:GreenPoints

