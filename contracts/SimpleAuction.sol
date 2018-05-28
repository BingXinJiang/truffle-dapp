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

	// Parameters of the auction. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    // 参数定义。时间可以是unix时间戳，或者持续秒数。
	address public beneficiary;
	uint public auctionEnd;

	// Current state of the auction.
	// 拍卖的当前状态，记录最高投标者和最高价。
	address public highestBidder;
	uint public highestBid;

	// Allowed withdrawals of previous bids
	// 允许撤回之前的标
	mapping(address => uint) pendingRetruns;

	// Set to true at the end, disallows any change
	// 拍卖结束的控制变量。结束设置为true，不允许再改变。
	bool ended;

	// Events that will be fired on changes.
	// 改变发生的时候，触发的事件
	event HighestBidIncreased(address bidder, uint amount);
	event AuctionEnded(address winner, uint amount);

	// The following is a so-called natspec comment,
    // recognizable by the three slashes.
    // It will be shown when the user is asked to
    // confirm a transaction.
    // 下面的以///开头的是natspec评论，它们将会在用户发起确认交易的时候提示给用户

    /// Create a simple auction with `_biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `_beneficiary`.
    /// 创建有个简单的拍卖，包含了拍卖期，和受益人信息。
	constructor(uint _bidingTime, address _beneficiary)public{
		beneficiary = _beneficiary;
		auctionEnd = now + _bidingTime;
	}

	/// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    /// 伴随着交易发起一次竞标。竞标的金额会被退回，如果最后没有赢得拍卖。
	function bid() public payable{
		// No arguments are necessary, all
        // information is already part of
        // the transaction. The keyword payable
        // is required for the function to
        // be able to receive Ether.
        // 由于所有的信息已经被包含在交易中，故本函数不需要参数。
        // 由于需要接收以太币，该函数需要是可支付的。

        // Revert the call if the bidding
        // period is over.
        // 如果拍卖结束，回滚调用。
		require(now <= auctionEnd, 'Auction already end!');

		// If the bid is not higher, send the
        // money back.
        // 如果投标价格低于目前的最高投标价，给出提示，将money退回。
		require(msg.value > highestBid, 'There already is a higher bid');

		if(highestBid != 0){
			// Sending back the money by simply using
            // highestBidder.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves.
            // 简单地使用函数highestBidder.send(highestBid)退回资金是有安全隐患的，因为它可以执行不受信任的合约
            // 通常来说让收款人自己回收资金是相对比较安全的。
			pendingRetruns[highestBidder] += highestBid;
		}

		highestBidder = msg.sender;
		highestBid = msg.value;
		emit HighestBidIncreased(msg.sender, msg.value);

	}

	/// Withdraw a bid that was overbid.
	/// 撤销已投出的标
	function withdraw() public returns(bool){
		uint amount = pendingRetruns[msg.sender;
		if(amount > 0){
			// It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            // 将它设置为0是必要的，因为接收者，可能在send函数返回之前，再次调用该函数。
			pendingRetruns[msg.sender] = 0;

			if(!msg.sender.send(amount)){
				// No need to call throw here, just reset the amount owing
				pendingRetruns[msg.sender] = amount;
				return false;
			}
		}
		return true;
	}

	/// End the auction and send the highest bid
    /// to the beneficiary.
    /// 拍卖结束，将最高的竞价发送给受益人
	function auctionEnd() public {

		// It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 将与其他合约的交互分成三个阶段是一个好的指引。例如：调用函数，或者发送Ether
        // 1. checking conditions
        // 1.检查条件
        // 2. performing actions (potentially changing conditions)
        // 2、执行行为（潜在的条件变化）
        // 3. interacting with other contracts
        // 3.与其他合约交互
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.
        // 如果这些阶段混合在一起，其他合约可能回调到合约中，频繁的修改状态或影响执行效果。
        // 如果函数的内部调用包含了与外部合约的交互，那么与外部合约的交互也是必须要考虑的。

        // 1. Conditions
        // 1、条件
		require(now >= auctionEnd, 'Auction not yet ended.');
		require(!ended, 'auctionEnd has already been called.');

		// 2. Effects
		// 2、效果
		ended = true;
		emit AuctionEnded(highestBidder, highestBid);

		// 3. Interaction
		// 3、交互
		beneficiary.transfer(highestBid);
	}

}























