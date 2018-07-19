#4 Off-Chain Mechanics

SportCrypt uses a hybrid on/off-chain approach. Match details, match finalization prices, and orders are communicated off-chain, but trade settlement occurs on-chain. We refer to this as the “EtherDelta model”.

SportCrypt使用线上线下混合的模式完成。赛事的详细信息、赛事的最终报价和订单的关联都是在链下完成，而交易结算是在链上完成。我们把这种模式叫做“EtherDelta model”。

We are also evaluating a modification to this model where matching happens centrally and is settled on-chain by transactions sent by the exchange. We call this the “IDEX model”, although we won’t discuss it further in this paper.

我们还在评估对模型的进一步修改，由交易所发送交易到链上并且集中匹配。我们叫这种模式为“IDEX”模式，本节中不对此进行讨论。

##4.1 Match Creation

When new matches are offered for trading, they are added to our backend system which forwards them to all connected clients via websocket. The exchange doesn’t need to perform any on-chain actions to create a new match. This is a major scalability advantage of SportCrypt since it reduces the operational costs of the exchange and allows us to experiment with many simultaneous matches without worrying about ethereum gas overhead or waiting for blocks to be mined.

当有新的赛事提供用来交易的时候，我们会把它添加到我们的后台系统，并且通过websocket的方式把它推送给任何连接的客户端。创建新的赛事不需要任何的链上行为。这是SportCrypt的主要的一个可扩展优势，由于这种交换允许我们同时参与很多赛事，而不用担心gas的过度消耗和区块的挖矿记录时间。

##4.2 Match Finalization

Similarly, finalizing a match requires no on-chain actions. The operators of the exchange will sign a message indicating that a given match ID is to be finalized at a certain price. Similar to orders, the signature is specific to a certain contract address. When claiming their winnings, participants (if there were any) will submit this signed message, along with the signature, to the blockchain. If nobody else has finalized the contract yet, the signature will be validated and the contract will be finalized. The consequence is that the first participant to claim their winnings will pay an extra 10k in gas. However, we feel this is worth it because it relieves the exchange from any operational overhead for finalizing matches.

同样，结束赛事也不需要链上行为。交易所会签署一条信息，用来标示指定matchID的赛事将会以一个确定的价格结束。和订单类似，签名指定了一个特定的合约地址。当参与者获取他们的奖金时，注册信息和签名将一起提交给区块链。如果还没有人确立合约，签名被验证，合约结束。结果是第一个声明奖金的人会额外支付10k的gas费用。但是我们认为这是值得的，因为此举能减轻赛事的任何操作。

##4.3 Orders

After selecting a match to trade, market participants create and sign orders which are then uploaded to our off-chain order-book via websocket.

选择一个赛事进行交易之后，市场参与者创建一个订单提交到我们的链下order-book中。

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

由于solidity的堆栈深度限制和借阅gas消耗，打包是必要的。SportCrypt的96个字节的订单已经比较精简。

The order ID is the keccak256 hash of the contract address concatenated with these 3 uint256 values.

订单ID是合约地址链接上着三个值通过keccak256计算出来的hash。

After being submitted to the order-book, orders and their signatures are propagated to all connected clients who have subscribed to the given match.

在提交到order-book之后，订单将会传播到任何关注了给定赛事的客户端。

When a market participant chooses to execute a trade, the order and its signature are sent to the blockchain to be executed. The smart contract computes the order ID and verifies that the order creator’s address matches the provided signature.

当市场参与者选择执行交易的时候，订单和他们的签名会被发送的区块链并执行交易。智能合约会计算订单ID并且确认订单创建者的地址是否匹配给定的签名。
