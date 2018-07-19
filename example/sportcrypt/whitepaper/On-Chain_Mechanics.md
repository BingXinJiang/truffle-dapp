# On-Chain Mechanics

This section is an outline of the smart contract’s core trading mechanics expressed in an idealized mathematical form. The actual implementation is structured slightly differently so as to avoid rounding loss, enable efficient invariant assertions, and to optimize gas usage. This description should not be taken as authoritative; the authoritative description is the smart contract source code.

本节概述了智能合约的核心交易机制，以理想化的数学公式表示出来。为了避免舍入损失，实现有效的不变断言，优化gas的使用，实际实现的结构可能略有不同。该描述不一定准确，一切以代码为准。

##5.1 Trading

The trade function accepts an order, the signature of the order creator, and an amount. All of the trade details are determined by the order parameters, except the amount. This amount is the largest amount at risk the trader is willing to accept, and the smart contract will attempt to create a trade with an at risk component as large as possible up to that amount.

交易函数接收一个订单、订单创建者的签名、和数量作为参数。除了交易金额，所有交易细节由订单参数确定。这个交易金额是交易者期望承担的最大金额，智能合约将会根据交易金额创建一个尽可能大的风险头寸组成交易。

Under normal operation, the smart contract is designed to never throw exceptions since this has the undesirable effect of consuming all provided gas. Instead, the trade may complete with a 0 amount, in which case a LogTradeError log message may be issued. See the Status enum in the smart contract for details on how to interpret these log messages.

在正常操作下，智能合约被设计为永远不会抛出异常，因为这会导致消耗掉所有提供的gas。相反，交易可以以0交易量完成，在这种情况下，会产生一个LogTradeError的log信息。关于怎么解释这些log信息，请查看智能合约内部对这些状态枚举值的定义。

After a match has been finalized, trading for this match is disallowed by the smart contract。

赛事结束之后，该赛事的交易会被智能合约锁死。

##5.2 Positions

Positions are the result of trading, and they maintain the state of which accounts are eligible to collect the reserved funds once contracts have been finalized. Negative values for positions represent short positions, and positive values represent long positions. The positions represent the total amounts to be claimed, not the long or short amounts at risk.

头寸是交易的结果，它们维持着一旦合约最终确定后哪些账户有资格获取资金。负值的头寸代表空头，正值的头寸代表多头。头寸代表声明的总金额，而不是风险的多空。

##5.3 Effective Balances

To create a trade, users normally require sufficient funds in their unallocated account balance, Balaccount, to match their amount at risk. However, if a trade is made for a match the user already has a position on, and the trade is in the opposite direction of the existing position, then the position itself may be used as collateral. In this way, it is always possible to create new trades to close out existing positions.

为了创建一个交易，用户通常需要在他们的账户中准备足够的资金，用来平衡他们所面临的风险。然而，一旦交易被创建，用户已经拥有头寸，如果要创建相反方向的头寸交易，已经存在的头寸本身可以作为抵押。按照这种方式，以创建相反的头寸来关闭当前头寸是可以的。

Here is how the effective balance is computed for a buyer:

下面是买方如何计算有效余额的公式：

Bal<sub>effective</sub> = Bal<sub>account</sub> + (-Position * (Price / 100))  when Position < 0
Bal<sub>effective</sub> = Bal<sub>account</sub> + 0  when Position >= 0

And for a seller:

Bal<sub>effective</sub> = Bal<sub>account</sub> + ((Position * (100 - Price) / 100))  when Position > 0
Bal<sub>effective</sub> = Bal<sub>account</sub> + 0  when Position <= 0

Baleffective is computed for both parties to a trade. These values are then used to determine the amounts that will be used in the trade, along with the remaining order amount, the maximum trade amount, and the order price.

Baleffective的值是为交易双方计算的。这些值用于确定在交易中需要使用的金额，以及剩余的订单金额，最大交易额和订单价格。

##5.4 Position Updates

When a trade is created, the positions for the participating accounts are updated by adding or substracting the total trade amount, A<sub>total</sub>, as follows.

当交易创建的时候，通过增加或减少交易总额来更新参与账户的头寸。

For the account performing the buy side of the trade:

Position<sub>new</sub> = Position<sub>old</sub> + A<sub>total</sub>

And for the account performing the sell side:

Position<sub>new</sub> = Position<sub>old</sub> - A<sub>total</sub>

Since there are opposite positions of equal magnitude created for every trade, prior to
finalization all positions on a match net to 0:

因为对于任何交易都有相等数量的相反头寸，首先计算这些头寸的净值为0：

Position<sub>(account1)</sub> + Position<sub>(account2)</sub> + ... + Position<sub>(accountn)</sub> = 0

After finalization this invariant no longer holds because winners will claim their positions and in the process reset them to 0. Participants on the losing side have no reason to pay the gas to set their positions to 0.

在最终确认之后，这些常量便不再成立，这是因为赢家会交割他们的头寸，这个过程这些变量会被重置为0。失利的一方不用支付gas，他们的头寸直接置为0。

##5.5 Balance Updates

As well as updating the positions of the participating accounts, the balances of the accounts are modified according to the following formulae.

