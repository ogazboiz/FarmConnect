-include .env


deploy:
	@echo "Deploying to mantle netwwork chain_id=5003..."
	@forge script ./script/Deploy.s.sol --rpc-url ${MANTLE_RPC_URL}  --broadcast --private-key ${PRIVATE_KEY}