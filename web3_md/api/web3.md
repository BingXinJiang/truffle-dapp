#web3

The web3.js object is an umbrella package to house all ethereum related modules.

web3是一个伞包，用来容纳所有ethereum相关的模块。

```
var Web3 = require('web3');

> Web3.utils
> Web3.version
> Web3.modules

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

> web3.eth
> web3.shh
> web3.bzz
> web3.utils
> web3.version
```

##version

```
Web3.version
web3.version
```

Contains the version of the web3 container object.

包含了web3容器对象的版本信息。

####Returns

String: The current version.

String：当前的版本。

####Example

```
web3.version;
> "1.0.0"
```

##modules

```
Web3.modules
web3.modules
```

Will return an object with the classes of all major sub modules, to be able to instantiate them manually.

返回一个包含所有子模块类的对象，以便手动实例化它们。

####Returns

Object: A list of modules: 模块列表
	*	Eth - Function: the Eth module for interacting with the ethereum network see web3.eth for more. 与以太坊网络进行交互的Eth模块。
	*	Net - Function: the Net module for interacting with network properties see web3.eth.net for more. 与网络进行交互的网络模块
	*	Personal - Function: the Personal module for interacting with the ethereum accounts see web3.eth.personal for more. 与以太坊账户进行交互的个人模块
	*	Shh - Function: the Shh module for interacting with the whisper protocol see web3.shh for more. 与whisper协议交互的Shh模块
	*	Bzz - Function: the Bzz module for interacting with the swarm network see web3.bzz for more. 与swarm网络交互的Bzz模块。

####Example

```
web3.modules
> {
    Eth: Eth function(provider),
    Net: Net function(provider),
    Personal: Personal function(provider),
    Shh: Shh function(provider),
    Bzz: Bzz function(provider),
}
```

##utils

```
Web3.utils
web3.utils
```

Utility functions are also exposes on the Web3 class object directly.

utility类函数也直接绑定在Web3对象上。

##setProvider

```
web3.setProvider(myProvider)
web3.eth.setProvider(myProvider)
web3.shh.setProvider(myProvider)
web3.bzz.setProvider(myProvider)
...
```

Will change the provider for its module. 

我们可以使用该模块改变provider。

####Parameters

Object - myProvider: a valid provider. 一个可用的provider。

####Returns

Boolean

返回一个布尔值。

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

##provider

```
web3.providers
web3.eth.providers
web3.shh.providers
web3.bzz.providers
...
```

Contains the current available providers.

包含当前可用的provider。

####Value

Object with the following providers:

	*	Object - HttpProvider: The HTTP provider is deprecated, as it won’t work for subscriptions. http的provider已经被弃用了，因为它不适用于订阅。
	*	Object - WebsocketProvider: The Websocket provider is the standard for usage in legacy browsers. websocket的provider是传统浏览器中的标准使用。
	*	Object - IpcProvider: The IPC provider is used node.js dapps when running a local node. Gives the most secure connection. 运行本地节点时，IPC的provider被用于node.js的dapp。提供了最安全的连接。

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

When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser. Will return the given provider by the (browser) environment, otherwise null.

当使用以太坊可用的浏览器中使用web3时，它将使用当前本地浏览器提供的provider进行设置。返回给定的provider，否则返回null。

####

Object: The given provider set or null;

返回给定的provider对象或者null

####Example

```
web3.currentProvider
web3.eth.currentProvider
web3.shh.currentProvider
web3.bzz.currentProvider
...
```

Will return the current provider, otherwise null.

返回当前的provider或者null。

##currentProvider

```
web3.currentProvider
web3.eth.currentProvider
web3.shh.currentProvider
web3.bzz.currentProvider
...
```

Will return the current provider, otherwise null.

返回当前的provider或者null。

####Returns

Object: The current provider set or null;

返回当前的provider或者为null。

####Example

##BatchRequest

```
new web3.BatchRequest()
new web3.eth.BatchRequest()
new web3.shh.BatchRequest()
new web3.bzz.BatchRequest()
```

Class to create and execute batch requests.

用来创建和处理批量请求的类。

####Parameters

none

####Returns

Object: With the following methods: 下列方法：

	*	add(request): To add a request object to the batch call. 添加请求到批量调用。
	*	execute(): Will execute the batch request. 执行批量请求

####Example

```
var contract = new web3.eth.Contract(abi, address);

var batch = new web3.BatchRequest();
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, callback2));
batch.execute();
```

##extend

```
web3.extend(methods)
web3.eth.extend(methods)
web3.shh.extend(methods)
web3.bzz.extend(methods)
...
```

Allows extending the web3 modules.

对web3的模块进行扩展。

```
Note

You also have *.extend.formatters as additional formatter functions to be used for in and output formatting. Please see the source file for function details.

你也可以使用‘*.extend.formatters’作为额外的格式化函数对输入和输出进行格式。请查看源文件了解函数的详情。
```

####Parameters

methods - Object: Extension object with array of methods description objects as follows: 具有方法描述对象数组的扩展对象如下：
	*	property - String: (optional) The name of the property to add to the module. If no property is set it will be added to the module directly. 添加到模块的属性的名字(可选)。如果没有设置，它将会被直接添加到模块。
	*	methods - Array: The array of method descriptions: 方法描述数组
	*		*	name - String: Name of the method to add. 添加的方法的名字
	*		*	call - String: The RPC method name. RPC方法名字
	*		*	params - Number: (optional) The number of parameters for that function. Default 0. 函数参数的数量，默认为0。可选
	*		*	inputFormatter - Array: (optional) Array of inputformatter functions. Each array item responds to a function parameter, so if you want some parameters not to be formatted, add a null instead. 输入格式化函数数组。每一个数组项对应于一个函数参数，因此如果你不想一些参数被格式化，添加null。
	*		*	outputFormatter - ` `Function: (optional) Can be used to format the output of the method. 可以用于对输出方法进行格式化。


####Returns

Object: The extended module.

####Example

```
web3.extend({
    property: 'myModule',
    methods: [{
        name: 'getBalance',
        call: 'eth_getBalance',
        params: 2,
        inputFormatter: [web3.extend.formatters.inputAddressFormatter, web3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: web3.utils.hexToNumberString
    },{
        name: 'getGasPriceSuperFunction',
        call: 'eth_gasPriceSuper',
        params: 2,
        inputFormatter: [null, web3.utils.numberToHex]
    }]
});

web3.extend({
    methods: [{
        name: 'directCall',
        call: 'eth_callForFun',
    }]
});

console.log(web3);
> Web3 {
    myModule: {
        getBalance: function(){},
        getGasPriceSuperFunction: function(){}
    },
    directCall: function(){},
    eth: Eth {...},
    bzz: Bzz {...},
    ...
}
```

