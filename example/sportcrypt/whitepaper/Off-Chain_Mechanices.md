#4 Off-Chain Mechanics

SportCrypt uses a hybrid on/off-chain approach. Match details, match finalization prices, and orders are communicated off-chain, but trade settlement occurs on-chain. We refer to this as the “EtherDelta model”.

SportCrypt使用线上线下混合的模式完成。赛事的详细信息、赛事的最终报价和订单的关联都是在链下完成，而交易结算是在链上完成。我们把这种模式叫做“EtherDelta model”。

We are also evaluating a modification to this model where matching happens centrally and is settled on-chain by transactions sent by the exchange. We call this the “IDEX model”, although we won’t discuss it further in this paper.

##4.1 Match Creation

When new matches are offered for trading, they are added to our backend system which forwards them to all connected clients via websocket. The exchange doesn’t need to perform any on-chain actions to create a new match. This is a major scalability advantage of SportCrypt since it reduces the operational costs of the exchange and allows us to experiment with many simultaneous matches without worrying about ethereum gas overhead or waiting for blocks to be mined.

##4.2 Match Finalization


Similarly, finalizing a match requires no on-chain actions. The operators of the exchange will sign a message indicating that a given match ID is to be finalized at a certain price. Similar to orders, the signature is specific to a certain contract address. When claiming their winnings, participants (if there were any) will submit this signed message, along with the signature, to the blockchain. If nobody else has finalized the contract yet, the signature will be validated and the contract will be finalized. The consequence is that the first participant to claim their winnings will pay an extra 10k in gas. However, we feel this is worth it because it relieves the exchange from any operational overhead for finalizing matches.

##4.3 Orders

After selecting a match to trade, market participants create and sign orders which are then uploaded to our off-chain order-book via websocket.

The orders are tightly packed into 3 uint256 values:

```
[0]: 32-byte match ID
[1]: 32-byte amount in wei
[2]:  5-byte expiry
      5-byte nonce
      1-byte price
      1-byte direction
     20-byte address
• match ID: The hashed match details, as described above.
• amount: The maximum total amount at risk authorized by the order creator.
• expiry: Unix timestamp after which the order ceases to be valid.
• nonce: A random value which allows multiple otherwise identical orders to be
issued, and prevents order ID prediction.
• price: A value from 1-99 representing the price authorized by the order creator.
• direction: Either 0 for a sell order, or 1 for a buy order.
• address: The address of the order creator.
```

Packing is necessary to work around the solidity stack depth limitation, as well as to save on calldata gas expenses. SportCrypt’s 96 byte orders are quite lean (compared to EtherDelta’s 136 bytes and 0x’s 292 bytes).

The order ID is the keccak256 hash of the contract address concatenated with these 3 uint256 values.

After being submitted to the order-book, orders and their signatures are propagated to all connected clients who have subscribed to the given match.

When a market participant chooses to execute a trade, the order and its signature are sent to the blockchain to be executed. The smart contract computes the order ID and verifies that the order creator’s address matches the provided signature.
