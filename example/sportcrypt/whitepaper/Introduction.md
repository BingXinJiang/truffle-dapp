#1.Intruction

The designers of a prediction market must make many design and implementation decisions that will determine the ultimate utility of the platform. With SportCrypt we believe we have developed an excellent balance between simplicity, efficiency, and features. This paper explains the design and implementation of the SportCrypt platform at a technical level.

预测市场的设计者必须做出一些设计和实现一些决策，这些设计和决策将决定平台的最终效用。在SportCrypt中我们相信我们在简洁、有效和易用这些特点之间实现了有效的平衡。本页在技术层面解释了SportCrypt平台的设计和实现。

##1.1 Sports Betting 体育赌注

Although the SportCrypt contract is not specific to sports, this is our initial area of focus. For our purposes, sporting events have the following advantages over other instruments:

尽管SportCrypt合约不是特定针对体育的，但体育是我们开始所聚焦的区域。在我们看来，体育赛事对于我们的平台设计具有以下优势：

	*	Sports betting is a massive existing market that is not well-served by existing systems. Current systems suffer from unreliable, slow, and expensive payment processing, jurisdictional roadblocks, high trading fees, and significant counter- party risk. We believe that all of these problems have solutions in a distributed application.  体育竞博市场是一个富有激情的市场，但是并没有一个很好的系统服务于该市场。当前的系统存在着以下问题：不可靠、交易迟缓、严重的对手风险。我们相信在一个分布式的系统中所有这些问题都可以解决。
	*	Most sporting event outcomes are objective truths. These truths can by verified by watching the events on television, or by checking officially posted scores. Because of this, distributed oracles don’t appear to be as necessary as they are in other applications. There is less of an incentive for oracle manipulation since any alteration or misinterpretation of official results will be immediately obvious, to the detriment of the exchange’s reputation.  大部分的体育赛事结果都是广为人知的客观事实。这些客观事实可以通过电视或者官方发布的信息确认。正因为此，分布式的预测不像在其他系统中显得那么重要。由于对官方结果的任何改动或曲解将会很明显，影响到交易所的声誉，因此他们将会有很少的动机去更改。

##1.2 ETH-Denominated ETH计价

In SportCrypt, all trading is done with ether (ETH). No other tokens are necessary.

在SportCrypt中所有的交易都是使用ETH完成的。不需要任何其他的token。

Since ETH is by far the most liquid asset on the ethereum network, and is already a prerequisite for incorporating transactions into the ethereum blockchain, we feel that adding new special-purpose tokens to the trading flow is undesirable. Not only would users need to learn how and where to acquire these tokens, but to do so they would need to pay market spreads (which will be high prior to substantial demand) and trading fees (which may be denominated in yet more special-purpose tokens).

由于ETH是以太坊网络中流动性最好的资产，

Granted, even obtaining and using ETH is an obstacle for non-technical users. However, compared to other demographics, sports bettors are accustomed to having to jump through various hoops prior to being able to place bets. There is in fact an entire industry built around moving funds in unorthodox ways for the purpose of sports betting (NetTeller, Skrill).

##1.3 Custody of Funds 资金的托管

The primary advantage of using a smart contract for sports betting is to remove counter-party risk for the users of the exchange. Assuming there are no bugs in the
smart contract, not even the operators of the exchange are able to access funds held in balance or locked into trades. Nor are they able to freeze funds and accounts to prevent trading or withdrawals. The only attack vector for a malicious exchange is to mis-report the outcome of an event, in which case all participants of the match will be affected, and there will be indisputable evidence of the misbehavior recorded on the blockchain. We will discuss this further in the Oracles section of this paper.

If for whatever reason SportCrypt disappears or doesn’t finalize a match, funds can be recovered after waiting a certain period of time. See the Funds Recovery section below.

A corollary to SportCrypt not being able to freeze funds or interfere with trading is that we have no ability to reverse or unwind any activity on our platform. All trades are final. However, we are committed to building a reputable business. Any users who feel they have suffered losses due to errors on our part are encouraged to contact us.

