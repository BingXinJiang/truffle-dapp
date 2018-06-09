#Units and Globally Available Variables 局部变量和全局变量

##Ether Units Ether单位

A literal number can take a suffix of ’wei‘, ’finney‘, ’szabo‘ or ’ether‘ to convert between the subdenominations of Ether, where Ether currency numbers without a postfix are assumed to be Wei, e.g. ’2 ether == 2000 finney’ evaluates to ’true‘.

一个数可以使用’wei‘，’finney‘，’szabo‘或者’ether‘后缀作为Ether面值兑换单位，如果没有后缀默认为时’wei‘，例如：’2 ether == 2000 finney‘结果为true。

##Time Units 时间单元

Suffixes like ‘seconds’, ‘minutes’, ‘hours’, ‘days’, ‘weeks’ and ‘years’ after literal numbers can be used to convert between units of time where seconds are the base unit and units are considered naively in the following way:

数字添加后缀‘seconds’，‘minutes’，‘hours’，‘days’，‘weeks’和‘years’用来标示时间单位，时间的基本单位是秒，时间单位满足以下的基本转换规则：

	*	1 == 1 seconds
	*	1 minutes == 60 seconds
	*	1 hours == 60 minutes
	*	1 days == 24 hours
	*	1 weeks == 7 days
	*	1 years == 365 days

Take care if you perform calendar calculations using these units, because not every year equals 365 days and not even every day has 24 hours because of leap seconds. Due to the fact that leap seconds cannot be predicted, an exact calendar library has to be updated by an external oracle.

在使用这些时间单位计算日历的时候请注意，并不是每一年都有356天，由于闰秒的出现甚至并不是每一天都有24小时。由于闰秒的不可预测性，一个实际中的日历必须随着外部预测实时更新。

```
Note

The suffix ‘years’ has been deprecated due to the reasons above.

由于以上原因‘years’的后缀已经被废弃了。
```

These suffixes cannot be applied to variables. If you want to interpret some input variable in e.g. days, you can do it in the following way:

这些后缀不适用于变量。如果你想说明一些输入变量例如天数，你可以像下面这种方式实现：

```
function f(uint start, uint daysAfter) public {
    if (now >= start + daysAfter * 1 days) {
      // ...
    }
}
```

##Special Variables and Functions

There are special variables and functions which always exist in the global namespace and are mainly used to provide information about the blockchain or are general-use utility functions.

有一些特定的变量和函数会持续存在于全局空间中，它们主要是用来提供一些关于区块链的信息和一些通用的函数。

####Block and Transaction Properties 区块和交易属性

	*	block.blockhash(uint blockNumber) returns (bytes32): hash of the given block - only works for 256 most recent, excluding current, blocks - deprecated in version 0.4.22 and replaced by blockhash(uint blockNumber). 给定区块的hash值，只对最近的256个区块有效，包括当前的区块，函数在0.4.22中被废弃，被blockhash(uint blockNumber)函数取代。
	*	block.coinbase (address): current block miner’s address 当前区块的矿工地址
	*	block.difficulty (uint): current block difficulty 当前区块的挖矿难度
	*	block.gaslimit (uint): current block gaslimit 当前区块gas花费
	*	block.number (uint): current block number 当前区块数量
	*	block.timestamp (uint): current block timestamp as seconds since unix epoch 当前区块的unix时间戳
	*	gasleft() returns (uint256): remaining gas 剩余gas
	*	msg.data (bytes): complete calldata 所有的calldata数据
	*	msg.gas (uint): remaining gas - deprecated in version 0.4.21 and to be replaced by gasleft() 剩余gas，在0.4.21中被废弃，被函数gasleft()取代
	*	msg.sender (address): sender of the message (current call) 当前合约调用者的信息
	*	msg.sig (bytes4): first four bytes of the calldata (i.e. function identifier) calldata的钱四个字节(例如：函数标示符)
	*	msg.value (uint): number of wei sent with the message 以位为单位的发送的价值
	*	now (uint): current block timestamp (alias for block.timestamp) 当前区块的时间戳(通过block.timestamp获取)
	*	tx.gasprice (uint): gas price of the transaction 交易的gas价格
	*	tx.origin (address): sender of the transaction (full call chain) 交易的发起者

```
Note

The values of all members of msg, including msg.sender and msg.value can change for every external function call. This includes calls to library functions.

msg的每一个成员的值，包括msg.sender和msg.value都可以通过外部函数调用的方式改变。包括库函数的调用。
```

