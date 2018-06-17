#Glossary

##json interface

The json interface is a json object describing the Application Binary Interface (ABI) for an Ethereum smart contract.

json接口是以太坊智能合约的ABI描述的json对象。

Using this json interface web3.js is able to create JavaScript object representing the smart contract and its methods and events using the web3.eth.Contract object.

使用web3的json接口可以创建代表智能合约和智能合约的方法和事件的JavaScript对象，可以使用web3.eth.Contract对象进行创建。

####Specification

Functions：函数

	*	type: "function", "constructor" (can be omitted, defaulting to "function"; "fallback" also possible but not relevant in web3.js); 可以被省略，默认为“function”；“fallback”也是可以的但在web3里面并没有被应用
	*	name: the name of the function (only present for function types); 函数的名字，只代表函数的类型
	*	constant: true if function is specified to not modify the blockchain state; 如果函数被指定不会修改区块链的状态为true
	*	payable: true if function accepts ether, defaults to false; 如果函数允许接收ether则为true，默认为false。
	*	stateMutability: a string with one of the following values: pure (specified to not read blockchain state), view (same as constant above), nonpayable and payable (same as payable above); 一个拥有下列值的字符串，pure：指定不会读取区块链的状态；view和上面的constant一样；moneyable和payable和上面的payable一样。
	*	inputs: an array of objects, each of which contains: 对象数组每一个元素包含下列值：
	*		*	name: the name of the parameter; 参数名
	*		*	type: the canonical type of the parameter. 参数的规范类型
	*	outputs: an array of objects same as inputs, can be omitted if no outputs exist. 和inputs一样的对象数组，如果没有输出存在可以忽略

Events：事件

	*	type: always "event" 一直是‘event’
	*	name: the name of the event; 事件的名字
	*	inputs: an array of objects, each of which contains: 数组对象，每一个元素包含以下内容：
	*		*	name: the name of the parameter; 参数的名字
	*		*	type: the canonical type of the parameter. 参数的规范类型
	*		*	indexed: true if the field is part of the log’s topics, false if it one of the log’s data segment. 如果该字段为日志主题的一部分为true，如果为日志的数据段为false
	*	anonymous: true if the event was declared as anonymous. 如果事件被声明为匿名的则为true

####Example

```
contract Test {
    uint a;
    address d = 0x12345678901234567890123456789012;

    function Test(uint testInt)  { a = testInt;}

    event Event(uint indexed b, bytes32 c);

    event Event2(uint indexed b, bytes32 c);

    function foo(uint b, bytes32 c) returns(address) {
        Event(b, c);
        return d;
    }
}

// would result in the JSON:
[{
    "type":"constructor",
    "payable":false,
    "stateMutability":"nonpayable"
    "inputs":[{"name":"testInt","type":"uint256"}],
  },{
    "type":"function",
    "name":"foo",
    "constant":false,
    "payable":false,
    "stateMutability":"nonpayable",
    "inputs":[{"name":"b","type":"uint256"}, {"name":"c","type":"bytes32"}],
    "outputs":[{"name":"","type":"address"}]
  },{
    "type":"event",
    "name":"Event",
    "inputs":[{"indexed":true,"name":"b","type":"uint256"}, {"indexed":false,"name":"c","type":"bytes32"}],
    "anonymous":false
  },{
    "type":"event",
    "name":"Event2",
    "inputs":[{"indexed":true,"name":"b","type":"uint256"},{"indexed":false,"name":"c","type":"bytes32"}],
    "anonymous":false
}]
```













