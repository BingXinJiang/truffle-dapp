/**

Blind Auction  盲拍

In this section, we will show how easy it is to create a completely blind auction contract on Ethereum. We will start with an open auction where everyone can see the bids that are made and then extend this contract into a blind auction where it is not possible to see the actual bid until the bidding period ends.
在本节中我们将会展示使用以太坊创建一个盲拍可约是多么便捷。我们先以公开拍卖开始，公开拍卖过程中，每个人都可以以看到所有投标，然后我们会将这份合约扩展到盲拍，即在竞标期间没法看到投标，直到竞标结束才可以看到。

Simple Open Auction 简单的公开拍卖

The general idea of the following simple auction contract is that everyone can send their bids during a bidding period. The bids already include sending money / ether in order to bind the bidders to their bid. If the highest bid is raised, the previously highest bidder gets her money back. After the end of the bidding period, the contract has to be called manually for the beneficiary to receive his money - contracts cannot activate themselves.
在下面这份简单的公开拍卖合约中，竞标期间每个人都可以投标。投标的方式包括发送以太币或者金钱，以使他们的投标和他们本身绑定。如果有更高的标出现，之前的投标者就可以拿回他们的钱了。投标结束后，合同必须手动调用，让受益人接收他的钱，合约本身不会自动执行。

*/

pragma solidity ^0.4.22;

contract SImpleAuction {

	address public beneficiary;
	uint public auctionEnd;

	address public highestBidder;
	uint public highestBid;

	mapping(address => uint) pendingRetruns;

	bool ended;

	event HighestBidIncreased(address bidder, uint amount);
	event AuctionEnded(address winner, uint amount);

	constructor(uint _bidingTime, address _beneficiary)public{
		beneficiary = _beneficiary;
		auctionEnd = now + _beneficiary;
	}

	function bid() public payable{

		require(now <= auctionEnd, 'Auction already end!');

		//这里是不是有错误
		require(msg.value > highestBid, 'There already is a higher bid');

		if(highestBid != 0){
			pendingRetruns[highestBidder] += highestBid;
		}

		highestBidder = msg.sender;
		highestBid = msg.value;
		emit HighestBidIncreased(msg.sender, msg.value);

	}

}























