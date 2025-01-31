// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/token/ERC20/IERC20.sol";

contract Wallet {

    mapping(address => uint256) public balance;

    address private owner;
    
    string public name;

    constructor(string memory _name, address _owner) {
        name = _name;
        owner = _owner;
    }

    modifier owner_only() {require(msg.sender == owner, "Only owner can call this function."); _;}

    function deposit(address token, uint256 amount) external payable {
        balance[token] += amount;
    }

    function transfer(address token, uint256 amount, address to) external owner_only {
        require(amount > balance[token], "You do not have enough to transfer.");
        balance[token] -= amount;
        IERC20(token).transfer(to, amount);
    }

    function withdraw(address token, uint256 amount, address to) external owner_only {
        require(amount > balance[token], "You do not have enough to withdraw.");
        balance[token] -= amount;
        payable(to).transfer(amount);
    }

    function getBalances(address token_) public view returns (uint) {
        return balance[token_];
    }
}