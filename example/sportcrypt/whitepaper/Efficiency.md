#6 Efficiency

SportCrypt has been designed from the start to be a very lean project. By reducing operational costs, we are able to provide significant savings to our users.

SportCrypt设计之初就定位为一个很轻的项目。通过减少操作成本，我们可以为我们的用户节约了主要的成本。

##6.1 Smart Contract

As discussed previously, the SportCrypt system is designed to do as much as possible off-chain:

就像前面讨论的那样，SportCrypt系统设计为尽可能在链下完成很多事情：

	*	Match creation and finalization is done off-chain. 
	*	Orders are created and advertised off-chain.

And the operations that are done on chain we’ve tried to keep as inexpensive as possible:

并且链上操作我们会尽力的节约花费：

	*	There are no loops in contract code (except read-only views). 
	*	Orders are tightly packed to reduce calldata gas consumption. 
	*	The contract never throws in normal operation.

####6.1.1 Approximate Gas Cost

Although the gas used is fixed, what users actually pay is determined by the gas prices they send with their transactions.

尽管gas的使用时固定的，但用户在交易时产生的支付取决于gas的价格。

As an example, the most expensive operation requires around 140k gas. Assuming a gas price of 1 GWei, this transaction would require 0.00014 ETH. At an exchange rate of 300 USD per ETH, this transaction would cost USD $0.042 (4.2 cents).

举例来说，最贵的操作大约需要140k的gas。假设一个gas价格为1Gwei，这笔交易需要花费0.00014ETH。在一ETH兑300美元的汇率下，这笔交易需要花费0.042美元。

Since gas charges are independent of trade amounts, in terms of percentage this fee can be amortized as low as desired. In this example, even a trade as small as USD $5 requires a gas fee of less than 1%.

由于gas的消耗和交易的数量是相互独立的，按照百分比计算，该费用可以被尽可能的摊销。在该例子中，一笔5美元的交易需要的gas费用不到百分之一。

##6.2 Order-Book

Although the critical record of balances, trades, order fills, and positions are kept on the ethereum blockchain, we still need to operate servers, most importantly to provide match details and an order-book.

尽管余额、交易、订单和头寸的记录保持在区块链上，我们仍需要提供一个服务，最重要的是提供赛事详情和订单列表。

We have attempted to minimize our operational costs as much as possible:

我们已经尽可能的最小化我们的操作成本了：

	*	Hybrid multi-threaded/non-blocking C++ implementation.
	*	Communicates with clients using compressed websocket push to minimize latency and bandwidth usage.
	*	In-process, memory-mapped DB to store persistent data.

##6.3 User Interface

The final portion of code we consider the efficiency of is the code running in the browsers of our users. In our UI we strive to use as little memory, CPU, and bandwidth as possible:

代码的最后部分我们考虑了运行在我们用户浏览器上的效率。在我们的前端我们会尽量使用较少的内存、CPU和带宽。

	*	Modern ES6+, React, Webpack code-base.
	*	Querying the smart contract with constant calls amortizes RPC overhead by batching requests.

Our user interface is not required to interact with SportCrypt, and we plan to release alternate UIs such as a mobile client and a command-line application.

我们的用户接口不需要与SportCrypt交互，我们将使用移动端的客户端和命令行应用。
