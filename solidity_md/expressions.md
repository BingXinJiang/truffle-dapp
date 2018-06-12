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

刚声明的变量将有一个各个字节位上都是0的初始值。这些默认值是无论什么类型的数据特定的零状态。例如，布尔类型的默认值是false。对于uint和int类型缺省值为0。对于静态大小的数组，从bytes1到bytes32，数组的每一个元素的值将被初始化为该值对应类型的零状态值。对于动态数组，bytes和string，缺省值是空数组和空字符串。

A variable declared anywhere within a function will be in scope for the entire function, regardless of where it is declared (this will change soon, see below). This happens because Solidity inherits its scoping rules from JavaScript. This is in contrast to many languages where variables are only scoped where they are declared until the end of the semantic block. As a result, the following code is illegal and cause the compiler to throw an error, Identifier already declared:

变量声明在函数中，变量的作用域是整个函数，无论变量在函数的哪一个地方声明的(后面可能会变化)。这是因为Solidity继承了JavaScript的作用域规则。很多语言变量的作用域是自变量声明的地方直到语义块结束的位置，这跟Solidity语言正好相反。所以，下面的代码是非法的，编译时会抛出一个标识符已存在的声明：

```
// This will not compile

pragma solidity ^0.4.16;

contract ScopingErrors {
    function scoping() public {
        uint i = 0;

        while (i++ < 1) {
            uint same1 = 0;
        }

        while (i++ < 2) {
            uint same1 = 0;// Illegal, second declaration of same1
        }
    }

    function minimalScoping() public {
        {
            uint same2 = 0;
        }

        {
            uint same2 = 0;// Illegal, second declaration of same2
        }
    }

    function forLoopScoping() public {
        for (uint same3 = 0; same3 < 1; same3++) {
        }

        for (uint same3 = 0; same3 < 1; same3++) {// Illegal, second declaration of same3
        }
    }
}
```

In addition to this, if a variable is declared, it will be initialized at the beginning of the function to its default value. As a result, the following code is legal, despite being poorly written:

另外，变量一旦声明，变量就会在函数的开始初始化为缺省值。因此，尽管写的不好，下面的代码是合法的。

```
pragma solidity ^0.4.0;

contract C {
    function foo() public pure returns (uint) {
        // baz is implicitly initialized as 0
        uint bar = 5;
        if (true) {
            bar += baz;
        } else {
            uint baz = 10;// never executes
        }
        return bar;// returns 5
    }
}
```

####Scoping starting from Version 0.5.0 版本0.5.0之后的作用域

Starting from version 0.5.0, Solidity will change to the more widespread scoping rules of C99 (and many other languages): Variables are visible from the point right after their declaration until the end of a { }-block. As an exception to this rule, variables declared in the initialization part of a for-loop are only visible until the end of the for-loop.

从0.5.0版本开始，Solidity将改变为使用更为广泛的C99标准的变量作用域：变量的可用范围从声明的地方到大括号的作用域结束的位置。有一个例外情况就是，在for循环初始化时创建的变量只有在for循环内部，即for循环结束之前才可用。

Variables and other items declared outside of a code block, for example functions, contracts, user-defined types, etc., do not change their scoping behaviour. This means you can use state variables before they are declared and call functions recursively.

在代码快外部声明的变量或其他条目，例如函数，合约，用户自定义类型等等，作用域不会改变。这意味着你可以在声明之前使用状态变量，可以地柜调用函数。

These rules are already introduced now as an experimental feature.

这些规则目前已经以实验性功能被引入。

As a consequence, the following examples will compile without warnings, since the two variables have the same name but disjoint scopes. In non-0.5.0-mode, they have the same scope (the function minimalScoping) and thus it does not compile there.

如此，下面的例子编译的时候不会有警告，因为这两个变量虽然有相同的名字，但拥有不同的作用域。在非0.5.0模式下，它们拥有相同的作用域(函数作用域)会导致编译不通过。

```
pragma solidity ^0.4.0;
pragma experimental "v0.5.0";
contract C {
    function minimalScoping() pure public {
        {
            uint same2 = 0;
        }

        {
            uint same2 = 0;
        }
    }
}
```

As a special example of the C99 scoping rules, note that in the following, the first assignment to x will actually assign the outer and not the inner variable. In any case, you will get a warning about the outer variable being shadowed.

