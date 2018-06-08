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

和参数的类型不同，返回类型不能为空，如果函数不返回任何东西，整个“returns (< return types >”的部分应全部省略。

By default, function types are internal, so the internal keyword can be omitted. In contrast, contract functions themselves are public by default, only when used as the name of a type, the default is internal.

默认情况下函数类型是内部属性，因此internal关键字可以省略。相比之下，合约函数本身是公共的，只有作为类型的名称时默认是内部的。

There are two ways to access a function in the current contract: Either directly by its name, ‘f’, or using ‘this.f’. The former will result in an internal function, the latter in an external function.

在合约中有两种方式可以访问到函数，直接访问函数名‘f’或者使用‘this.f’。前者调用内部函数，后者调用外部函数。

If a function type variable is not initialized, calling it will result in an exception. The same happens if you call a function after using delete on it.

如果一个函数类型的变量没有初始化，调用此函数的时候回抛出一个异常。一个函数被删除后再调用，也会抛出同样的异常。

If external function types are used outside of the context of Solidity, they are treated as the ‘function’ type, which encodes the address followed by the function identifier together in a single ‘bytes24’ type.

如果外部函数在Solidity以外的上下文环境使用，它们将被当做一个包含函数标识符的被编码的bytes24类型的地址。

Note that public functions of the current contract can be used both as an internal and as an external function. To use ‘f’ as an internal function, just use ‘f’, if you want to use its external form, use ‘this.f’.

注意到目前合约的公共函数既可以用作内部函数也可以作为外部函数。使用‘f’就代表使用内部函数，使用‘this.f’就代表使用外部函数。

Additionally, public (or external) functions also have a special member called ‘selector’, which returns the [ABI function selector](http://solidity.readthedocs.io/en/v0.4.24/abi-spec.html#abi-function-selector):

另外，公共函数有一个特定的成员变量‘selector’，它返回ABI函数的selector。

```
pragma solidity ^0.4.16;

contract Selector {
  function f() public view returns (bytes4) {
    return this.f.selector;
  }
}
```

Example that shows how to use internal function types:

下面的例子说明了怎么使用内部函数类型。

```
pragma solidity ^0.4.16;

library ArrayUtils {
  // internal functions can be used in internal library functions because
  // they will be part of the same code context
  // 内部函数可以用于内部库函数，因为它们属于同一个上下文
  function map(uint[] memory self, function (uint) pure returns (uint) f)
    internal
    pure
    returns (uint[] memory r)
  {
    r = new uint[](self.length);
    for (uint i = 0; i < self.length; i++) {
      r[i] = f(self[i]);
    }
  }
  function reduce(
    uint[] memory self,
    function (uint, uint) pure returns (uint) f
  )
    internal
    pure
    returns (uint r)
  {
    r = self[0];
    for (uint i = 1; i < self.length; i++) {
      r = f(r, self[i]);
    }
  }
  function range(uint length) internal pure returns (uint[] memory r) {
    r = new uint[](length);
    for (uint i = 0; i < r.length; i++) {
      r[i] = i;
    }
  }
}

contract Pyramid {
  using ArrayUtils for *;
  function pyramid(uint l) public pure returns (uint) {
    return ArrayUtils.range(l).map(square).reduce(sum);
  }
  function square(uint x) internal pure returns (uint) {
    return x * x;
  }
  function sum(uint x, uint y) internal pure returns (uint) {
    return x + y;
  }
}
```

Another example that uses external function types:

另外一个使用外部函数的例子：

```
pragma solidity ^0.4.22;

contract Oracle {
  struct Request {
    bytes data;
    function(bytes memory) external callback;
  }
  Request[] requests;
  event NewRequest(uint);
  function query(bytes data, function(bytes memory) external callback) public {
    requests.push(Request(data, callback));
    emit NewRequest(requests.length - 1);
  }
  function reply(uint requestID, bytes response) public {
    // Here goes the check that the reply comes from a trusted source
    // 这里用来检测回复源是否受信任
    requests[requestID].callback(response);
  }
}

contract OracleUser {
  // known contract
  // 已知合约
  Oracle constant oracle = Oracle(0x1234567); 
  function buySomething() {
    oracle.query("USD", this.oracleResponse);
  }
  function oracleResponse(bytes response) public {
    require(
        msg.sender == address(oracle),
        "Only oracle can call this."
    );
    // Use the data
  }
}
```

```
Note

Lambda or inline functions are planned but not yet supported.

Lambda或内联函数计划在未来支持，但目前还没有支持。
```

##Reference Types 引用类型

Complex types, i.e. types which do not always fit into 256 bits have to be handled more carefully than the value-types we have already seen. Since copying them can be quite expensive, we have to think about whether we want them to be stored in memory (which is not persisting) or storage (where the state variables are held).

复杂类型，不能都归为256位的类型，相对于我们之前了解的值值类型，处理起来我们应该更加小心。由于拷贝它们花费比较大，我们考虑是否把它们存储在内存中(非持久存储)或者存储器中(存储状态变量的地方)。

####Data Location

Every complex type, i.e. arrays and structs, has an additional annotation, the “data location”, about whether it is stored in memory or in storage. Depending on the context, there is always a default, but it can be overridden by appending either ‘storage’ or ‘memory’ to the type. The default for function parameters (including return parameters) is ‘memory’, the default for local variables is ‘storage’ and the location is forced to ‘storage’ for state variables (obviously).

每一个复杂类型，例如：数组和结构体，都有一个附加的注解，即“数据位置”关于数据存储在内存中还是存储器中。根据上下文的不同，每种类型会有默认值，但可以通过给类型添加“storage”或者“memory”关键字来覆盖。函数参数包括函数返回参数默认存储是“memory”，本地变量的存储是“storage”，状态变量的位置强制存储为“storage”。

There is also a third data location, ‘calldata’, which is a non-modifiable, non-persistent area where function arguments are stored. Function parameters (not return parameters) of external functions are forced to ‘calldata’ and behave mostly like ‘memory’.

还有第三中数据存储位置，calldata，这个位置存储着函数的参数，存储的数据不可修改，非持久存储。外部函数的参数被强制到calldata存储区，存储形式和memory相似。

Data locations are important because they change how assignments behave: assignments between storage and memory and also to a state variable (even from other state variables) always create an independent copy. Assignments to local storage variables only assign a reference though, and this reference always points to the state variable even if the latter is changed in the meantime. On the other hand, assignments from a memory stored reference type to another memory-stored reference type do not create a copy.

数据的位置很重要，因为它会改变分配行为：在storage和memory之间的分配，包括状态变量（甚至外部的状态变量）总是会创建一个副本。虽然本地存储的变量只是指定了一个引用，该引用始终指向该状态变量，及时该状态变量发生变化。另一方面，从一个内存存储的引用类型分配到另一个内存存储的引用类型将不会创建副本。

```
pragma solidity ^0.4.0;

contract C {
	// the data location of x is storage
	// x 存储在storage区域
    uint[] x; 

    // the data location of memoryArray is memory
    // memoryArray存储在memory中。
    function f(uint[] memoryArray) public {
    	// works, copies the whole array to storage
    	// 有效， 拷贝整个array到storage中
        x = memoryArray; 
        // works, assigns a pointer, data location of y is storage
        // 有效，声明一个指针，y的数据位置为storage
        var y = x; 
        // fine, returns the 8th element
        // 好，返回第八个元素
        y[7]; 
        // fine, modifies x through y
        // 好，通过y改变了x
        y.length = 2; 
        // fine, clears the array, also modifies y
        // 好，清空array，同时改变了y
        delete x; 
        // The following does not work; it would need to create a new temporary /
        // unnamed array in storage, but storage is "statically" allocated:
        // 下面的操作无效
        // 它需要建立一个临时的无名数组在storage中，但是storage是静态分配
        // y = memoryArray;
        // This does not work either, since it would "reset" the pointer, but there
        // is no sensible location it could point to.
        // 这也是无效的，它要重置指针的指向，但是并没有要指向的位置
        // delete y;
        // calls g, handing over a reference to x
        // 调用g函数，释放对x的引用
        // 调用g函数，
        g(x); 
        // calls h and creates an independent, temporary copy in memory
        // 调用h函数，在memory中创建一个独立的临时的副本
        h(x); 
    }

    function g(uint[] storage storageArray) internal {}
    function h(uint[] memoryArray) public {}
}
```

#####Summary 总结

######Forced data location: 固定数据位置
	*	parameters (not return) of external functions: calldata 外部函数参数(不包括返回参数)：calldata
	*	state variables: storage 状态变量：storage

######Default data location: 默认数据位置
	*	parameters (also return) of functions: memory  函数参数(返回参数)：memory
	*	all other local variables: storage 所有其他的本地变量：storage

####Arrays 数组

Arrays can have a compile-time fixed size or they can be dynamic. For storage arrays, the element type can be arbitrary (i.e. also other arrays, mappings or structs). For memory arrays, it cannot be a mapping and has to be an ABI type if it is an argument of a publicly-visible function.

数组可以是编译时确定大小的数组或动态数组。对于数组的存储元素可以任意类型(其他的数组，映射或结构体等)。对于存储在memory中的数组，元素不能是mapping类型，并且作为一个公开可见的函数的参数数组元素必须是ABI类型。

An array of fixed size ‘k’ and element type ‘T’ is written as ‘T[k]’, an array of dynamic size as ‘T[]’. As an example, an array of 5 dynamic arrays of ‘uint’ is ‘uint[][5]’ (note that the notation is reversed when compared to some other languages). To access the second uint in the third dynamic array, you use ‘x[2][1]’ (indices are zero-based and access works in the opposite way of the declaration, i.e. ‘x[2]’ shaves off one level in the type from the right).

数组元素类型为‘T’，固定大小为‘k’的数组可以写作‘T[K]’，动态数组可以写作‘T[]’。例如，一个包含了五个uint数组的数组写作'uint[][5]'(这里的写法跟其他语言可能是相反的)。要访问第三个动态数组的第二个元素，可以使用‘x[2][1]’(索引从0开始，访问与声明的方式正好相反，例如，x[2]表示去掉一层右边的类型)。

Variables of type ‘bytes’ and ‘string’ are special arrays. A ‘bytes’ is similar to ‘byte[]’, but it is packed tightly in calldata. ‘string’ is equal to ‘bytes’ but does not allow length or index access (for now).

‘bytes’和‘string’类型的变量是特殊的数组。‘bytes’和‘byte[]’相似，但是‘bytes’类型的变量被包在‘calldata’中。‘string’等同于‘bytes’，但是目前来说不允许使用‘length’和索引。

So ‘bytes’ should always be preferred over ‘byte[]’ because it is cheaper.

‘bytes’由于使用起来更方便，因此相比‘byte[]’更多被使用。

```
Note

If you want to access the byte-representation of a string 's', use 'bytes(s).length' / 'bytes(s)[7] = 'x';'. Keep in mind that you are accessing the low-level bytes of the UTF-8 representation, and not the individual characters!

如果你想使用字符串s的bytes方法或属性，可以使用‘bytes(s).length’和‘bytes(s)[7] = 'x';’。请注意，这里访问的是UTF-8表示的低级字节，而不是单个的字符。
```

It is possible to mark arrays ‘public’ and have Solidity create a getter. The numeric index will become a required parameter for the getter.

为数组做上’public‘的标记，并让Solidity创建一个getter函数是可能的。对于getter函数，字母索引将变成一个必须的参数。

#####Allocating Memory Arrays 数组的内存分配

Creating arrays with variable length in memory can be done using the ’new‘ keyword. As opposed to storage arrays, it is not possible to resize memory arrays by assigning to the ’.length‘ member.

在’memory‘中创建可变长度的数组可以使用’new‘关键字。和’storage‘中的数组相反，它不能通过’.length‘设置数组的长度。

```
pragma solidity ^0.4.16;

contract C {
    function f(uint len) public pure {
        uint[] memory a = new uint[](7);
        bytes memory b = new bytes(len);
        // Here we have a.length == 7 and b.length == len
        a[6] = 8;
    }
}
```

#####Array Literals / Inline Arrays 

Array literals are arrays that are written as an expression and are not assigned to a variable right away.

array literals 是以表达式写入的数组，没有马上分配变量。

```
pragma solidity ^0.4.16;

contract C {
    function f() public pure {
        g([uint(1), 2, 3]);
    }
    function g(uint[3] _data) public pure {
        // ...
    }
}
```

The type of an array literal is a memory array of fixed size whose base type is the common type of the given elements. The type of [1, 2, 3] is uint8[3] memory, because the type of each of these constants is uint8. Because of that, it was necessary to convert the first element in the example above to uint. Note that currently, fixed size memory arrays cannot be assigned to dynamically-sized memory arrays, i.e. the following is not possible:

array literal 的类型是一个固定大小存储在memory中的数组，基本类型为数组元素的类型。[1,2,3]的类型是memory uint8[3]，由于它的每一个元素的类型都是uint8。因此，我们有必要将上例中的第一个元素转化为uint。注意，目前固定大小的memory数组不能被动态数组指向，下面的例子中是不可以的：

```
// This will not compile.

pragma solidity ^0.4.0;

contract C {
    function f() public {
        // The next line creates a type error because uint[3] memory
        // cannot be converted to uint[] memory.
        // 下面的一行代码会导致类型错误，因为uint[3]memory不能转化为uint[] memory
        uint[] x = [uint(1), 3, 4];
    }
}
```

It is planned to remove this restriction in the future but currently creates some complications because of how arrays are passed in the ABI.

计划在未来会删除这一限制，但是目前，由于数组在ABI中传递方式会比较复杂。

####Members

######length
Arrays have a length member to hold their number of elements. Dynamic arrays can be resized in storage (not in memory) by changing the .length member. This does not happen automatically when attempting to access elements outside the current length. The size of memory arrays is fixed (but dynamic, i.e. it can depend on runtime parameters) once they are created.

数组有一个length的成员变量来标示数组内元素的数量。在storage中可以通过设置.length重置数组的长度(在memory中的数组不能这样做)。在尝试访问数组长度以外的元素时，数组长度不会被重置。memeory中的数组一旦被创建大小就固定了(但是实现动态化需要依赖运行时的参数)。

######push
Dynamic storage arrays and bytes (not string) have a member function called push that can be used to append an element at the end of the array. The function returns the new length.

storage中的动态数组和bytes类型(非string)有一个push成员函数，可以通过该函数在数组末尾添加新的元素。该函数返回数组的新长度。

```
Warning

It is not yet possible to use arrays of arrays in external functions.

在外部函数中使用数组矩阵还不可以。
```

```
Warning

Due to limitations of the EVM, it is not possible to return dynamic content from external function calls. The function 'f' in 'contract C { function f() returns (uint[]) { ... } }' will return something if called from 'web3.js', but not if called from Solidity.

由于EVM的限制，从外部函数的调用返回动态内容是不可以的。在合约’contract C { function f() returns (uint[]) { ... } }‘中的函数’f‘，在’web3.js‘中调用可以返回一些值，但是在Solidity中调用不可以返回一些值。

The only workaround for now is to use large statically-sized arrays.

目前的唯一解决方案是使用较大的静态类型数组。
```

```
pragma solidity ^0.4.16;

contract ArrayContract {
    uint[2**20] m_aLotOfIntegers;
    // Note that the following is not a pair of dynamic arrays but a
    // dynamic array of pairs (i.e. of fixed size arrays of length two).
    // 注意下面的变量声明不是一组动态数组，而是
    bool[2][] m_pairsOfFlags;
    // newPairs is stored in memory - the default for function arguments

    function setAllFlagPairs(bool[2][] newPairs) public {
        // assignment to a storage array replaces the complete array
        m_pairsOfFlags = newPairs;
    }

    function setFlagPair(uint index, bool flagA, bool flagB) public {
        // access to a non-existing index will throw an exception
        m_pairsOfFlags[index][0] = flagA;
        m_pairsOfFlags[index][1] = flagB;
    }

    function changeFlagArraySize(uint newSize) public {
        // if the new size is smaller, removed array elements will be cleared
        m_pairsOfFlags.length = newSize;
    }

    function clear() public {
        // these clear the arrays completely
        delete m_pairsOfFlags;
        delete m_aLotOfIntegers;
        // identical effect here
        m_pairsOfFlags.length = 0;
    }

    bytes m_byteData;

    function byteArrays(bytes data) public {
        // byte arrays ("bytes") are different as they are stored without padding,
        // but can be treated identical to "uint8[]"
        m_byteData = data;
        m_byteData.length += 7;
        m_byteData[3] = byte(8);
        delete m_byteData[2];
    }

    function addFlag(bool[2] flag) public returns (uint) {
        return m_pairsOfFlags.push(flag);
    }

    function createMemoryArray(uint size) public pure returns (bytes) {
        // Dynamic memory arrays are created using `new`:
        uint[2][] memory arrayOfPairs = new uint[2][](size);
        // Create a dynamic byte array:
        bytes memory b = new bytes(200);
        for (uint i = 0; i < b.length; i++)
            b[i] = byte(i);
        return b;
    }
}
```

##Structs





















