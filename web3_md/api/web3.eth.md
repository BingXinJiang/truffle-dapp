#web3.eth

The 'web3-eth' package allows you to interact with an Ethereum blockchain and Ethereum smart contracts.

web3-eth包提供了与以太坊区块链和以太坊智能合约进行交互的功能。

```
var Eth = require('web3-eth');

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');


// or using the web3 umbrella package

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

// -> web3.eth
```

##Note on checksum address

All Ethereum addresses returned by functions of this package are returned as checksum addresses. This means some letters are uppercase and some are lowercase. Based on that it will calculate a checksum for the address and prove its correctness. Incorrect checksum addresses will throw an error when passed into functions. If you want to circumvent the checksum check you can make an address all lower- or uppercase.

这个函数库中的函数返回所有校验过的以太坊地址。这些地址是区分大小写的。基于此，函数将会检测地址的正确性。当校验不通过的地址传入函数时函数会抛出错误。如果你想规避校验，你可以使用全是大写或者全是小写。

####Example

```
web3.eth.getAccounts(console.log);
> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe" ,"0x85F43D8a49eeB85d32Cf465507DD71d507100C1d"]
```

##subscribe

For web3.eth.subscribe see the [Subscribe reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-subscribe.html#eth-subscribe)

##Contract

For web3.eth.Contract see the [Contract reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#eth-contract)

##Lban

For web3.eth.Iban see the [Iban reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-iban.html#eth-iban)

##personal

For web3.eth.personal see the [personal reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-personal.html#eth-personal)

##accounts

For web3.eth.accounts see the [accounts reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#eth-accounts)

##abi

For web3.eth.abi see the abi [reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-abi.html#eth-abi)

##net

For web3.eth.net see the net [reference documentation](http://web3js.readthedocs.io/en/1.0/web3-eth-net.html#eth-net)

##setProvider

```
web3.setProvider(myProvider)
web3.eth.setProvider(myProvider)
web3.shh.setProvider(myProvider)
web3.bzz.setProvider(myProvider)
...
```

Will change the provider for its module.

这个方法可以设置provider。

```
Note

When called on the umbrella package 'web3' it will also set the provider for all sub modules 'web3.eth', 'web3.shh', etc EXCEPT ‘web3.bzz’ which needs a separate provider at all times.

当调用web3的方法设置provider时，除了web3.bzz，其他模块例如：web3.eth、web3.shh等模块的provider被同步设置，web3.bzz在任何时候需要独立的provider。
```

####Parameters

‘Object - myProvider’: a valid provider.

####Returns

‘Boolean’

####Example

```
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');
// or
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
var net = require('net');
var web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

##providers

```
web3.providers
web3.eth.providers
web3.shh.providers
web3.bzz.providers
...
```

Contains the current available providers.

查询当前可用的provider

####value

'Object' with the following providers:

	*	'Object - HttpProvider': The HTTP provider is deprecated, as it won’t work for subscriptions. 已经弃用，不支持订阅。
	*	'Object - WebsocketProvider': The Websocket provider is the standard for usage in legacy browsers. 传统浏览器中使用Websocket provider
	*	'Object - IpcProvider': The IPC provider is used node.js dapps when running a local node. Gives the most secure connection. 在node.js运行的本地节点中使用IPC的provider，相对于前面的这种方式提供了一个最安全的连接。

####Example

```
var Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
var web3 = new Web3(Web3.givenProvider || 'ws://remotenode.com:8546');
// or
var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://remotenode.com:8546'));

// Using the IPC provider in node.js
var net = require('net');

var web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// on windows the path is: "\\\\.\\pipe\\geth.ipc"
// on linux the path is: "/users/myuser/.ethereum/geth.ipc"
```

##givenProvider

```
web3.givenProvider
web3.eth.givenProvider
web3.shh.givenProvider
web3.bzz.givenProvider
...
```

When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser. Will return the given provider by the (browser) environment, otherwise ‘null’.

在兼容以太坊的浏览器中使用web3.js，浏览器会自动设置当前的本地provider。返回环境指定的provider，否则返回null。

####Returns

‘Object’: The given provider set or ‘null’;

####Example

##currentProvider

```
web3.currentProvider
web3.eth.currentProvider
web3.shh.currentProvider
web3.bzz.currentProvider
...
```

Will return the current provider, otherwise ‘null’.

####Returns

‘Object’: The current provider set or ‘null’;

####Example

##BatchRequest

####Parameters

####Returns

####Example

##extend

####Parameters

####Returns

####Example

##defaultAccount

####Property

####Example

##defaultBlock

####Property

####Example

##getProtocolVersion

####Returns

####Example

##isSyncing

####Returns

####Example

##getCoinbase

####Returns

####Example

##isMining

####Returns

####Example

##getHashrate

####Returns

####Example

##getGasPrice

####Returns

####Example

##getAccounts

####Returns

####Example

##getBlockNumber

####Returns

####Example

##getBalance

####Parameters

####Returns

####Example

##getStorageAt

####Parameters

####Returns

####Example

##getCode

####Parameters

####Returns

####Example

##getBlock

####Parameters

####Returns

####Example

##getBlockTransactionCount

####Parameters

####Returns

####Example

##getUncle

####Parameters

####Returns

####Example

##getTransaction

####Parameters

####Returns

####Example

##getTransactionFromBlock

####Parameters

####Returns

####Example

##getTransactionReceipt

####Parameters

####Returns

####Example

##getTransactionCount

####Parameters

####Returns

####Example

##sendTransaction

####Parameters

####Returns

####Example

##sendSignedTransaction

####Parameters

####Returns

####Example

##sign

####Parameters

####Returns

####Example

##signTransaction

####Parameters

####Returns

####Example

##call

####Parameters

####Returns

####Example

##estimateGas

####Parameters

####Returns

####Example

##getPastLogs

####Parameters

####Returns

####Example

##getCompilers

####Parameters

####Returns

####Example

##compile.solidity

####Parameters

####Returns

####Example

##compile.lll

####Parameters

####Returns

####Example

##compile.serpent

####Parameters

####Returns

##getWork

####Parameters

####Returns

####Example

##submitWork

####Parameters

####Returns

####Example


