作为C99作用域规则的特殊例子，下面的例子中，第一次对变量x的赋值，是对外部的x进行的赋值，而不是内部的变量x的赋值。在这种情况下，你会得到一个外部变量被遮挡的警告。

```
pragma solidity ^0.4.0;
pragma experimental "v0.5.0";
contract C {
    function f() pure public returns (uint) {
        uint x = 1;
        {
            x = 2; // this will assign to the outer variable
            uint x;
        }
        return x; // x has value 2
    }
}
```

##Error handling Assert,Require,Revert and Exceptions 错误处理：断言，必需，回滚，异常

Solidity uses state-reverting exceptions to handle errors. Such an exception will undo all changes made to the state in the current call (and all its sub-calls) and also flag an error to the caller. The convenience functions assert and require can be used to check for conditions and throw an exception if the condition is not met. The assert function should only be used to test for internal errors, and to check invariants. The require function should be used to ensure valid conditions, such as inputs, or contract state variables are met, or to validate return values from calls to external contracts. If used properly, analysis tools can evaluate your contract to identify the conditions and function calls which will reach a failing assert. Properly functioning code should never reach a failing assert statement; if this happens there is a bug in your contract which you should fix.

Solidity使用状态回滚来处理异常。对于当前的调用来说(包括所有的子调用)出现了这样的异常，不会造成任何的状态上的改变，并且会对调用者抛出一个标识。便利函数assert和require函数，可以用来检测是否满足条件，条件不满足会抛出异常。assert函数只用来测试内部错误和检查不变量。require函数用来确保条件的可用，比如，输入值，合约的状态变量是否满足条件，外部合约调用的返回值是否可用等。如果使用得当，分析工具可以评估出你的合约在什么情况下会导致函数调用失败。正确的函数代码执行过程中永远不会出现断言失败的状态，如果发生了这种情况，就说明在你的合约中存在着需要修复的bug。

There are two other ways to trigger exceptions: The revert function can be used to flag an error and revert the current call. It is possible to provide a string message containing details about the error that will be passed back to the caller. The deprecated keyword throw can also be used as an alternative to revert() (but only without error message).

有两种方式可能会触发异常：revert函数用来标记错误并恢复当前的调用。它会提供一个包含错误信息的字符串返回给调用者。被废弃的throw关键字可以作为revert的替代方案(但是只有在没有错误信息的时候才可以使用)。

```
Note

From version 0.4.13 the throw keyword is deprecated and will be phased out in the future.

从0.4.13版本开始throw关键字被废弃，将会正在未来的版本中淘汰。
```

When exceptions happen in a sub-call, they “bubble up” (i.e. exceptions are rethrown) automatically. Exceptions to this rule are send and the low-level functions call, delegatecall and callcode – those return false in case of an exception instead of “bubbling up”.

当子调用发生异常，异常会自动冒泡(异常会再次抛出)。这条规则的例外就是send函数和一些低级函数call，delegatecall，callcode这些函数抛出异常时会返回false而不是向上冒泡。

```
Warning

The low-level call, delegatecall and callcode will return success if the called account is non-existent, as part of the design of EVM. Existence must be checked prior to calling if desired.

作为EVM设计机制的一部分，如果被调用账户不存在低级函数调用call，delegatecall，callcode会返回调用成功。因此，如果在调用之前必须先对账户进行存在性检查。
```

Catching exceptions is not yet possible.

异常捕获暂时还不可以。

In the following example, you can see how ‘require’ can be used to easily check conditions on inputs and how ‘assert’ can be used for internal error checking. Note that you can optionally provide a message string for ‘require’, but not for ‘assert’.

在下面的例子中，你可以看到require函数可以很方便的对输入的条件进行检查，assert可以对内部错误进行检查。注意你可以为require提供一个错误信息，但是assert不可以。

```
pragma solidity ^0.4.22;

contract Sharer {
    function sendHalf(address addr) public payable returns (uint balance) {
        require(msg.value % 2 == 0, "Even value required.");
        uint balanceBeforeTransfer = this.balance;
        addr.transfer(msg.value / 2);
        // Since transfer throws an exception on failure and
        // cannot call back here, there should be no way for us to
        // still have half of the money.
        // 一旦transfer函数抛出失败异常，这里又不能回调，我们就没办法保持一般的资金
        assert(this.balance == balanceBeforeTransfer - msg.value / 2);
        return this.balance;
    }
}
```

