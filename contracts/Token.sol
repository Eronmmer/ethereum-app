//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
  string public name = "EronsKami Inu";
  string public symbol = "ERK";
  uint public totalSupply = 1000000;
  mapping(address => uint) balances;

  constructor() {
    balances[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint _value) external {
    require(balances[msg.sender] >= _value, "Not enough tokens");
    balances[msg.sender] -= _value;
    balances[_to] += _value;
  }

  function balanceOf(address _owner) external view returns (uint) {
    return balances[_owner];
  }
}