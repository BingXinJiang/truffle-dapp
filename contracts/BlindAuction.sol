/**

The previous open auction is extended to a blind auction in the following. The advantage of a blind auction is that there is no time pressure towards the end of the bidding period. Creating a blind auction on a transparent computing platform might sound like a contradiction, but cryptography comes to the rescue.

上一个拍卖系统可以再做优化以扩展到下面的盲拍系统。盲拍系统的优势是不会有最后时间节点的竞标压力。在一个透明的计算系统里面创建一个盲拍系统看起来有点矛盾，但是通过密码学技术我们可以修正这个问题。

During the bidding period, a bidder does not actually send her bid, but only a hashed version of it. Since it is currently considered practically impossible to find two (sufficiently long) values whose hash values are equal, the bidder commits to the bid by that. After the end of the bidding period, the bidders have to reveal their bids: They send their values unencrypted and the contract checks that the hash value is the same as the one provided during the bidding period.

在投标期间，投标者不用实际发送他的标，只是发送了一个带有版本信息的hash值。由于无法找到两个相同的hash（计算上的不可行），因此使用hash值可以确保投标人是否投过标。投标结束，投标人必须公开他们的投标：他们发送未加密的标，合约会根据hash值自动校验是否与投标期间的值相同。

Another challenge is how to make the auction binding and blind at the same time: The only way to prevent the bidder from just not sending the money after he won the auction is to make her send it together with the bid. Since value transfers cannot be blinded in Ethereum, anyone can see the value.

另一个挑战是在保证盲拍的同时保证约束力：防止投标人中标后不支付的唯一方式就是让投标人在投标的时刻就支付价值。然而价值的转换是不能被隐藏的，每个人都可以看到。

The following contract solves this problem by accepting any value that is larger than the highest bid. Since this can of course only be checked during the reveal phase, some bids might be invalid, and this is on purpose (it even provides an explicit flag to place invalid bids with high value transfers): Bidders can confuse competition by placing several high or low invalid bids.

下面的合约通过接收任何大于最高价值投标的标来解决这个难题。因为这当然只能在披露阶段进行检查，所以有些出价可能是无效的，这是有意的（它甚至提供了一个明确的标志，用高价值转让放置无效的投标）：投标人可以通过放置几个高或 低无效出价。

*/

pragma solidity >0.4.23 <0.5.0;

contract BlindAuction {
	struct Bid {
		byte32 blindedBid;
		uint deposit;
	}

	address public beneficiary;
	uint public biddingEnd;
	uint public revealEnd;
	bool public ended;

	mapping(address => Bid[]) public bids;

	address public highestBidder;
	uint public highestBid;

	mapping(address => uint) pendingReturns;

	event AuctionEnded(address winner, uint highestBid);

	modifier onlyBefore(uint _time) { 
		require (now < _time); 
		_; 
	}
	modifier onlyAfter(uint _time) { 
		require (now > _time); 
		_; 
	}
	
	constructor(uint _biddingTime, uint _revealTime, address _beneficiary) public {
		beneficiary = _beneficiary;
		biddingEnd = now + _biddingTime;
		revealEnd = biddingEnd + _revealTime;
	}

	function bid(byte32 _blindedBid) public payable onlyBefore(biddingEnd){
		bids[msg.sender].push(Bid({
			blindedBid:_blindedBid,
			deposit:msg.value
			}));
	}
	
}
























