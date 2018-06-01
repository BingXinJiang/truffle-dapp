#Types 类型

Solidity is a statically typed language, which means that the type of each variable (state and local) needs to be specified (or at least known - see Type Deduction below) at compile-time. Solidity provides several elementary types which can be combined to form complex types.

Solidity是一个静态语言，这就意味着编译时需要指定每个变量的类型（状态和地址）。Solidity提供了一些基本的类型，它们可以结合成复杂的类型。

In addition, types can interact with each other in expressions containing operators. For a quick reference of the various operators, see Order of Precedence of Operators.

另外，各种类型可以包含于表达式中相互作用。有关各种表达式的快速引用，可以查看操作符的优先顺序。

##Value Types 值类型

The following types are also called value types because variables of these types will always be passed by value, i.e. they are always copied when they are used as function arguments or in assignments.

下面的类型也被称为值类型，因为这些类型的变量传递的时候会以值的方式进行传递，例如，当它们被用作函数参数时。

####Booleans 布尔类型

bool: The possible values are constants ”true“ and ”false“.

bool：可能取值为”true“和”false“

Operators：操作符

	*	! (logical negation) 逻辑否
	*	&& (logical conjunction, “and”) 与
	*	|| (logical disjunction, “or”) 或
	*	== (equality) 相等
	*	!= (inequality) 不相等

The operators || and && apply the common short-circuiting rules. This means that in the expression f(x) || g(y), if f(x) evaluates to true, g(y) will not be evaluated even if it may have side-effects.

操作符”||“和”&&“适用于常用的短路规则。这意味着在表达式”f(x) || g(y)“中，如果f(x)为真，g(y)不会被判断。

####Integers 整型

int / uint: Signed and unsigned integers of various sizes. Keywords uint8 to uint256 in steps of 8 (unsigned of 8 up to 256 bits) and int8 to int256. uint and int are aliases for uint256 and int256, respectively.

int / uint：可变长度的有符号整型和无符号整型。从uint8到uint256和int8到int256，每次增加的步长为8。uint和int分别是uint256和int256的别名。

Operators：操作符

	*	Comparisons: <=, <, ==, !=, >=, > (evaluate to bool) 比较运算符，得到bool
	*	Bit operators: &, |, ^ (bitwise exclusive or 按位异或), ~ (bitwise negation 按位取反) 位运算符
	*	Arithmetic operators: +, -, unary -, unary +, *, /, % (remainder 取余), ** (exponentiation 幂运算), << (left shift 左移), >> (right shift 右移) 算术运算符


Division always truncates (it is just compiled to the DIV opcode of the EVM), but it does not truncate if both operators are literals (or literal expressions).

除法的结果总是会被截断（它只是被编译为EVM的DIV操作码），but it does not truncate if both operators are literals (or literal expressions)

Division by zero and modulus with zero throws a runtime exception.

除以0或者对0取余，会抛出一个运行时异常。

The result of a shift operation is the type of the left operand. The expression x << y is equivalent to x * 2**y, and x >> y is equivalent to x / 2**y. This means that shifting negative numbers sign extends. Shifting by a negative amount throws a runtime exception.

移位操作符的结果是左操作符的结果。表达式 "x << y" 等于 "x * 2 ** y"，"x >> y" 等于 “x / 2 ** y”。 这意味着负数符号转移，相当于替换了操作符。位移一个负数会抛出一个运行时错误。

```
Warning

The results produced by shift right of negative values of signed integer types is different from those produced by other programming languages. In Solidity, shift right maps to division so the shifted negative values are going to be rounded towards zero (truncated). In other programming languages the shift right of negative values works like division with rounding down (towards negative infinity).

向右位移负整数个单位产生的结果与其他编程语言有所不同。在Solidity中向右位移相当于除，负值将会被舍入为0（截断），而在其他编程语言中，右移负值相当于除以一个无限接近0的负值（结果趋于负无穷大）。
```

####Fixed Point Number

```
Warning

Fixed point numbers are not fully supported by Solidity yet. They can be declared, but cannot be assigned to or from.

固定点数的数字还没有被Solidity完全支持。它可以被声明但不能被指定点位。
```

fixed / ufixed: Signed and unsigned fixed point number of various sizes. Keywords ufixedMxN and fixedMxN, where M represents the number of bits taken by the type and N represents how many decimal points are available. M must be divisible by 8 and goes from 8 to 256 bits. N must be between 0 and 80, inclusive. ufixed and fixed are aliases for ufixed128x18 and fixed128x18, respectively.

固定点位数 / 不固定点位数：有符号和无符号的各种大小的固定点位数。可以用关键字ufixedMxN和fixedMxN表示，字母M代表类型的位数，N代表有多少位小数。M必须被8整除，且必须是从8到256之间的数。N必须在0到80之间，包括0和80。ufixed和fixed分别代表ufixed128x18和fixed128x18。

Operators: 操作符

	*	Comparisons: <=, <, ==, !=, >=, > (evaluate to bool 结果为bool值) 比较运算符
	*	Arithmetic operators: +, -, unary(一元运算) -, unary +, *, /, % (remainder) 算术运算符

```
Note

The main difference between floating point (float and double in many languages, more precisely IEEE 754 numbers) and fixed point numbers is that the number of bits used for the integer and the fractional part (the part after the decimal dot) is flexible in the former, while it is strictly defined in the latter. Generally, in floating point almost the entire space is used to represent the number, while only a small number of bits define where the decimal point is.

浮点数（很多语言中为float和double类型，更精确的说是IEEE754 数字）和固定点位数的主要区别是整数部分和小数部分的位数在前者中是灵活的，在后者中是被严格定义的。一般来说，在浮点型中几乎所有的空间都用来表示数字，只有很小的数字位用来定义小数点的位置。
```

