#2 Matches

Prior to trading a match, its match details should be examined. These details represent the rules of this particular match and should be fully understood prior to trading.

##2.1 Match Details

When matches are posted on SportCrypt, they are posted with corresponding UTF-8 encoded JSON values which contain the match details. Here is an example:
```
{
    "type": "sports/nfl/game",
    "event": {
        "kickoff": "1509296400",
        "spread": "-2.5",
        "team1": "OAK",
        "team2": "BUF"
    },
    "contractAddr": "b9fea0142cd54bd0a8238cba4a286f5a1a261692",
    "nonce": "ul36TwZFutiL9nTlpHkMV5",
    "cancelPrice": "50",
    "recoveryWeeks": "12"
}
```
	*	type: The type of match as a hierarchical classification, separated by / characters.
	*	event: A nested object containing fields specific to the type of this match. For
example, sports/nfl/game has the following parameters:
	*		*	kickoff: The unix timestamp of when the match is scheduled to begin.
	*		*	name: The special name of the match, for example “Super Bowl” (op-
tional).
	*		*	spread: The point spread for this match (explained below).
	*		*	team1: The short-form identifier for the visiting-team of this match.
	*		*	team2: The short-form identifier for the home-team of this match.
	*	contractAddr: The SportCrypt contract address this match will be traded on.
	*	nonce: A random value that prevents the prediction of match IDs, and permits
the creation of otherwise identical matches.
	*	cancelPrice: If the outcome of a match cannot be determined, usually because
the match was called off, this is the price the match will be finalized at (normally
by the exchange, but potentially instead by funds recovery).
	*	recoveryWeeks: Weeks after the first trade that must elapse with no finalization before funds can be recovered at cancelPrice.

All values are strings (even numeric fields like point-spreads, prices, timestamps, and weeks). Ethereum addresses are stored in lower-case hex, without the 0x prefix.

##2.2 Match IDs

In order to compute the 256-bit match ID, the match details JSON is sorted alphabetically by key, minified (all unneeded white-space characters are removed), and then hashed with the keccak256 cryptographic hash function.

为了计算256位的matchID，赛事详情的json是按照字母表顺序排列的，并且是被压缩的(所有不必须的空格都被移除)。然后使用keccak256哈希函数取哈希值。

The resulting hash is then truncated by 2 bytes and is appended with 2 uint8 bytes: the first byte encodes the cancelPrice parameter of the match, and the second encodes the recoveryWeeks parameter.

然后结果hash被截掉两位，然后被拼接上两位uint8的字节：第一个字节编码了赛事的‘cancelPrice’参数，第二个字节编码了‘recoveryWeeks’参数。

The resulting value is the match ID which is used on the blockchain and in signed orders.

结果生成的matchID就是在区块链和订单中使用的。

When displayed, it is usually expressed as a hexadecimal string, for example:

以16进制字符串展示出来的形式就像下面的例子这样：

8c1705e212 fd2d369e57 e0012fa1e3 083705cd71 a871af21f6 ce6230cfcd 320c

The first 60 characters represent the 30-byte truncated hash of the match details. The following ‘32’ byte represents a ‘cancelPrice’ of 50, and the final ‘0c’ byte represents a ‘recoveryWeeks’ of 12.

前60个字符代表了30位被截断的赛事详情的hash。接下来的‘32’字符代表了‘cancelPrice’为50，最后的字符‘0c’代表了‘recoveryWeeks’为12.

Prior to creating orders or trades for a match, users should verify that the match ID is computed correctly from the match details. Our reference UI implementation does this automatically.

在创建订单或交易之前，用户应该确认matchID被正确计算。我们的前端自动完成了这件事。

##2.3 Point Spreads

Depending on the match type, it may have an associated point spread. This is a positive or negative number that is added to the final score of team2 (the home team) prior to evaluating the outcome of a match. This is done so that even teams with different skill levels can be traded at close to even odds, and also so that ties (“pushes”) cannot occur (because in most sports scores are integers but point spreads have fractional components). SportCrypt chooses its point-spreads based off the initially posted vegas or off-shore lines.

根据赛事类型的不同，有关联的点差。点差是一个正数或者负数，在评估赛事结果之前会被加到主场队的最后分数上。这样做的目的是，即使两个队具有不同的技能水平，也能在一个相近的胜负几率上交易。并且关联也不可能发生（因为大部分的体育赛事分数为整数，而点差会出现小数部分）。SportCrypt依据拉斯维加斯或者离岸最初的发布选择它的点差。

Using the above example, matches have short names such as “OAK@BUF-2.5”. This is short for a contest where the ’Oakland Raiders‘ play against the ’Buffalo Bills‘. The “@” sign indicates that ’Oakland‘ is the visiting team and ’Buffalo‘ is the home team. The “-2.5” indicates the point spread that is to be applied to the home team’s score. Since in this case it is negative, it is disadvantaging the home team, meaning that, not considering point spreads, Buffalo is considered more likely to win this match.

使用上面的例子，每个赛事都会有一个短昵称，像‘OAK@BUF-2.5‘。这是’Oakland Raiders‘对抗’Buffalo Bills‘的简称。’@‘表明’Oakland‘是客场队而’Buffalo‘是主场队。’-2.5‘表明了适用于主场队的点差。在本例中它是负数，这对于主场队是不利的，意味着不考虑点差，’Buffalo‘被认为更有可能赢得这场比赛。

In SportCrypt, the contract postulate is always about whether the visiting team will win against the point spread. So, in order to determine the outcome of this contract, add -2.5 to Buffalo’s final score and compare that against Oakland’s final score. If Oakland’s is greater then the outcome has occurred (the postulate was true), otherwise it hasn’t (it was false).

在SportCrypt中，合约总是预测客场队是否能赢得点差。因此，最终的结果将由Buffalo加上’-2.5‘分和’Oakland‘的最终分数相比较决定。如果’Oakland‘的分数较高，则输出结果为赢，否则为输。














