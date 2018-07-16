#3 Prices and Odds

Understanding pricing and odds is critical to profitably trading on SportCrypt (and elsewhere). Simultaneously buying and selling at different prices/odds is how market makers earn profit, and accurately assessing the probability of events and comparing those to posted prices (or creating their own prices) is how traders earn profit.

理解定价和赔率对于在SportCrypt上交易是至关重要的，在其他地方也是如此。同时为买方和卖方制定不同的价格和赔率是做市商盈利的关键，精确的评估赛事的可能性并且对比投注的价格（或者创建他们自己的价格）是交易商获取利润的方式。

On SportCrypt anyone can be a market maker, a trader, or both.

在SportCrypt平台上，任何人都可以是做市商，交易商，或者两者都是。

##3.1 Implied Probability

On SportCrypt, each contract is valued at an integer price from 0 to 100. This corresponds to the odds in traditional sports betting, since it reflects the perceived chances that an outcome will occur, and therefore the amount that a trader will need to risk to earn a given amount.

在SportCrypt上，每一个合约的价值为0到100的整数。这和传统的体育投注中的赔率是一致的，它反映了将会发生的结果中的可预测的机会，它反映了交易者为了获得给定的金额需要承担的风险。

When it is finalized, either the contract postulate will have been found to be true, in which case the contract will be finalized at a price of 100, or it will have been found to be false, in which case it will be finalized at a price of 0. Prior to finalization, market participants can choose to value a contract at prices in the range between 0 and 100.

比赛结束时，合约的输出可能返回true，此时合约的最终价值就是100，或者合约的输出为false，合约的价值为0。在结束之前，市场参与者可以用0到100的价值评估一个合约。

This range from 0 to 100 is chosen so as to map to probabilities expressed in percentage. For this reason, odds in this format are called implied probability odds. The most significant popularizer of implied probability in sports betting was the now-defunct website TradeSports.com, so in this paper we refer to implied probability pricing of binary options as the “TradeSports model”.

0到100的选择时为了映射到百分比表示的可能性。由于这个原因，这种格式的赔率被称为隐含概率赔率。在体育博彩中推广这种隐含赔率的最知名的是现在已经解散的网站’TradeSports.com‘，因为本节中我们将这种二元期权的隐含概率成为’TradeSports模型‘。

##3.2 Bid-Ask Spread

The difference between the lowest ask and the highest bid is called the bid-ask spread. This spread is unrelated to the point spread discussed previously.

最低的要价和最高的出价之间的差叫做买卖价差。这个差和前面讨论的点差没有关系。

Because market makers attempt to buy at low prices and sell at high prices, they prefer large bid-ask spreads. Conversely, because they must pay market prices, traders who execute trades prefer small bid-ask spreads.

由于做市商尝试以较低的价格买入和以较高的价格卖出，他们会期望较大的买卖价差。

In a popular and competitively traded event, the bid-ask spread is typically smaller (“tighter”) than in an unpopular event. This is because market makers tend to compete with each other by offering smaller bid-ask spreads, and also because traders will create orders at slighty better prices than the market makers, hoping to avoid paying the bid-ask spread to a market maker by selling directly to another trader.

在一个流行的有竞争力的市场交易活动中，买卖价差会比一个不流行的市场中要小。这是因为做市商会通过提供更小的买卖价差彼此竞争，同时由于交易者在交易的时候回倾向于比做市商提供的价格更好的价格，希望直接卖给对方交易者从而避免支付买卖价差给做市商。

In a centralized exchange, it is usually impossible to have a negative bid-ask spread (where a bid is at a higher price than an ask) because these overlapping orders would be filled immediately. However, in SportCrypt negative bid-ask spreads are possible since the order-book is decoupled from execution. Negative bid-ask spreads should be uncommon though because they represent opportunities for arbitrage. This is where an opportunistic trader simultaneously buys at the low ask price and sells at the high bid price so as to profit from the difference. A useful feature of ethereum allows this to happen atomically: Either both of the trades will execute or neither of them will.