An assert-style exception is generated in the following situations:

assert类型的异常信息会在以下情况下产生：

    *   If you access an array at a too large or negative index (i.e. x[i] where i >= x.length or i < 0). 访问数组的索引越界，过大或者是负值
    *   If you access a fixed-length bytesN at a too large or negative index. 访问固定大小byteN类型的数据，索引过大或者为负值
    *   If you divide or modulo by zero (e.g. 5 / 0 or 23 % 0). 用0除一个数，或一个数对0取余
    *   If you shift by a negative amount. 位移一个负数
    *   If you convert a value too big or negative into an enum type. 将一个太大的值或负值转为枚举类型
    *   If you call a zero-initialized variable of internal function type. 调用了处于函数类型缺省值状态下的函数
    *   If you call assert with an argument that evaluates to false. 调用assert函数，并且断言结果返回false。

A require-style exception is generated in the following situations:

require类型的异常会在以下情况下产生：

    *   Calling throw. 调用throw方法
    *   Calling require with an argument that evaluates to false. 调用require方法，并且传入的参数评估结果为fasle
    *   If you call a function via a message call but it does not finish properly (i.e. it runs out of gas, has no matching function, or throws an exception itself), except when a low level operation call, send, delegatecall or callcode is used. The low level operations never throw exceptions but indicate failures by returning false. 通过消息调用函数，但是不能正常完成(例如gas消耗完，没有找到对应的函数，或者它自身抛出异常)，除非使用了低级函数，send，delegatecall或callcode。低级操作符从来不会抛出异常，标示失败的方式是返回false。
    *   If you create a contract using the new keyword but the contract creation does not finish properly (see above for the definition of “not finish properly”). 你用new关键字创建了一个合约，但是合约没有正常创建完成(查看上面没有正常完成的定义)。
    *   If you perform an external function call targeting a contract that contains no code. 你执行的外部函数调用的目标合约没有包含代码。
    *   If your contract receives Ether via a public function without payable modifier (including the constructor and the fallback function). 你的合约通过一个没有payable修饰符的公共函数接收了Ether。
    *   If your contract receives Ether via a public getter function. 你的合约通过一个公共的getter函数接收了Ether。
    *   If a .transfer() fails. 调用.transfer()函数失败。

Internally, Solidity performs a revert operation (instruction 0xfd) for a require-style exception and executes an invalid operation (instruction 0xfe) to throw an assert-style exception. In both cases, this causes the EVM to revert all changes made to the state. The reason for reverting is that there is no safe way to continue execution, because an expected effect did not occur. Because we want to retain the atomicity of transactions, the safest thing to do is to revert all changes and make the whole transaction (or at least call) without effect. Note that assert-style exceptions consume all gas available to the call, while require-style exceptions will not consume any gas starting from the Metropolis release.

在Solidity内部，对于require类型的异常执行恢复操作，对于assert类型的异常执行invalid操作。在两种情况下，都会导致EVM回滚所有的状态改变。因为期望的效果没有产生，继续执行会是一种不安全的方式，因此需要回滚所有的状态。由于我们要保留所有的原子交易信息，最安全的做法是回滚所有的改变使得所有的交易行为无效。注意，assert类型的异常会消耗所有可用的gas，而require类型的异常不会消耗任何gas。

The following example shows how an error string can be used together with revert and require:

下面的例子指出了在revert和require里的error信息怎么使用。

```
pragma solidity ^0.4.22;

contract VendingMachine {
    function buy(uint amount) payable {
        if (amount > msg.value / 2 ether)
            revert("Not enough Ether provided.");
        // Alternative way to do it:
        require(
            amount <= msg.value / 2 ether,
            "Not enough Ether provided."
        );
        // Perform the purchase.
    }
}
```

The provided string will be abi-encoded as if it were a call to a function Error(string). In the above example, revert("Not enough Ether provided."); will cause the following hexadecimal data be set as error return data:

提供的字符串会被abi编码，就像被函数Error(string)调用一样。在上面的例子中，revert("Not enough Ether provided.");将会导致下面的十六进制数据作为error的data被设置

```
0x08c379a0                                                         // Function selector for Error(string)
0x0000000000000000000000000000000000000000000000000000000000000020 // Data offset
0x000000000000000000000000000000000000000000000000000000000000001a // String length
0x4e6f7420656e6f7567682045746865722070726f76696465642e000000000000 // String data
```










