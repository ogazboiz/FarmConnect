// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


interface IFarmToken {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
