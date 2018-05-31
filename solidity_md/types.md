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

除法的结果总是会被截断（它只是被编译为EVM的DIV操作码），





























