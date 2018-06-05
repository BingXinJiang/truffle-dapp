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


All three functions call, delegatecall and callcode are very low-level functions and should only be used as a last resort as they break the type-safety of Solidity.

所有这三个函数之中，delegatecall和callcode是非常低级的函数，应该是最后的备选，因为它们会打破Solidity的类型安全机制。

The .gas() option is available on all three methods, while the .value() option is not supported for delegatecall.

.gas()函数可用于以上三个方法。但是.value()函数不支持delegatecall函数。

```
Note

All contracts can be converted to address type, so it is possible to query the balance of the current contract using address(this).balance.

所有的合约都可以转化为地址类型，因此可以使用地址的balance属性查询当前合约的余额。
```

```
Note

The use of callcode is discouraged and will be removed in the future.

callcode不推荐使用，未来该函数可能被移除。
```

```
Warning

All these functions are low-level functions and should be used with care. Specifically, any unknown contract might be malicious and if you call it, you hand over control to that contract which could in turn call back into your contract, so be prepared for changes to your state variables when the call returns.

所有这些函数都是很低级的函数，使用的时候需要非常小心。具体来说就是，任何未知的合约都是很危险的，如果你调用它，就等于将控制权交给了那个合约，那么这个合约就可以回调你的合约，并通过回调函数改变你合约内部的状态。
```

#####Fixed-size byte arrays 固定大小的字节数组

bytes1, bytes2, bytes3, …, bytes32. byte is an alias for bytes1.

bytes1, bytes2, bytes3, ..., bytes32. byte是bytes1的简称。

Operators: 操作符

	*	Comparisons: <=, <, ==, !=, >=, > (evaluate to bool) 比较运算符
	*	Bit operators: &, |, ^ (bitwise exclusive or 按位异或), ~ (bitwise negation 按位否), << (left shift 左移), >> (right shift 右移) 位运算符
	*	Index access: If 'x' is of type 'bytesI', then 'x[k]' for '0 <= k < I' returns the 'k' th byte (read-only). 按索引访问 如果’x‘是bytesI类型，当0<=k<I的时候，x[k]返回第k个字节（只读）。

The shifting operator works with any integer type as right operand (but will return the type of the left operand), which denotes the number of bits to shift by. Shifting by a negative amount will cause a runtime exception.

位移运算使用整数类型作为操作数，代表着移动的位数。位移一个负数，会导致运行时错误。

Members: 成员变量

	*	'.length' yields the fixed length of the byte array (read-only). 返回字节数组的固定长度（只读）

```
Note

It is possible to use an array of bytes as byte[], but it is wasting a lot of space, 31 bytes every element, to be exact, when passing in calls. It is better to use bytes.

使用byte[]字节数组也是可以的，但是由于每个byte[]会占用31个字节，会浪费空间。尤其当作为调用参数传入时，最好使用bytes。
```

#####Dynamically-sized byte array 长度动态变化的字节数组

bytes:Dynamically-sized byte array, see Arrays. Not a value-type!

bytes：动态长度字节数组，参见Arrays。非值类型

string:Dynamically-sized UTF-8-encoded string, see Arrays. Not a value-type!

string：动态长度UTF-8编码字符串，参见Arrays。非值类型。

As a rule of thumb, use bytes for arbitrary-length raw byte data and string for arbitrary-length string (UTF-8) data. If you can limit the length to a certain number of bytes, always use one of bytes1 to bytes32 because they are much cheaper.

根据经验，对于任意长度的二进制数据或者任意长度的字符串，使用bytes。对于可以限定长度的数据，使用bytes1到bytes32之间的类型，可以节约空间。

####Address Literals 地址标示符

Hexadecimal literals that pass the address checksum test, for example '0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF' are of 'address' type. Hexadecimal literals that are between 39 and 41 digits long and do not pass the checksum test produce a warning and are treated as regular rational number literals.

通过地址校验的十六进制数为地址类型，例如：'0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF'。这些十六进制的数据长度在39到41位之间，如果不能通过校验将会产生一个警告，该数被当做常规有理数处理。

