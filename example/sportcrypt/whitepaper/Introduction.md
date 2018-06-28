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



##1.3 Custody of Funds

##1.4 Fees

##1.5 Fixed-odds

##1.6 In-game Trading

##1.7 Partial Trades

##1.8 Collateral
