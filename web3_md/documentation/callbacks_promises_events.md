#Callbacks Promises Events

To help web3 integrate into all kind of projects with different standards we provide multiple ways to act on asynchronous functions.

为了将web3集合到各种不同标准的项目中，我们提供了实现异步函数的各种方式。

Most web3.js objects allow a callback as the last parameter, as well as returning promises to chain functions.

大多数的web3对象允许在最后一个参数传入一个回调函数，相当于返回一个promises函数链。

Ethereum as a blockchain has different levels of finality and therefore needs to return multiple “stages” of an action. To cope with requirement we return a “promiEvent” for functions like web3.eth.sendTransaction or contract methods. This “promiEvent” is a promise combined with an event emitter to allow acting on different stages of action on the blockchain, like a transaction.

作为区块链的以太坊具有不同阶段的结束状态，因此一个行为可能返回多个状态。为了应对这种需求，我们为像‘web3.eth.sendTransaction’或者合约方法这样的函数返回一个“promiEvent”。这种“promiEvent”将promise函数和事件监听结合起来了，适用于区块链上不同阶段状态的行为，例如交易。

PromiEvents work like a normal promises with added on, once and off functions. This way developers can watch for additional events like on “receipt” or “transactionHash”.

promiEvent的工作机制像一般的promises函数一样，带有on、once、off函数。通过这种方式，开发人员可以监听像‘receipt’或‘transactionHash’等其他事件。

```
web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
.once('transactionHash', function(hash){ ... })
.once('receipt', function(receipt){ ... })
.on('confirmation', function(confNumber, receipt){ ... })
.on('error', function(error){ ... })
.then(function(receipt){
    // will be fired once the receipt its mined
});
```





















