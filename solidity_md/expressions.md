#Expressions and Control Structures 表达式和控制结构

##Input Parameters abd Output Parameters 输入参数和输出参数

As in Javascript, functions may take parameters as input; unlike in Javascript and C, they may also return arbitrary number of parameters as output.

和JavaScript一样，函数可以作为参数输入；不像JavaScript和C语言，它们可以返回任意数量的参数作为输出。

####Input Parameters 输入参数

The input parameters are declared the same way as variables are. As an exception, unused parameters can omit the variable name. For example, suppose we want our contract to accept one kind of external calls with two integers, we would write something like:

输入参数的声明和变量的声明相同。另外，没有使用的参数可以忽略变量名。设想我们的合约接收带有两个整数的外部调用，我们可以这样写：

```
pragma solidity ^0.4.16;

contract Simple {
    function taker(uint _a, uint _b) public pure {
        // do something with _a and _b.
    }
}
```

####Output Parameters

The output parameters can be declared with the same syntax after the returns keyword. For example, suppose we wished to return two results: the sum and the product of the two given integers, then we would write:

输出参数可以在returns关键字后以同样的语法声明。例如：设想我们希望返回两个结果，给定两个整数的和和乘积，我们可以这样写：

```
pragma solidity ^0.4.16;

contract Simple {
    function arithmetics(uint _a, uint _b)
        public
        pure
        returns (uint o_sum, uint o_product)
    {
        o_sum = _a + _b;
        o_product = _a * _b;
    }
}
```

The names of output parameters can be omitted. The output values can also be specified using return statements. The return statements are also capable of returning multiple values, see Returning Multiple Values. Return parameters are initialized to zero; if they are not explicitly set, they stay to be zero.