```
Note

Do not rely on block.timestamp, now and blockhash as a source of randomness, unless you know what you are doing.

不要依赖block.timestamp，now，和blockhash作为随机的来源，除非你清楚的知道你在做什么。

Both the timestamp and the block hash can be influenced by miners to some degree. Bad actors in the mining community can for example run a casino payout function on a chosen hash and just retry a different hash if they did not receive any money.

时间戳和区块hash在一定程度上都会受到矿工的影响。挖矿社区中可能会有一些不好的行为，例如对于选定的hash运行赌徒支付函数，如果他们没有收到钱只需要换一个Hash就行了。

The current block timestamp must be strictly larger than the timestamp of the last block, but the only guarantee is that it will be somewhere between the timestamps of two consecutive blocks in the canonical chain.

当前区块的时间戳必须严格大于过去区块的时间戳，但是唯一的保证是它处在规范链的连续两个区块之间的某一处。
```

```
Note

The block hashes are not available for all blocks for scalability reasons. You can only access the hashes of the most recent 256 blocks, all other values will be zero.

由于可伸缩性的原因，区块hash不能适用于所有区块。你只能访问最近256个区块的hash，访问所有其他的区块hash将会得到0。
```

##ABI Encoding Functions ABI编码函数

	*	abi.encode(...) returns (bytes): ABI-encodes the given arguments ABI编码给定的参数
	*	abi.encodePacked(...) returns (bytes): Performes packed encoding of the given arguments 打包编码的参数
	*	abi.encodeWithSelector(bytes4 selector, ...) returns (bytes): ABI-encodes the given arguments ABI编码给定的参数
	starting from the second and prepends the given four-byte selector 从第二个字节开始添加给定的四字节选择器
	*	abi.encodeWithSignature(string signature, ...) returns (bytes): Equivalent to（等价于） abi.encodeWithSelector(bytes4(keccak256(signature), ...)`

```
Note

These encoding functions can be used to craft data for function calls without actually calling a function. Furthermore, keccak256(abi.encodePacked(a, b)) is a more explicit way to compute keccak256(a, b), which will be deprecated in future versions.

这些编码函数可以为函数调用检测数据，而不用实际调用函数。更进一步，‘keccak256(abi.encodePacked(a, b))’是一个计算‘keccak256(a, b)’更精确的方法，‘keccak256(a, b)’在之后的版本会被废弃。
```

See the documentation about the ABI and the tightly packed encoding for details about the encoding.

有关编码的详细信息，查看有关的ABI和紧密编码的文档。

##Error Handling

	*	assert(bool condition):invalidates the transaction if the condition is not met - to be used for internal errors. 条件没有满足则交易无效-用于内部错误处理
	*	require(bool condition):reverts if the condition is not met - to be used for errors in inputs or external components. 条件不满足则回滚--用于输入或外部组件错误
	*	require(bool condition, string message):reverts if the condition is not met - to be used for errors in inputs or external components. Also provides an error message. 条件不满足则回滚--用于输入或外部组件错误，并提供错误信息
	*	revert():abort execution and revert state changes 退出执行并回滚状态
	*	revert(string reason):abort execution and revert state changes, providing an explanatory string 退出执行并回滚状态，提供解释性字符串

####Mathematical and Cryptographic Functions

	*	addmod(uint x, uint y, uint k) returns (uint):compute (x + y) % k where the addition is performed with arbitrary precision and does not wrap around at 2**256. Assert that k != 0 starting from version 0.5.0. 计算‘(x+y)%k’其中加法以任意精度执行，不会局限于2**256的范围。从0.5.0开始断言k!=0。
	*	mulmod(uint x, uint y, uint k) returns (uint):compute (x * y) % k where the multiplication is performed with arbitrary precision and does not wrap around at 2**256. Assert that k != 0 starting from version 0.5.0. 计算‘(x*y)%k’其中乘法以任意精度执行，不会局限于2**256的范围。从0.5.0开始断言k!=0。
	*	keccak256(...) returns (bytes32):compute the Ethereum-SHA-3 (Keccak-256) hash of the (tightly packed) arguments 计算紧密压缩过的参数的Ethereum-SHA-3 (Keccak-256)哈希值
	*	sha256(...) returns (bytes32):compute the SHA-256 hash of the (tightly packed) arguments 计算紧密压缩过的参数的SHA-256哈希值
	*	sha3(...) returns (bytes32):alias to keccak256  keccak256的简称
	*	ripemd160(...) returns (bytes20):compute RIPEMD-160 hash of the (tightly packed) arguments 计算紧密压缩过的参数的RIPEMD-160哈希值
	*	ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address):recover the address associated with the public key from elliptic curve signature or return zero on error (example usage) 从椭圆曲线算法中恢复与公钥相关联的地址，如果出错返回0，[例子](https://ethereum.stackexchange.com/questions/1777/workflow-on-signing-a-string-with-private-key-followed-by-signature-verificatio)

In the above, “tightly packed” means that the arguments are concatenated without padding. This means that the following are all identical:

上面的说明中，紧密压缩指的是参数之间紧密连接，没有填充。这意味着下面几个完全一致：

```
keccak256("ab", "c")
keccak256("abc")
keccak256(0x616263)
keccak256(6382179)
keccak256(97, 98, 99)
```

If padding is needed, explicit type conversions can be used: keccak256("\x00\x12") is the same as keccak256(uint16(0x12)).

如果需要填充，可以使用显式转换：‘keccak256("\x00\x12")’和‘keccak256(uint16(0x12))’是一样的。

Note that constants will be packed using the minimum number of bytes required to store them. This means that, for example, keccak256(0) == keccak256(uint8(0)) and keccak256(0x12345678) == keccak256(uint32(0x12345678)).

常量将使用它们存储使用的最小字节打包。这意味着，例如，‘keccak256(0) == keccak256(uint8(0))’ 和 ‘keccak256(0x12345678) == keccak256(uint32(0x12345678))’。

It might be that you run into Out-of-Gas for sha256, ripemd160 or ecrecover on a private blockchain. The reason for this is that those are implemented as so-called precompiled contracts and these contracts only really exist after they received the first message (although their contract code is hardcoded). Messages to non-existing contracts are more expensive and thus the execution runs into an Out-of-Gas error. A workaround for this problem is to first send e.g. 1 Wei to each of the contracts before you use them in your actual contracts. This is not an issue on the official or test net.

这可能是因为在私链中运行sha256, ripemd160 或者 ecrecover遇到了Out-of-Gas的状况。其原因是这些被实现作所谓的预编译合约，这些合约只有当它们收到第一条消息(尽管合约代码是硬编码)才真的存在。给不存在的合约发送消息代价很昂贵，因此执行中出现Out-of-Gas的错误。一个解决方式是在你真实的合约中实现使用之前先发送例如1wei到每一个合约中。这不是官方或测试网上的问题。

##Address Related

	*	<address>.balance (uint256):balance of the Address in Wei 以位位单位的账户余额
	*	<address>.transfer(uint256 amount):send given amount of Wei to Address, throws on failure, forwards 2300 gas stipend, not adjustable 发送指定位的钱到某个地址，发送失败，发送2300gas，不可调整
	*	<address>.send(uint256 amount) returns (bool):send given amount of Wei to Address, returns false on failure, forwards 2300 gas stipend, not adjustable 发送指定数量的钱到某个地址，失败返回false，发送2300gas，不可调整
	*	<address>.call(...) returns (bool):issue low-level CALL, returns false on failure, forwards all available gas, adjustable 低水平调用‘CALL’，失败返回fasle，发送所有可用的gas，可调整
	*	<address>.callcode(...) returns (bool):issue low-level CALLCODE, returns false on failure, forwards all available gas, adjustable 低水平调用‘CALLCODE’，失败返回false，发送所有可用的gas，可调整
	*	<address>.delegatecall(...) returns (bool):issue low-level DELEGATECALL, returns false on failure, forwards all available gas, adjustable 低水平调用‘DELEGATECALL’，失败返回false，发送所有可用的gas，可调整

For more information, see the section on Address.

更多的信息，参考Address章节。

```
Warning

There are some dangers in using send: The transfer fails if the call stack depth is at 1024 (this can always be forced by the caller) and it also fails if the recipient runs out of gas. So in order to make safe Ether transfers, always check the return value of send, use transfer or even better: Use a pattern where the recipient withdraws the money.

使用send函数会有一些危险：如果调用堆栈的深度为1024(调用程序始终可以强制执行此操作)或者接收者耗尽gas都会导致传输失败。因此为了保证Ether的安全传输，务必检查send的返回值，或者使用转账甚至是使用收款人提款模式。
```

```
Note

If storage variables are accessed via a low-level delegatecall, the storage layout of the two contracts must align in order for the called contract to correctly access the storage variables of the calling contract by name. This is of course not the case if storage pointers are passed as function arguments as in the case for the high-level libraries.

如果存储变量通过低水平的delegatecall函数访问，两个合约的存储布局必须一致，以便被调用的合约可以通过名字正确的访问到调用合约的存储变量。这当然不是存储指针以函数参数传递的情况，就像高级库那样。
```

```
Note

The use of callcode is discouraged and will be removed in the future.

callcode的使用不推荐，在未来会被移除。
```

##Contract Related

	*	this (current contract’s type 当前合约类型):the current contract, explicitly convertible to Address 当前的合约，显示的转化为地址
	*	selfdestruct(address recipient):destroy the current contract, sending its funds to the given Address 销毁当前合约，将资金发送到给定的地址
	*	suicide(address recipient):deprecated alias to selfdestruct 废弃，别名为selfdestruct

Furthermore, all functions of the current contract are callable directly including the current function.

此外，当前函数包含的所有函数都可以在当前包含的函数中直接调用。






