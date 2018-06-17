#Getting Started

```
Note

This documentation is work in progress and web3.js 1.0 is not yet released! You can find the current documentation for web3 0.x.x at [](github.com/ethereum/wiki/wiki/JavaScript-API).

本文档正在更新中，web3.js的1.0版本还没有release版。你可以在github.com/ethereum/wiki/wiki/JavaScript-API 找到0.x.x版本的文档
```

The web3.js library is a collection of modules which contain specific functionality for the ethereum ecosystem.

web3.js是包含以太坊生态系统的特定函数库的集合。

	*	The web3-eth is for the ethereum blockchain and smart contracts web3-eth用于以太坊区块链和智能合约
	*	The web3-shh is for the whisper protocol to communicate p2p and broadcast web3-shh用于whisper协议用来p2p连接和广播
	*	The web3-bzz is for the swarm protocol, the decentralized file storage web3-bzz用于swarm协议，即分散式文件存储
	*	The web3-utils contains useful helper functions for Dapp developers. web3-utils包含对于开发者有用的帮助函数

##Adding web3.js

First you need to get web3.js into your project. This can be done using the following methods:

首先需要添加web3.js到项目中，可以使用以下方式：

	*	npm: npm install web3
	*	meteor: meteor add ethereum:web3
	*	pure js: link the dist/web3.min.js

After that you need to create a web3 instance and set a provider. Ethereum supported Browsers like Mist or MetaMask will have a ethereumProvider or web3.currentProvider available. For web3.js, check Web3.givenProvider. If this property is null you should connect to a remote/local node.

安装之后你需要创建一个web3的实例，并提供一个provider。以太坊支持像Mist或者MetaMask拥有ethereumProvider或web3.currentProvider的浏览器。对于web3.js，需要检查Web3.givenProvider。如果属性为null，你需要手动连接到一个远程或者本地节点。

```
// in node.js use: var Web3 = require('web3');

var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
```

That’s it! now you can use the web3 object.

现在你就可以使用web3对象了。

































