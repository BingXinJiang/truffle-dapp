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

In order to compute the 256-bit match ID, the match details JSON is sorted alpha- betically by key, minified (all unneeded white-space characters are removed), and then hashed with the keccak256 cryptographic hash function.

The resulting hash is then truncated by 2 bytes and is appended with 2 uint8 bytes: the first byte encodes the cancelPrice parameter of the match, and the second encodes the recoveryWeeks parameter.

The resulting value is the match ID which is used on the blockchain and in signed orders.

When displayed, it is usually expressed as a hexadecimal string, for example:

8c1705e212fd2d369e57e0012fa1e3083705cd71a871af21f6ce6230cfcd320c

The first 60 characters represent the 30-byte truncated hash of the match details. The following 32 byte represents a cancelPrice of 50, and the final 0c byte represents a recoveryWeeks of 12.

Prior to creating orders or trades for a match, users should verify that the match ID is computed correctly from the match details. Our reference UI implementation does this automatically.

##2.3 Point Spreads

Depending on the match type, it may have an associated point spread. This is a positive or negative number that is added to the final score of team2 (the home team) prior to evaluating the outcome of a match. This is done so that even teams with different skill levels can be traded at close to even odds, and also so that ties (“pushes”) cannot occur (because in most sports scores are integers but point spreads have fractional components). SportCrypt chooses its point-spreads based off the initially posted vegas or off-shore lines.

Using the above example, matches have short names such as “OAK@BUF-2.5”. This is short for a contest where the Oakland Raiders play against the Buffalo Bills. The “@” sign indicates that Oakland is the visiting team and Buffalo is the home team. The “-2.5” indicates the point spread that is to be applied to the home team’s score. Since in this case it is negative, it is disadvantaging the home team, meaning that, not considering point spreads, Buffalo is considered more likely to win this match.

In SportCrypt, the contract postulate is always about whether the visiting team will win against the point spread. So, in order to determine the outcome of this contract, add -2.5 to Buffalo’s final score and compare that against Oakland’s final score. If Oakland’s is greater then the outcome has occurred (the postulate was true), otherwise it hasn’t (it was false).