```
Note

The mixed-case address checksum format is defined in EIP-55.

地址检验格则在EIP-55。
```

####Rational and Integer Literals 有理数和整数的表示

Integer literals are formed from a sequence of numbers in the range 0-9. They are interpreted as decimals. For example, 69 means sixty nine. Octal literals do not exist in Solidity and leading zeros are invalid.

整数是由0-9之间的数字序列组成。它们被解释为小数。例如69即为六十九。在Solidity中不存在八进制的数，前导0是无效的。

Decimal fraction literals are formed by a . with at least one number on one side. Examples include 1., .1 and 1.3.

小数是由字符‘.’构成的，在‘.’的两边至少有一个数。例如：1.,.1,1.3。

Scientific notation is also supported, where the base can have fractions, while the exponent cannot. Examples include 2e10, -2e10, 2e-10, 2.5e1.

科学计数法也是支持的，底数可以是小数，但是指数不可以。例如：2e^10, -2e^10, 2e^-10, 2.5^e1。

Number literal expressions retain arbitrary precision until they are converted to a non-literal type (i.e. by using them together with a non-literal expression). This means that computations do not overflow and divisions do not truncate in number literal expressions.

数字可以表示任意的精度，如果它们不被转化为非数字类型（例如把数字和非数字类型一块使用）。这意味着计算不会溢出，数字除法运算中结果也不会被截断。

For example, (2**800 + 1) - 2**800 results in the constant 1 (of type uint8) although intermediate results would not even fit the machine word size. Furthermore, .5 * 8 results in the integer 4 (although non-integers were used in between).

例如，(2^800+1)-2^800的结果是uint8类型的常量1，尽管运算过程中的结果甚至超过了机器字节的大小。.5 * 8 结果是整数4（尽管使用了非整数类型）。

Any operator that can be applied to integers can also be applied to number literal expressions as long as the operands are integers. If any of the two is fractional, bit operations are disallowed and exponentiation is disallowed if the exponent is fractional (because that might result in a non-rational number).

任何用于整数的运算符都是可以用于数字表达式的，只要位运算操作数是整数。如果这两者任何一个是小数，位操作是不允许的并且如果指数是小数，则不允许进行位运算，因为可能会产生无理数。

```
Note

Solidity has a number literal type for each rational number. Integer literals and rational number literals belong to number literal types. Moreover, all number literal expressions (i.e. the expressions that contain only number literals and operators) belong to number literal types. So the number literal expressions ‘1 + 2’ and ‘2 + 1’ both belong to the same number literal type for the rational number three.

Solidity对任何的有理数都有对应的数字类型。整数类和有理数类都属于数字类。所有的数字类型的表达式（只包含数字和表达式）都属于数字类型。因此数字表达式‘1+2’和‘2+1’都是和数字3相同的数字表达式。
```

```
Warning

Division on integer literals used to truncate in earlier versions, but it will now convert into a rational number, i.e. 5 / 2 is not equal to 2, but to 2.5.

早期版本中整数的除法会被截断，但是现在将会被转换为有理数。例如5/2不等于2，而是等于2.5。
```

```
Note

Number literal expressions are converted into a non-literal type as soon as they are used with non-literal expressions. Even though we know that the value of the expression assigned to b in the following example evaluates to an integer, but the partial expression 2.5 + a does not type check so the code does not compile

数字表达式一旦与非数字表达式类型一起使用表达式进行计算，就会被转化为非数字表达式。在下面的例子中，尽管我们知道b的表达式值，但是由于类型表达式2.5+a会被解释成非数字表达式，因此这段代码会编译不通过。
```

```
uint128 a = 1;
uint128 b = 2.5 + a + 0.5;
```

####String Literals 字符串类型

String literals are written with either double or single-quotes ("foo" or 'bar'). They do not imply trailing zeroes as in C; "foo" represents three bytes not four. As with integer literals, their type can vary, but they are implicitly convertible to bytes1, …, bytes32, if they fit, to bytes and to string.