####Address 地址

address: Holds a 20 byte value (size of an Ethereum address). Address types also have members and serve as a base for all contracts.

地址：每个地址有20个字节的大小（以太坊地址的大小）。地址类型也拥有成员，并且作为所有合约的基础类型。

Operators: 操作符

	*	<=, <, ==, !=, >= and >

```
Note

Starting with version 0.5.0 contracts do not derive from the address type, but can still be explicitly converted to address.

从版本0.5.0开始，合约不会从地址类型派生，但是合约类型仍可以转换为地址类型。
```
#####Members of Addresses 地址内存

	*	balance and transfer 余额和转账

For a quick reference, see [Address Related](http://solidity.readthedocs.io/en/v0.4.24/units-and-global-variables.html#address-related). 

快速浏览，可以查看[地址相关](http://solidity.readthedocs.io/en/v0.4.24/units-and-global-variables.html#address-related)

It is possible to query the balance of an address using the property balance and to send Ether (in units of wei) to an address using the transfer function:

使用balance属性查询一个地址的余额和使用transfer函数向另外一个地址发送Ether(以位为单位)都是可行的。

```
address x = 0x123;
address myAddress = this;
if (x.balance < 10 && myAddress.balance >= 10) x.transfer(10);
```
```
Note

If x is a contract address, its code (more specifically: its fallback function, if present) will be executed together with the transfer call (this is a feature of the EVM and cannot be prevented). If that execution runs out of gas or fails in any way, the Ether transfer will be reverted and the current contract will stop with an exception.

如果x是合约地址，它的代码（具体指它的回调函数，如果存在的话）将会被调用执行（这是虚拟机的特性，不能被阻止）。如果执行过程中，gas不够了或者任何其他原因失败了，Ether的转移会被撤销，当前合约会停止执行，并抛出异常。
```
	*	send

Send is the low-level counterpart of transfer. If the execution fails, the current contract will not stop with an exception, but send will return false.

send对应了较低级别的transfer。如果执行失败，当前合约因为异常而停止，但是send会返回false。

```
Warning

There are some dangers in using send: The transfer fails if the call stack depth is at 1024 (this can always be forced by the caller) and it also fails if the recipient runs out of gas. So in order to make safe Ether transfers, always check the return value of send, use transfer or even better: use a pattern where the recipient withdraws the money.

使用send会存在一些隐患：如果调用堆栈的深度为1024（调用程序始终可以强制执行此操作）或者接受者gas耗尽都会导致转移失败。因此，为了安全完成Ether的转移，需要总是检查发送的金额，使用转账或者最好使用收款人提款的模式。
```

	*	call, callcode and delegatecall

Furthermore, to interface with contracts that do not adhere to the ABI, the function call is provided which takes an arbitrary number of arguments of any type. These arguments are padded to 32 bytes and concatenated. One exception is the case where the first argument is encoded to exactly four bytes. In this case, it is not padded to allow the use of function signatures here.

更进一步，为了与不符合ABI的合约对接，函数调用可以传入任意数量任意类型的参数。这些参数被填充至32个字节并关联在一起。有一个例外的情况是第一个参数正好被编码为四个字节。在这种情况下，它不会被填充并且允许签名功能的使用。

```
address nameReg = 0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2;
nameReg.call("register", "MyName");
nameReg.call(bytes4(keccak256("fun(uint256)")), a);
```

"call" returns a boolean indicating whether the invoked function terminated (true) or caused an EVM exception (false). It is not possible to access the actual data returned (for this we would need to know the encoding and size in advance).

"call"返回一个布尔值，用来标示被调用的函数是否正常执行结束（true）还是导致EVM抛出了一个异常（false）。它不会接触到实际返回的数据（因此我们需要提前知道编码和大小）。

It is possible to adjust the supplied gas with the .gas() modifier:

可以使用".gas()"修饰符调整gas的供应。

```
namReg.call.gas(1000000)("register", "MyName");
```

Similarly, the supplied Ether value can be controlled too:

同样的，提供的Ether也可以被控制

```
nameReg.call.value(1 ether)("register", "MyName");
```

Lastly, these modifiers can be combined. Their order does not matter:

最后，这些修饰符可以合并在一起。他们的顺序不影响执行的结果：

```
nameReg.call.gas(1000000).value(1 ether)("register", "MyName");
```

```
Note

It is not yet possible to use the gas or value modifiers on overloaded functions.

在重载函数上使用设置gas和Ether的修饰符还不可以。

A workaround is to introduce a special case for gas and value and just re-check whether they are present at the point of overload resolution.

一个解决方案就是对于gas和Ether value 引入特例，并且判断在重载函数中是否是当前值。
```

In a similar way, the function delegatecall can be used: the difference is that only the code of the given address is used, all other aspects (storage, balance, …) are taken from the current contract. The purpose of delegatecall is to use library code which is stored in another contract. The user has to ensure that the layout of storage in both contracts is suitable for delegatecall to be used. Prior to homestead, only a limited variant called callcode was available that did not provide access to the original msg.sender and msg.value values.


函数delegatecall也可以以同样的方式被使用：唯一的区别在于使用的提供地址的代码不同，所有其他的（存储，余额等）都是来自于当前的合约。delegatecall的目的是使用存储在其他合约中的库函数。使用者必须确保两个合约中的存储布局适合delegatecall函数的调用。


























