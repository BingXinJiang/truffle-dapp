/**

Solidity 编写智能合约的案例（一）Voting

The following contract is quite complex, but showcases a lot of Solidity’s features. It implements a voting contract. Of course, the main problems of electronic voting is how to assign voting rights to the correct persons and how to prevent manipulation. We will not solve all problems here, but at least we will show how delegated voting can be done so that vote counting is automatic and completely transparent at the same time.

下面的这个合约相对复杂一些，但是展示了许多Solidity的特性。它实现了一个简单的投票合约。当然，电子投票的关键是如何为投票人分配权限给正确的投票人，阻止那些非法的投票人。虽然这里我们没有实现所有的功能，但是可以代理投票，同时自动计算票数且完全透明。

The idea is to create one contract per ballot, providing a short name for each option. Then the creator of the contract who serves as chairperson will give the right to vote to each address individually.

我们为每一个选票创建一个合同，并提供了一个简称。合同的创建者也就是chairperson有权将投票权分配到每个地址。

The persons behind the addresses can then choose to either vote themselves or to delegate their vote to a person they trust.

被分配了投票权的地址就可以他们自己投票，也可以将投票权代理给他们信任的人。

At the end of the voting time, winningProposal() will return the proposal with the largest number of votes.

投票结束，winningProposal()将会返回获得票数最多的选票。

*/

pragma solidity ^0.4.22;

/// @title Voting with delegation.
/// 附带代理的投票系统
contract Ballot {

	// This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    // 这里声明了一个复杂的数据类型，它代表了一个独立的投票者。
	struct Voter {
		uint weight;// weight is accumulated by delegation 投票者拥有的投票权重
		bool voted;// if true, that person already voted 投票者是否已经投票，若为true则已经投票
		address delegate;// person delegated to 投票者指定的代理
		uint vote;// index of the voted proposal 投票者所投的提案
	}

	// This is a type for a single proposal.
	// 这里声明了一个提案类
	struct Proposal {
		bytes32 name;// short name (up to 32 bytes)
		uint voteCount;// number of accumulated votes
	}

	address public chairperson;

	// This declares a state variable that
    // stores a `Voter` struct for each possible address.
    // 这里声明了一个mapping，存储了每一个Voter的address
	mapping(address => Voter) public voters;

	 // A dynamically-sized array of `Proposal` structs.
	 // 一个用来存储提案的动态数组
	Proposal[] public proposals;

	//Create a new ballot to choose one of `proposalNames`.
	//构造函数，初始化投票系统，初始化提案
	constructor(bytes32[] proposalNames) public {
		chairperson = msg.sender;
		voters[chairperson].weight = 1;

		// For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        // 为每一个提案名称创建一个提案对象，并存储到数组里
		for(uint i=0; i<proposalNames.length; i++) {
			// `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            // 每一个提案对象包含提案名称和被投票数（初始化每个提案的被投票数都为0）
			proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
		}
	}

	// Give `voter` the right to vote on this ballot.
    // May only be called by `chairperson`.
    // 给系统里的voter分配投票权，只有chairperson才可以这么做
	function giveRightToVote(address voter) public {
		// If the first argument of `require` evaluates
        // to `false`, execution terminates and all
        // changes to the state and to Ether balances
        // are reverted.
        // This used to consume all gas in old EVM versions, but
        // not anymore.
        // It is often a good idea to use `require` to check if
        // functions are called correctly.
        // As a second argument, you can also provide an
        // explanation about what went wrong.
        // 如果require函数的第一个参数返回false，那么所有的状态改变和Ether账户都将被回滚。
        // 经常可以使用require函数来检查函数是否被正确调用，第二个参数用来提示发生了什么错误。
		require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
	}

	// Delegate your vote to the voter `to`.
	// 将投票权代理给其他人
	function delegate(address to) public{
		// assigns reference 指定引用
		Voter storage sender = voters[msg.sender];
		require(!sender.voted, "you already voted");

		require(to != msg.sender, "Self-delegation is disallowed.");

		// Forward the delegation as long as
        // `to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be executed,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        // 如果你指向的代理也添加了代理，则将你的代理指向代理的代理
        // 一般来说，这种循环是很危险的，一旦它们运行很久，它们可能会消耗账户中的可用gas。
        // 
		while(voters[to].delegate != address(0)){
			to = voters[to].delegate;
			// We found a loop in the delegation, not allowed.
			// 如果to指向了调用方，这回造成死循环，require函数打破循环
			require(to != msg.sender, "Found loop in delegation.");
		}

		// Since `sender` is a reference, this
        // modifies `voters[msg.sender].voted`
        // 设定代理方的voted为true即已投票
		sender.voted = true;
		sender.delegate = to;
		Voter storage delegate_ = voters[to];
		if(delegate_.voted){
			// If the delegate already voted,
            // directly add to the number of votes
            // 如果被代理方已经投票，则直接将代理方的投票权重添加到被代理方所投的提案
            proposals[delegate_.vote].voteCount += sender.weight;
		}else{
			// If the delegate did not vote yet,
            // add to her weight.
            // 如果代理方未投票，则增加被代理方的投票权重为代理方的投票权重
            delegate_.weight += sender.weight;
		}
	}

	/// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    // 投票给你选中的提案（包含代理给你的投票，也会同时投票给该提案）
	function vote(uint proposal){
		Voter storage sender = voters[msg.sender];
		require(!sender.voted, 'Already voted');
		sender.voted = true;
		sender.vote = proposal;
		// If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        // 如果你的选中的提案不在提案库里，会自动抛出，并回滚所有的改变
		proposals[proposal].voteCount += sender.weight;
	}

	/// @dev Computes the winning proposal taking all
    /// previous votes into account.
    // 基于之前的投票信息，计算胜出的提案
	function winningProposal() public view returns (uint winningProposal_){
		uint winningVoteCount = 0;
		for(uint p=0; p<proposals.length; p++){
			if(proposals[p].voteCount > winningVoteCount){
				winningVoteCount = proposals[p].voteCount;
				winningProposal_ = p;
			}
		}
	}

	// Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    // 调用winningProposal，获取提案库里获胜的提案，返回提案的名称。
    function winnerName() public view returns (bytes32 winnerName_){
    	winnerName_ = proposals[winningProposal()].name;
    }
}

/**
Possible Improvements

潜在的改进

Currently, many transactions are needed to assign the rights to vote to all participants. Can you think of a better way?

目前需要很多交易，才能将投票权赋予更多的人，你是否有更好的方案呢？
*/






















