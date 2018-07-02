#3 Prices and Odds

Understanding pricing and odds is critical to profitably trading on SportCrypt (and elsewhere). Simultaneously buying and selling at different prices/odds is how market makers earn profit, and accurately assessing the probability of events and comparing those to posted prices (or creating their own prices) is how traders earn profit.

On SportCrypt anyone can be a market maker, a trader, or both.

##3.1 Implied Probability


On SportCrypt, each contract is valued at an integer price from 0 to 100. This corresponds to the odds in traditional sports betting, since it reflects the perceived chances that an outcome will occur, and therefore the amount that a trader will need to risk to earn a given amount.

When it is finalized, either the contract postulate will have been found to be true, in which case the contract will be finalized at a price of 100, or it will have been found to be false, in which case it will be finalized at a price of 0. Prior to finalization, market participants can choose to value a contract at prices in the range between 0 and 100.

This range from 0 to 100 is chosen so as to map to probabilities expressed in percentage. For this reason, odds in this format are called implied probability odds. The most significant popularizer of implied probability in sports betting was the now-defunct website TradeSports.com, so in this paper we refer to implied probability pricing of binary options as the “TradeSports model”.

##3.2 Bid-Ask Spread

The difference between the lowest ask and the highest bid is called the bid-ask spread. This spread is unrelated to the point spread discussed previously.

Because market makers attempt to buy at low prices and sell at high prices, they prefer large bid-ask spreads. Conversely, because they must pay market prices, traders who execute trades prefer small bid-ask spreads.

In a popular and competitively traded event, the bid-ask spread is typically smaller (“tighter”) than in an unpopular event. This is because market makers tend to compete with each other by offering smaller bid-ask spreads, and also because traders will create orders at slighty better prices than the market makers, hoping to avoid paying the bid-ask spread to a market maker by selling directly to another trader.

In a centralized exchange, it is usually impossible to have a negative bid-ask spread (where a bid is at a higher price than an ask) because these overlapping orders would be filled immediately. However, in SportCrypt negative bid-ask spreads are possible since the order-book is decoupled from execution. Negative bid-ask spreads should be uncommon though because they represent opportunities for arbitrage. This is where an opportunistic trader simultaneously buys at the low ask price and sells at the high bid price so as to profit from the difference. A useful feature of ethereum allows this to happen atomically: Either both of the trades will execute or neither of them will.

As well as negative bid-ask spreads, a match on SportCrypt can also have a bid-ask spread of zero. In this case there is no opportunity for arbitrage and the bid-ask spread can be thought of as the gas required to execute a trade.

##3.3 Amount at Risk

When creating a trade, participants agree upon an integer price Pricetrade between 0 and 100 (non-inclusive). The amounts they must put at risk to form the trade depend upon this price, and are defined by this formula:

Or equivalently:

The total trade amount is simply the sum of the two amounts at risk:

##3.4 Finalization Prices

The total trade amount is simply the sum of the two amounts at risk:

And the seller can claim:

Finalization prices are usually either 100 or 0. This means that either the buyer or the seller respectively will be able to claim the entire amount, and the other will be able to claim nothing.

However, in certain rare circumstances a match will have no determinable outcome and will need to be finalized at a cancel price. The cancel price is a term in the match’s contract details and should be accounted for in trader models. Typically the cancel price will be 50, however a different price may be provided if the initial market value of a contract is anticipated to be materially different. This may be the case for “money-line” matches (matches without point-spreads).

##3.5 Expected Value

With implied probability, it is immediately evident that it is preferable to buy at low prices and sell at high prices.

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



