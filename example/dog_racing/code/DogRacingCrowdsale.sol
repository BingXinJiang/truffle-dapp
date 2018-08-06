pragma solidity ^0.4.19;

import './SafeMath.sol';
import './DogRacingToken.sol';

/**
 * DogRacing Crowdsale
 */
contract DogRacingCrowdsale {
  using SafeMath for uint256;

  DogRacingToken public token;		// Token contract address

  uint256 public stage1_start;		// Crowdsale timing
  uint256 public stage2_start;
  uint256 public stage3_start;
  uint256 public stage4_start;
  uint256 public crowdsale_end;

  uint256 public stage1_price;		// Prices in token millis / ETH
  uint256 public stage2_price;		
  uint256 public stage3_price;		
  uint256 public stage4_price;

  uint256 public hard_cap_wei;		// Crowdsale hard cap in wei

  address public owner;   			// Owner address

  uint256 public wei_raised;		// Total Wei raised by crowdsale

  event TokenPurchase(address buyer, uint256 weiAmount, uint256 tokensAmount);

  modifier onlyOwner {
    require(owner == msg.sender);
   _;
  }

  modifier withinCrowdsaleTime {
	require(now >= stage1_start && now < crowdsale_end);
	_;
  }

  modifier afterCrowdsale {
	require(now >= crowdsale_end);
	_;
  }

  modifier withinCap {
  	require(wei_raised < hard_cap_wei);
	_;
  }

  // Constructor
  function DogRacingCrowdsale(DogRacingToken _token,
  							  uint256 _stage1_start, uint256 _stage2_start, uint256 _stage3_start, uint256 _stage4_start, uint256 _crowdsale_end,
  							  uint256 _stage1_price, uint256 _stage2_price, uint256 _stage3_price, uint256 _stage4_price,
  							  uint256 _hard_cap_wei) public {
  	require(_stage1_start > now);
  	require(_stage2_start > _stage1_start);
  	require(_stage3_start > _stage2_start);
  	require(_stage4_start > _stage3_start);
  	require(_crowdsale_end > _stage4_start);
  	require(_stage1_price > 0);
  	require(_stage2_price < _stage1_price);
  	require(_stage3_price < _stage2_price);
  	require(_stage4_price < _stage3_price);
  	require(_hard_cap_wei > 0);
    require(_token != address(0));

  	owner = msg.sender;

  	token = _token;

  	stage1_start = _stage1_start;
  	stage2_start = _stage2_start;
  	stage3_start = _stage3_start;
  	stage4_start = _stage4_start;
  	crowdsale_end = _crowdsale_end;

  	stage1_price = _stage1_price;
  	stage2_price = _stage2_price;
  	stage3_price = _stage3_price;
  	stage4_price = _stage4_price;

  	hard_cap_wei = _hard_cap_wei;
  }

  // get current price in token millis / ETH
  function getCurrentPrice() public view withinCrowdsaleTime returns (uint256) {
  	if (now < stage2_start) {
  		return stage1_price;
  	} else if (now < stage3_start) {
  		return stage2_price;
  	} else if (now < stage4_start) {
  		return stage3_price;
  	} else {
  		return stage4_price;
  	}
  }

  // get amount in token millis for amount in wei
  function getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
    uint256 price = getCurrentPrice();
    return weiAmount.mul(price).div(1 ether);
  }

  // fallback function
  function () external payable {
    buyTokens(msg.sender);
  }

  // tokens fallback function
  function tokenFallback(address, uint256, bytes) external pure {
  }

  // tokens purchase
  function buyTokens(address beneficiary) public withinCrowdsaleTime withinCap payable {
   	uint256 wei_amount = msg.value;
    
    require(beneficiary != address(0));
    require(wei_amount != 0);
 
    // calculate token amount to be sold
    uint256 tokens = getTokenAmount(wei_amount);

    // update state
    wei_raised = wei_raised.add(wei_amount);
    require(wei_raised <= hard_cap_wei);

    // deliver tokens
    token.transfer(beneficiary, tokens);

    TokenPurchase(beneficiary, wei_amount, tokens);

    // deliver ether
    owner.transfer(msg.value);
  }

  // Remaining tokens withdrawal
  function withdrawTokens() external onlyOwner afterCrowdsale {
  	uint256 tokens_remaining = token.balanceOf(address(this));
  	token.transfer(owner, tokens_remaining);
  }

}