和更新参与账户的头寸一样，账户的余额也会根据下面的公式更新。

For the account performing the buy side of the trade:

Bal<sub>new</sub> = Bal<sub>old</sub> + ((-Position<sub>old</sub> + min(0,Position<sub>new</sub>)) * ((100 - Price) / 100)) - ((Position<sub>new</sub> - max(0,Position<sub>old</sub>)) * (Price / 100))

And the sell side:

Bal<sub>new</sub> = Bal<sub>old</sub> + ((Position<sub>old</sub> - max(0,Position<sub>new</sub>)) * (Price / 100)) - ((-Position<sub>new</sub> + min(0,Position<sub>old</sub>)) * ((100 - Price) / 100))

The intuition behind these equations is that an account’s balance is debited for increasing the magnitude of a position and credited for reducing it. Since a position is being sold or purchased, the debit or credit amount depends on the price agreed upon for the trade.

这些等式给人的感觉是，账户余额是为了增加头寸数量，而头寸增加会减余额。一旦头寸被卖出或者买入，可用于交易的信用证数量会依据价格重新计算。

If there are no preexisting positions, then both balances are decreased by the corre- sponding amounts necessary to cover the respective amounts at risk needed for the trade. However, if one or both of the parties have existing positions, and one or both of them are trading in an opposite direction to their positions, then the balances may increase. This is not always the case though since a single trade can close out an existing position (increasing balance) and additionally create an opposite position (decreasing balance).

如果没有预置的头寸，则平衡的两边都会因为要覆盖交易所需要承担的风险而减少。然而，如果一方或双方拥有相反方向的头寸，余额就会增加。但情况并非总是如此，因为单笔交易可以平仓现有头寸(增加余额)并且另外创建相反头寸(减少余额)。

##5.6 Order Amount Decrease

When a trade is made, a filled amount variable for the corresponding order ID is incremented by the amount at risk that was consumed by the trade.

当交易被创造时，对应订单ID的金额将会由交易带来的风险的大小填充。

The difference between the filled amount and the order amount is what is used for later trades when determining how much of an order remains.

在确定订单剩余多少时，填充金额和订单金额之间的差异用于以后的交易。

When cancelling an order, the filled amount is increased to be the same as the order amount (see the next section).

当订单取消时，填充金额上升到和订单金额一致。

##5.7 Order Cancellation

Similar to EtherDelta, order cancellation must be done on-chain by calling a cancelOrder method of the smart contract. Unfortunately this means that to cancel an order, gas needs to be paid and the cancellation is not instantaneous.

与EtherDelta模式相似，订单的取消必须通过调用智能合约的cancelOrder方法在链上完成。这意味着，取消订单需要支付gas并且不是实时发生的。

This can be avoided in many cases by short-term order expiry values. Once block.timestamp has exceeded the order expiry timestamp, the order will be effectively cancelled and there is no need to cancel it with a transaction.

在很多情况下，这可以通过短期订单到期值来进行规避。一旦区块的时间戳超过了订单的到期时间戳，订单就会自动取消，不需要通过交易取消。

##5.8 Funds Recovery

As explained in the Match ID section, the cancelPrice and recoveryWeeks parameters are available to the smart contract because they are embedded in the match ID. This otherwise undesirable in-band signaling and reduction of hash strength is necessary to implement the funds recovery feature described in this section.

正如在“Match ID”章节所解释的那样，‘cancelPrice和recoveryWeeks’两个参数对于智能合约是可以使用的，因为它们被嵌入到了MatchID里面。这种不合需要的带内信令和哈希强度的降低，对于本章描述的资金恢复的特性是必须的。

Note that we are truncating the 256-bit keccak256 algorithm by 16 bits, leaving 240 √ bits of digest, still a very comfortable security margin ( 2240 = 2120).

注意到，我们截断了256位通过keccak256算法的值，留下了240位，仍然是非常安全的。

If the SportCrypt exchange does not finalize a match, users will need to wait until recoveryWeeks weeks after the first trade on that match has elapsed. At that point, any user may call the recoverFunds method of the smart contract. The smart contract will finalize the match at the cancelPrice, allowing users to claim their funds. Weeks were chosen since the 256 possible values give us good granularity and a range up to approximately 5 years. Compared to other periods of time such as months, weeks are uniformly 7 days long and have survived calendar modification since the year 46 BC.

如果在SPortCrypt上，异常赛事没有结果，就要等到第一笔交易的‘recoveryWeeks’周后。在那个时间点上，所有用户都会调用合约的’recoverFunds‘函数。智能合约将会以‘cancelPrice’完成赛事，允许用户拿回他们的资金。选择数周，因为256个可能的值给出了良好的粒度，并且范围可达约5年。和其他的时间跨度相比比如月份，自从公元前46年的日历修改之后，周的天数统一为7天。

Naturally, we hope this functionality is never used. It serves as an assurance to users that even if SportCrypt were to disappear completely, funds would still be recoverable at the cancelPrice that was agreed upon in the match details.

自然，我们希望这个函数永远不会被用到。它可以向用户保证，尽管SportCrypt完全消失了，资金也是可以按照赛事详情里面约定的那样恢复的。