输出参数的名称可以被忽略。输出的值也可以用return来进行指定。返回语句也可以返回多个值，可以参考[Returning Multiple Values](https://solidity.readthedocs.io/en/develop/control-structures.html#multi-return)返回参数的初始值为0，如果不特别指定，返回参数将一直为0.

Input parameters and output parameters can be used as expressions in the function body. There, they are also usable in the left-hand side of assignment.

输入参数和输出参数可以用于函数体中的表达式。因此他们也可以在表达式的左侧使用。

##Control Structures 控制结构

Most of the control structures from JavaScript are available in Solidity except for switch and goto. So there is: if, else, while, do, for, break, continue, return, ? :, with the usual semantics known from C or JavaScript.

除了switch和goto大部分JavaScript中的控制结构语句在Solidity中也是可用的。所以，if，else，while，do，for，break，continue，return，？，：，使用语义和C或者JavaScript中一样。

Parentheses can not be omitted for conditionals, but curly brances can be omitted around single-statement bodies.

条件语句不能省略括号，但在单个语句分枝中可以省略大括号。

Note that there is no type conversion from non-boolean to boolean types as there is in C and JavaScript, so if (1) { ... } is not valid Solidity.

注意，由于没有像C或JavaScript语言那样从非布尔值转化为布尔值的类型转换，因此表达式‘so if (1) { ... }’在Solidity中是不允许的。

####Returning Multiple Value

When a function has multiple output parameters, return (v0, v1, ..., vn) can return multiple values. The number of components must be the same as the number of output parameters.

当一个函数有多个输出值时可以使用‘return (v0, v1, ..., vn)’返回多个值。组件的数量必须和输出参数的数量相同。

##Function Calls 函数调用

####Internal Function Calls 内部函数调用

Functions of the current contract can be called directly (“internally”), also recursively, as seen in this nonsensical example:

当前合约的函数可以直接调用(内部)，也可以递归调用，就像下面这个没有实际意义的而例子：

```
pragma solidity ^0.4.16;

contract C {
    function g(uint a) public pure returns (uint ret) { return f(); }
    function f() internal pure returns (uint ret) { return g(7) + f(); }
}
```

These function calls are translated into simple jumps inside the EVM. This has the effect that the current memory is not cleared, i.e. passing memory references to internally-called functions is very efficient. Only functions of the same contract can be called internally.

这些函数的调用被转换为EVM内部的简单跳转。这样做的效果是当前内存不会被清除，将内存引用传递给内部调用函数非常有效。只有同样合约的的函数可以内部调用。

####External Function Calls 外部函数调用

The expressions this.g(8); and c.g(2); (where c is a contract instance) are also valid function calls, but this time, the function will be called “externally”, via a message call and not directly via jumps. Please note that function calls on this cannot be used in the constructor, as the actual contract has not been created yet.

表但是‘this.g(8);‘和’c.g(2);’(c是一个合约实例)也是有效的函数调用，但是这次函数的调用方式是外部调用，通过消息调用而不是直接通过EVM跳转。请注意使用this调用函数的方式不能使用在合约的构造函数里面，因为此时合约还没有被创建。

Functions of other contracts have to be called externally. For an external call, all function arguments have to be copied to memory.

其他合约的函数必须使用外部调用的方式调用。对于外部调用，所有函数的参数必须拷贝到内存中。

When calling functions of other contracts, the amount of Wei sent with the call and the gas can be specified with special options .value() and .gas(), respectively:

当调用其他合约的函数时，需要发送的wei和需要的gas可以通过选项'.value()'和'.gas()'进行指定。

```
pragma solidity ^0.4.0;

contract InfoFeed {
    function info() public payable returns (uint ret) { return 42; }
}

contract Consumer {
    InfoFeed feed;
    function setFeed(address addr) public { feed = InfoFeed(addr); }
    function callFeed() public { feed.info.value(10).gas(800)(); }
}
```

The modifier 'payable' has to be used for info, because otherwise, the '.value()'' option would not be available.

对于info函数必须使用‘payable’标识符，否则选项‘.value()’就会无效。

Note that the expression ‘InfoFeed(addr)’ performs an explicit type conversion stating that “we know that the type of the contract at the given address is InfoFeed” and this does not execute a constructor. Explicit type conversions have to be handled with extreme caution. Never call a function on a contract where you are not sure about its type.

表达式‘InfoFeed(addr)’做了显式类型转化，这说明，我们知道给定地址的合约类型是‘InfoFeed’，同时该转换不会调用构造函数。显式类型转换处理起来应格外小心。永远不要在你不确定的合约类型的时候，调用函数。

We could also have used ‘function setFeed(InfoFeed _feed) { feed = _feed; }’ directly. Be careful about the fact that ‘feed.info.value(10).gas(800)’ only (locally) sets the value and amount of gas sent with the function call and only the parentheses at the end perform the actual call.

我们可以直接使用函数‘function setFeed(InfoFeed _feed) { feed = _feed; }’。注意‘feed.info.value(10).gas(800)’只是设置了发送的价值和gas数量，只有最后的括号才是实际的函数调用。

Function calls cause exceptions if the called contract does not exist (in the sense that the account does not contain code) or if the called contract itself throws an exception or goes out of gas.

如果调用的合约不存在(该账户不包含代码)或者调用的合约本身抛出了异常或gas消耗完了，函数的调用会导致异常。

```
Warning

Any interaction with another contract imposes a potential danger, especially if the source code of the contract is not known in advance. The current contract hands over control to the called contract and that may potentially do just about anything. Even if the called contract inherits from a known parent contract, the inheriting contract is only required to have a correct interface. The implementation of the contract, however, can be completely arbitrary and thus, pose a danger. In addition, be prepared in case it calls into other contracts of your system or even back into the calling contract before the first call returns. This means that the called contract can change state variables of the calling contract via its functions. Write your functions in a way that, for example, calls to external functions happen after any changes to state variables in your contract so your contract is not vulnerable to a reentrancy exploit.

任何和其他合约的交互都会导致潜在的危险，尤其是在其他的合约的源代码未知的情况下。当前的合约将将控制权移交到调用的合约，这可能导致发生任何事情。即使被调用合约继承于一个已知的父合约，继承合约也只需要有正确的接口。然后合约的实现多种多样，因此导致了危险。另外要做好准备以防它在你系统中的其他合约里调用，甚至在第一次调用返回前回到调用合约。这意味着被调用合约可以通过它的函数改变调用合约的状态变量。针对这种情况，你可以以这样的方式写你的函数，例如：在合约的状态变量修改后调用外部函数，以使你的合约不易受到攻击的影响。
```

####Named Calls and Anonymous Function Parameters 名称调用和匿名函数参数

Function call arguments can also be given by name, in any order, if they are enclosed in ‘{ }’ as can be seen in the following example. The argument list has to coincide by name with the list of parameters from the function declaration, but can be in arbitrary order.

函数的参数也可以包括在‘{}’中，以任意顺序的名称给出，例如下面的例子。参数列表的名称必须与函数声明的时候相对应，顺序可以任意。

```
pragma solidity ^0.4.0;

contract C {
    function f(uint key, uint value) public {
        // ...
    }

    function g() public {
        // named arguments
        f({value: 2, key: 3});
    }
}
```

####Omitted Function Parameter Names 省略函数参数名

The names of unused parameters (especially return parameters) can be omitted. Those parameters will still be present on the stack, but they are inaccessible.

对于没有使用到的参数(尤其是返回参数)的名称可以忽略。这些参数仍然存在于栈中但是它们不可访问。

```
pragma solidity ^0.4.16;

contract C {
    // omitted name for parameter
    function func(uint k, uint) public pure returns(uint) {
        return k;
    }
}
```

##Creating Contracts via 'new' 通过new创建合约

A contract can create a new contract using the new keyword. The full code of the contract being created has to be known in advance, so recursive creation-dependencies are not possible.

合约可以通过new关键字创建一个新的合约。被创建的合约的所有代码必须提前知道，因此递归的创建依赖关系是不可以的。

```
pragma solidity ^0.4.0;

contract D {
    uint x;
    function D(uint a) public payable {
        x = a;
    }
}

contract C {
    // will be executed as part of C's constructor
    // 将会作为C的构造函数的一部分被执行
    D d = new D(4); 

    function createD(uint arg) public {
        D newD = new D(arg);
    }

    function createAndEndowD(uint arg, uint amount) public payable {
        // Send ether along with the creation
        // 随着创建的过程发送ether
        D newD = (new D).value(amount)(arg);
    }
}
```

As seen in the example, it is possible to forward Ether while creating an instance of ‘D’ using the ‘.value()’ option, but it is not possible to limit the amount of gas. If the creation fails (due to out-of-stack, not enough balance or other problems), an exception is thrown.

正如在例子中看到的，在创建合约实例‘D’的时候使用属性‘.value()’发送Ether是可以的，但是不能限制gas发送的数量。如果合约创建失败(由于堆栈越界，没有足够的余额或者其他问题)，会抛出异常。

##Order of Evaluation of Expressions 表达式的执行顺序

The evaluation order of expressions is not specified (more formally, the order in which the children of one node in the expression tree are evaluated is not specified, but they are of course evaluated before the node itself). It is only guaranteed that statements are executed in order and short-circuiting for boolean expressions is done. See Order of Precedence of Operators for more information.

表达式的执行顺序没有特别指定(更正式的说是，表达式节点的所有子节点的执行顺序没有被指定，但是他们在节点自身之前是被指定好了的)。这只能保证表达式按顺序执行和布尔表达式的短路行为可以。更多信息[参考操作符的执行顺序](https://solidity.readthedocs.io/en/develop/miscellaneous.html#order)。

##Assignment 分配

####Destructuring Assignments and Returning Multiple Value 结构赋值和多值返回

Solidity internally allows tuple types, i.e. a list of objects of potentially different types whose size is a constant at compile-time. Those tuples can be used to return multiple values at the same time. These can then either be assigned to newly declared variables or to pre-existing variables (or LValues in general):

Solidity内部允许元组类型，例如：在编译时大小是常量的不同类型的对象列表。这些元组可以用来同时返回多个值。然后这些元组的值可以赋给新声明的变量或者已经存在的变量(或一般的LValues)。

```
pragma solidity >0.4.23 <0.5.0;

contract C {
    uint[] data;

    function f() public pure returns (uint, bool, uint) {
        return (7, true, 2);
    }

    function g() public {
        // Variables declared with type and assigned from the returned tuple.
        // 变量声明的同时，从返回的元组中赋值
        (uint x, bool b, uint y) = f();
        // Common trick to swap values -- does not work for non-value storage types.
        // 交换值的常用方式--不适用与非值存储类型
        (x, y) = (y, x);
        // Components can be left out (also for variable declarations).
        // 组件也可以被忽略(也用作变量声明)
        // Sets the length to 7 
        // 长度设为7
        (data.length,,) = f(); 
        // Components can only be left out at the left-hand-side of assignments, with
        // one exception:
        // 组件只能在左侧忽略，但是有一个例外
        (x,) = (1,);
        // (1,) is the only way to specify a 1-component tuple, because (1) is
        // equivalent to 1.
        // (1,)是唯一指定一元元组的方式，因为(1)等同于1。
    }
}
```

```
Prior to version 0.4.24 it was possible to assign to tuples of smaller size, either filling up on the left or on the right side (which ever was empty). This is now deprecated, both sides have to have the same number of components.

在0.4.24之前，可以为元组分配更小大小的元组，填充在右侧或者填充在左侧(空的)。目前已经被废弃了，两边必须拥有同样数量的组件。
```

####Complications for Arrays and Structs 数组和结构体矩阵

The semantics of assignment are a bit more complicated for non-value types like arrays and structs. Assigning to a state variable always creates an independent copy. On the other hand, assigning to a local variable creates an independent copy only for elementary types, i.e. static types that fit into 32 bytes. If structs or arrays (including bytes and string) are assigned from a state variable to a local variable, the local variable holds a reference to the original state variable. A second assignment to the local variable does not modify the state but only changes the reference. Assignments to members (or elements) of the local variable do change the state.

赋值对于数组和结构体这样的非值类型更复杂一些。给状态变量赋值，总会创建一个独立的副本。换句话说，对于局部变量只有基本类型比如适用于32个字节的静态类型的赋值才会拷贝一个副本。如果数组或结构体被从一个状态变量赋值给一个局部变量，局部变量只是拥有一个指向原状态变量的引用。对局部变量的第二次赋值不会改变状态变量只会改变引用。赋值给局部变量的成员会改变状态变量。

##Scoping and Declarations 范围界定和声明

A variable which is declared will have an initial default value whose byte-representation is all zeros. The “default values” of variables are the typical “zero-state” of whatever the type is. For example, the default value for a bool is false. The default value for the uint or int types is 0. For statically-sized arrays and bytes1 to bytes32, each individual element will be initialized to the default value corresponding to its type. Finally, for dynamically-sized arrays, bytes and string, the default value is an empty array or string.



####Scoping starting from Version 0.5.0

##Error handling Assert,Require,Revert and Exceptions