字符串类型被写作以双引号和单引号包括("foo"或‘bar’)。它们实现的时候不像C语言那样末尾补0，“foo”代表3个字节而不是4个。和整数类型一样，它们的类型也是可变的，然而它们可以被隐式转化为bytes1，...，bytes32，符合条件的话，还可以转化bytes，string。

String literals support escape characters, such as \n, \xNN and \uNNNN. \xNN takes a hex value and inserts the appropriate byte, while \uNNNN takes a Unicode codepoint and inserts an UTF-8 sequence.

字符串类型支持转义字符，例如 \n，\xNN，和 \uNNN。\xNN获取到十六进制的值，并存储到合适的byte中，\uNNN采用Unicode编码，并存储到UTF-8序列中。

####Hexadecimal Literals 十六进制字符类型

Hexademical Literals are prefixed with the keyword hex and are enclosed in double or single-quotes (hex"001122FF"). Their content must be a hexadecimal string and their value will be the binary representation of those values.

十六进制字符类型以关键字hex为前缀，以双引号或单引号包括，例如：hex“001222FF”。它们的内容必须是十六进制字符串，它们的值以二进制的形式存储。

Hexademical Literals behave like String Literals and have the same convertibility restrictions.

十六进制字符类型和字符串类型比较相似，拥有同样的转化规则。

####Enums 枚举类型

Enums are one way to create a user-defined type in Solidity. They are explicitly convertible to and from all integer types but implicit conversion is not allowed. The explicit conversions check the value ranges at runtime and a failure causes an exception. Enums needs at least one member.

在Solidity中，枚举是用户自定义类型的一种方式之一。它们可以显式的被转化为整数或从整数显式的转化而来，但是不允许被隐式的转化。显式转化将在运行时进行值的检查，转换失败将抛出异常。枚举类至少需要一个成员。

```
pragma solidity ^0.4.16;

contract test {
    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
    ActionChoices choice;
    ActionChoices constant defaultChoice = ActionChoices.GoStraight;

    function setGoStraight() public {
        choice = ActionChoices.GoStraight;
    }

    // Since enum types are not part of the ABI, the signature of "getChoice"
    // will automatically be changed to "getChoice() returns (uint8)"
    // for all matters external to Solidity. The integer type used is just
    // large enough to hold all enum values, i.e. if you have more values,
    // `uint16` will be used and so on.
    function getChoice() public view returns (ActionChoices) {
        return choice;
    }

    function getDefaultChoice() public pure returns (uint) {
        return uint(defaultChoice);
    }
}
```

####Function Types 函数类型

Function types are the types of functions. Variables of function type can be assigned from functions and function parameters of function type can be used to pass functions to and return functions from function calls. Function types come in two flavours - internal and external functions:

函数类型用来表示函数的类型。函数类型的变量可以使用函数、函数类型的参数进行赋值，可以作为函数参数传递，在函数调用中返回函数。函数的类型可以分为两类-内部函数和外部函数。

Internal functions can only be called inside the current contract (more specifically, inside the current code unit, which also includes internal library functions and inherited functions) because they cannot be executed outside of the context of the current contract. Calling an internal function is realized by jumping to its entry label, just like when calling a function of the current contract internally.

内部函数只能在当前合约内被调用(更确切的说是在当前代码单元，包括库函数和继承函数)，因为它们不能在超出当前合约的上下文环境执行。调用一个内部函数是通过跳到函数的入口标签实现的，就像内部调用当前合约的函数一样。

External functions consist of an address and a function signature and they can be passed via and returned from external function calls.

外部函数包含一个地址和一个函数签名，它们可以通过外部函数的调用被传递和返回。

Function types are notated as follows:

函数类型的表达式如下：

```
function (<parameter types>) {internal|external} [pure|constant|view|payable] [returns (<return types>)]
```

In contrast to the parameter types, the return types cannot be empty - if the function type should not return anything, the whole 'returns (< return types >)' part has to be omitted.






