在中心化的交易系统中，负的买卖价差(买价高于卖价)通常是不可能的，因为这种重叠的订单，会马上成交。然而，在SportCrypt中，这种负的买卖价差是可能存在的，因为订单的确立与执行是彼此分割的。负的买卖价差应该不会普遍，因为负的买卖价差代表这之中存在着套利的机会。套利是指机会主义者在低价买入的同时高价卖出从而取得利差的交易方式。以太坊一个有用的特性允许这种情况自动发生：两种交易都被执行或者两种交易都不被执行。

As well as negative bid-ask spreads, a match on SportCrypt can also have a bid-ask spread of zero. In this case there is no opportunity for arbitrage and the bid-ask spread can be thought of as the gas required to execute a trade.

不仅负的买卖价差，在SPortCrypt中也允许有为0的买卖价差。在这种情况下没有套利的机会，买卖价差可以被认为等于交易执行所需要的GAS。

##3.3 Amount at Risk

When creating a trade, participants agree upon an integer price Pricetrade between 0 and 100 (non-inclusive). The amounts they must put at risk to form the trade depend upon this price, and are defined by this formula:

A<sub>buyer</sub> = A<sub>seller</sub> * (Price<sub>trade</sub> / (100 - Price<sub>trade</sub>))

当创建交易的时候，参与者同意0到100之间的一个整数价格。他们必须承担的风险取决于这个价格，并且由下面的公式定义：

Or equivalently:

A<sub>seller</sub> = A<sub>buyer</sub> * ((100 -Price<sub>trade</sub>) / Price<sub>trade</sub>)

The total trade amount is simply the sum of the two amounts at risk:

A<sub>total</sub> = A<sub>buyer</sub> + A<sub>seller</sub>

##3.4 Finalization Prices

The total trade amount is simply the sum of the two amounts at risk:

A<sub>total</sub> * Price<sub>final</sub> / 100

交易总额是交易双方承担风险的总和：

And the seller can claim:

A<sub>total</sub> * ((100 - Price<sub>final</sub>) / 100)

Finalization prices are usually either 100 or 0. This means that either the buyer or the seller respectively will be able to claim the entire amount, and the other will be able to claim nothing.

最终的报价通常不是100就是0。这意味着买方或者卖方可以获得所有的资金，而另一方将什么也得不到。

However, in certain rare circumstances a match will have no determinable outcome and will need to be finalized at a cancel price. The cancel price is a term in the match’s contract details and should be accounted for in trader models. Typically the cancel price will be 50, however a different price may be provided if the initial market value of a contract is anticipated to be materially different. This may be the case for “money-line” matches (matches without point-spreads).

然而，在极少数的特定情况下，比赛没有结果，交易需要一个取消价格。取消价格是赛事详情里面的一项，并且需要在交易模型中考虑到。通常取消价格设为50，然而在合约的初始市场价值被预期不一致时，取消价格会不一样。这可能是没有点差的比赛情况下发生的。

##3.5 Expected Value

With implied probability, it is immediately evident that it is preferable to buy at low prices and sell at high prices.

有了隐含概率，很明显，最好的方式就是低价买高价卖。

Given an accurate estimate of the probability of an outcome occurring, there will be a positive expectation when buying at prices below this estimate or selling at prices above it.

Specifically, the expected value of a buy-side trade is the following (where Pestimate is a probability, not a price):

E = (Pestimate × Aseller) − ((1 − Pestimate) × Abuyer)

And similarly, the sell-side:

E = (Pestimate × Abuyer) − ((1 − Pestimate) × Aseller)

Using expected value, standard bankroll management techniques such as the kelly criterion can be applied.

##3.6 Odds Conversion Examples

Implied probability has several advantages over other odds representations. However, current sports bettors are familiar with a variety of formats so we will next present some abridged odds conversion tables:

Buy-side

Sell-side