##1.4 Fees 手续费

Our initial plan is to charge no fees or commissions. The only fees needed to participate in SportCrypt are the gas fees required by the ethereum network. See the Efficiency section below for an approximate quantification of gas costs.

Since the exchange deducts no fees or commissions, the trades placed through SportCrypt are entirely zero-sum between peer users of the exchange. This is hypothesized to have positive legal ramifications. We believe that a trade placed through SportCrypt is of the same nature as two individuals making a private bet between themselves.

##1.5 Fixed-odds 固定赔率

All trades on SportCrypt are fixed-odds bets. This means that the odds of a trade are known and agreed upon beforehand by the parties involved, and they cannot be changed after the fact. Of course, new subsequent trades can be made at different odds. Making new trades in the same direction as previous trades can serve to average up or down the position’s cost basis, and trades in the opposite direction can either fully or partially close out a position at a profit or a loss, in which case that account’s balance will be immediately credited.

Fixed-odds betting is distinct from parimutuel betting where all the bets on an event are pooled together and therefore the odds are only known at the end of the betting session (usually right before the event starts).

##1.6 In-game Trading 游戏中交易

Orders may be offered and trades may be created at any point up until match finalization. This allows users to enter into new positions or exit existing positions at any point prior to or during an event. Users who are unwilling to wait for finalization may even trade after the event has completed so as to have their balance available immediately (at a small cost).

在比赛结束之前的任已时刻都可以创建订单和交易。这种机制允许用户在赛事前和赛事中的任何时间点新建头寸和退出之前的头寸。

We view this as a very important aspect of SportCrypt. Being able to trade at half-time and TV intermissions, or even during live game play, adds a new level of excitement to the trading experience. However, due to the nature of distributed consensus as implemented by ethereum, certain considerations need to be kept in mind. When two or more conflicting transactions are broadcast to the network, it is indeterminate which one will be mined first. For example, if an unexpected play occurs, a market maker who has an outstanding order may attempt to cancel the order at the same time one or more participants attempt to trade on it. Whether a trade is made, and by whom, is indeterminate.

Furthermore, not only is transaction ordering indeterminate, it can also be influenced by gas price which adds a new dimension to in-game trading, one that may be attractive to sophisticated traders. Participants who don’t wish to include gas prices in their trading models are advised to restrict in-game trading to half-time, timeouts, TV intermissions, etc, and to make careful use of the order expiry parameter.

##1.7 Partial Trades 部分交易

Orders may offer any amount of ETH to be traded, and orders may be completely or partially filled by trades created by one or more users. Once a trade is created, each of the two parties to the trade will have positions on the event, meaning that one of the parties will profit given one outcome, and the other will profit given the opposite. However, if either party wishes to exit their position, and there are willing participants in the market, the position may be fully or partially sold off, either at a different price
(for a profit or a loss), or at the same price (for no profit or loss).

##1.8 Collateral 抵押

In order to enter trades, users need to have balances in the SportCrypt contract. These balances are tied to ethereum public keys and the smart contract ensures that only the corresponding users can choose whether their balances are withdrawn or traded.

Collateral requirements on SportCrypt are more flexible than on many other platforms, and are designed with market makers in mind. Creating an order does not reserve any funds from a user’s balance. In fact, a user may create many orders all backed by the same account balance. Only once a trade is executed are funds reserved. If this reduces the balance enough that it affects the ability to fill the other outstanding orders, those orders are automatically reduced or cancelled to compensate.

Because users only need a balance to enter into trades, they can in fact create orders when they have 0 balance. The orders won’t be visible to anyone until the user deposits funds, claims winnings from a finalized match, or closes an existing position in a different match. At that point the orders will appear in the order-book.

Additionally, trades made in the opposite direction of an existing position can use the position as collateral. Because of this, given a position on an event and a empty account balance, orders can still be created that, if filled, will partially or fully close out that position. And furthermore, the proceeds from closing that position can be used to create a new opposite position, even within the same trade.











