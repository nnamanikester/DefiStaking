// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;
import './Tether.sol';
import './RWD.sol';

contract DecentralBank  {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;

  address[]  public stakers;
  
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;


  constructor(RWD _rwd, Tether _tether) public {
    owner = msg.sender;
    rwd = _rwd;
    tether = _tether;
  }

  function depositTokens(uint _amount) public {
    require(_amount > 0, 'amount cannot be 0');
    tether.transferFrom(msg.sender, address(this), _amount);

    stakingBalance[msg.sender] += _amount;

    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }

  function issueTokens() public {
    require(msg.sender == owner, 'caller must be the owner');

    for(uint i; i<stakers.length; i++) {
      address receipient = stakers[i];
      uint balance = stakingBalance[receipient] / 9;
      if(balance > 0) {
        rwd.transfer(receipient, balance);
      }
    }
  }

  function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'staking balance cannot be less than 0');
    tether.transfer(msg.sender, balance);
    stakingBalance[msg.sender] = 0;
    isStaking[msg.sender] = false;
  }

}
