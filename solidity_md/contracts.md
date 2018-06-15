#Contracts

Contracts in Solidity are similar to classes in object-oriented languages. They contain persistent data in state variables and functions that can modify these variables. Calling a function on a different contract (instance) will perform an EVM function call and thus switch the context such that state variables are inaccessible.

Solidity中的合约和面向对象语言中的类相似。它们包含存储在状态变量里面的持久数据和修改这些变量的函数。在不同合约上调用函数将执行EVM的函数调用从而切换上下文使得状态变量不可访问。

##Creating Contracts

Contracts can be created “from outside” via Ethereum transactions or from within Solidity contracts.

合约可以通过以太坊交易从外部创建或从Solidity合约中创建。

IDEs, such as Remix, make the creation process seamless using UI elements.

像Remix类的IDE可以使用界面化工具创建合约。

Creating contracts programatically on Ethereum is best done via using the JavaScript API web3.js. As of today it has a method called web3.eth.Contract to facilitate contract creation.

通过编程的方式在Ethereum上创建合约最好通过JavaScript的web3.js。截止到今天它有一个web3.eth的函数，可以帮助合约的构建。

When a contract is created, its constructor (a function declared with the constructor keyword) is executed once. A constructor is optional. Only one constructor is allowed, and this means overloading is not supported.

合约创建的时候，构造函数(使用constructor关键字声明的函数)会立刻执行。构造函数是可选的。一个合约只允许有一个构造函数。

Internally, constructor arguments are passed ABI encoded after the code of the contract itself, but you do not have to care about this if you use web3.js.

在内部，构造函数的参数在代码本身之后通过ABI编码的方式传递。

If a contract wants to create another contract, the source code (and the binary) of the created contract has to be known to the creator. This means that cyclic creation dependencies are impossible.

如果一个问题合约创建另外一个合约，创建者必须知道被创建合约的源码(和二进制文件)。这意味着循环创建合约依赖是不可行的。

```
pragma solidity ^0.4.22;

contract OwnedToken {
    // TokenCreator is a contract type that is defined below.
    // It is fine to reference it as long as it is not used
    // to create a new contract.
    // TokenCreator是下面定义的一个合约类型
    // 只要不用于创建合约，那么引用它就可以。
    TokenCreator creator;
    address owner;
    bytes32 name;

    // This is the constructor which registers the
    // creator and the assigned name.
    // 这是构造函数，注册了创建者并指定了名字
    constructor(bytes32 _name) public {
        // State variables are accessed via their name
        // and not via e.g. this.owner. This also applies
        // to functions and especially in the constructors,
        // you can only call them like that ("internally"),
        // because the contract itself does not exist yet.
        // 状态变量通过名字访问而不是通过this.owner。
	// 这同样适用于函数，尤其是构造函数内的函数，只能通过名字调用，因为这时候合约本身还不存在
        owner = msg.sender;
        // We do an explicit type conversion from `address`
        // to `TokenCreator` and assume that the type of
        // the calling contract is TokenCreator, there is
        // no real way to check that.
	// 我们做一个明确的从address类型到TokenCreator类型的显式转换
	// 确保调用的合约类型是TokenCreator，没有其他的方式检查它
        creator = TokenCreator(msg.sender);
        name = _name;
    }

    function changeName(bytes32 newName) public {
        // Only the creator can alter the name --
        // the comparison is possible since contracts
        // are implicitly convertible to addresses.
	// 只有创建者可以更改名字
	// 由于合约可以隐式转换为地址，因此他们可以进行比较
        if (msg.sender == address(creator))
            name = newName;
    }

    function transfer(address newOwner) public {
        // Only the current owner can transfer the token.
	// 只有当前的owner可以传输token
        if (msg.sender != owner) return;
        // We also want to ask the creator if the transfer
        // is fine. Note that this calls a function of the
        // contract defined below. If the call fails (e.g.
        // due to out-of-gas), the execution here stops
        // immediately.
	// 我们依旧需要创建者确认转让是否良好。
	// 这回调用下面合约定义的函数。
	// 如果调用失败，这里的执行立即停止。
        if (creator.isTokenTransferOK(owner, newOwner))
            owner = newOwner;
    }
}

contract TokenCreator {
    function createToken(bytes32 name)
       public
       returns (OwnedToken tokenAddress)
    {
        // Create a new Token contract and return its address.
        // From the JavaScript side, the return type is simply
        // `address`, as this is the closest type available in
        // the ABI.
	// 创建一个新的Token合约并返回它的地址。
	// 从JavaScript的角度来看，返回类型是地址，因为这是ABI中最接近可用的类型
        return new OwnedToken(name);
    }

    function changeName(OwnedToken tokenAddress, bytes32 name)  public {
        // Again, the external type of `tokenAddress` is
        // simply `address`.
	// 再次，外部类型‘tokenAddress’的类型只是简单的address
        tokenAddress.changeName(name);
    }

    function isTokenTransferOK(address currentOwner, address newOwner)
        public
        view
        returns (bool ok)
    {
        // Check some arbitrary condition.
	// 检查一些任意的情况。
        address tokenAddress = msg.sender;
        return (keccak256(newOwner) & 0xff) == (bytes20(tokenAddress) & 0xff);
    }
}
```

##Visibility and Getters

Since Solidity knows two kinds of function calls (internal ones that do not create an actual EVM call (also called a “message call”) and external ones that do), there are four types of visibilities for functions and state variables.

由于Solidity有两种函数调用(内部函数不实际创建EVM调用也叫消息调用机制，外部函数调用)，有四种类型的可见性对于函数和状态变量。

Functions can be specified as being external, public, internal or private, where the default is public. For state variables, external is not possible and the default is internal.

函数可以被指定为外部的，公共的，内部的，私有的，默认是公共的。对于状态变量，不可能是外部的，默认为内部的。

	*	external: External functions are part of the contract interface, which means they can be called from other contracts and via transactions. An external function f cannot be called internally (i.e. f() does not work, but this.f() works). External functions are sometimes more efficient when they receive large arrays of data. 外部函数是合约接口的一部分，它们可以被外部合约或交易调用。外部函数f不能在内部调用(例如f()不起作用，this.f()起作用)。当接收到大数组数据的时候外部函数更有效。
	*	public: Public functions are part of the contract interface and can be either called internally or via messages. For public state variables, an automatic getter function (see below) is generated.  公共函数是合约接口的一部分也可以通过内部调用或者通过消息调用。对于公共的状态变量会自动产生getter函数。
	*	internal: Those functions and state variables can only be accessed internally (i.e. from within the current contract or contracts deriving from it), without using this. 这些函数和状态变量只允许内部访问(来自当前合约或当前合约的派生合约)。
	*	private: Private functions and state variables are only visible for the contract they are defined in and not in derived contracts. 私有函数和状态变量只有合约内可访问，它们在合约内部或派生合约内部。

```
Note

Everything that is inside a contract is visible to all external observers. Making something private only prevents other contracts from accessing and modifying the information, but it will still be visible to the whole world outside of the blockchain.

所有的外部观察者都可以看到合约内部的所有内容。将一些东西设置为私有的只是为了阻止其他的合约的访问或修改信息，但是它对于整个区块链的世界仍然都是可见的。
```

The visibility specifier is given after the type for state variables and between parameter list and return parameter list for functions.

可见性的说明符在状态变量的类型之后给出，在参数列表和函数返回参数列表之间。

```
pragma solidity ^0.4.16;

contract C {
    function f(uint a) private pure returns (uint b) { return a + 1; }
    function setData(uint a) internal { data = a; }
    uint public data;
}
```

In the following example, D, can call c.getData() to retrieve the value of data in state storage, but is not able to call f. Contract E is derived from C and, thus, can call compute.

在下面的例子中，D可以调用c.getData()获取到存储在状态变量中的值，但是不能调用f。合约E是从合约C中派生的，因此全部可以调用。

```
// This will not compile

pragma solidity ^0.4.0;

contract C {
    uint private data;

    function f(uint a) private returns(uint b) { return a + 1; }
    function setData(uint a) public { data = a; }
    function getData() public returns(uint) { return data; }
    function compute(uint a, uint b) internal returns (uint) { return a+b; }
}

contract D {
    function readData() public {
        C c = new C();
        uint local = c.f(7); // error: member `f` is not visible
        c.setData(3);
        local = c.getData();
        local = c.compute(3, 5); // error: member `compute` is not visible
    }
}

contract E is C {
    function g() public {
        C c = new C();
        uint val = compute(3, 5); // access to internal member (from derived to parent contract)
    }
}
```

####Getter Functions

The compiler automatically creates getter functions for all public state variables. For the contract given below, the compiler will generate a function called data that does not take any arguments and returns a uint, the value of the state variable data. The initialization of state variables can be done at declaration.

编译器会为所有的公共的状态变量创建getter函数。对于下面给出的合约，编译器会生成一个名为data的函数，该函数没有任何参数并且返回一个uint类型值为状态变量值的值。状态变量的初始化在声明的时候完成。

```
pragma solidity ^0.4.0;

contract C {
    uint public data = 42;
}

contract Caller {
    C c = new C();
    function f() public {
        uint local = c.data();
    }
}
```

The getter functions have external visibility. If the symbol is accessed internally (i.e. without this.), it is evaluated as a state variable. If it is accessed externally (i.e. with this.), it is evaluated as a function.

Getter函数具有外部可见性。如果以内部方式访问，它被当做一个状态变量。如果以外部方式访问，它被当做一个函数。

```
pragma solidity ^0.4.0;

contract C {
    uint public data;
    function x() public {
        data = 3; // internal access
        uint val = this.data(); // external access
    }
}
```

The next example is a bit more complex:

下一个例子较复杂一点：

```
pragma solidity ^0.4.0;

contract Complex {
    struct Data {
        uint a;
        bytes3 b;
        mapping (uint => uint) map;
    }
    mapping (uint => mapping(bool => Data[])) public data;
}
```

It will generate a function of the following form:

它会生成以下格式的函数

```
function data(uint arg1, bool arg2, uint arg3) public returns (uint a, bytes3 b) {
    a = data[arg1][arg2][arg3].a;
    b = data[arg1][arg2][arg3].b;
}
```

Note that the mapping in the struct is omitted because there is no good way to provide the key for the mapping.

注意到mapping在结构体中被忽略了，因为没有比较好的方式为mapping提供key。

##Function Modifiers 函数修饰符

Modifiers can be used to easily change the behaviour of functions. For example, they can automatically check a condition prior to executing the function. Modifiers are inheritable properties of contracts and may be overridden by derived contracts.

修饰符可以方便的改变函数的行为。例如，它可以在函数执行之前自动检测条件。修饰符是可继承的合约属性，并且可以被衍生的合约覆写。

```
pragma solidity ^0.4.22;

contract owned {
    function owned() public { owner = msg.sender; }
    address owner;

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    // 该合约只是定义了修饰符，但是没有使用，它将在衍生合约里使用。
    // 在特殊符号‘_;’出现的地方将定义的修饰符插入到函数体中。
    // 这意味着如果调用此函数修饰符函数就会被执行，否则会抛出异常。
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract mortal is owned {
    // This contract inherits the `onlyOwner` modifier from
    // `owned` and applies it to the `close` function, which
    // causes that calls to `close` only have an effect if
    // they are made by the stored owner.
    // 合约从owned继承了onlyOwner修饰符并将它应用于close函数，这会导致只有在存储拥有者调用函数的时候才有效果。
    function close() public onlyOwner {
        selfdestruct(owner);
    }
}

contract priced {
    // Modifiers can receive arguments:
    // 修饰符可以接收参数
    modifier costs(uint price) {
        if (msg.value >= price) {
            _;
        }
    }
}

contract Register is priced, owned {
    mapping (address => bool) registeredAddresses;
    uint price;

    function Register(uint initialPrice) public { price = initialPrice; }

    // It is important to also provide the
    // `payable` keyword here, otherwise the function will
    // automatically reject all Ether sent to it.
    // 在这里payable关键字是很重要的，否则函数将自动拒绝所有发送给它的Ether
    function register() public payable costs(price) {
        registeredAddresses[msg.sender] = true;
    }

    function changePrice(uint _price) public onlyOwner {
        price = _price;
    }
}

contract Mutex {
    bool locked;
    modifier noReentrancy() {
        require(
            !locked,
            "Reentrant call."
        );
        locked = true;
        _;
        locked = false;
    }

    /// This function is protected by a mutex, which means that
    /// reentrant calls from within `msg.sender.call` cannot call `f` again.
    /// The `return 7` statement assigns 7 to the return value but still
    /// executes the statement `locked = false` in the modifier.
    // 这个函数被互斥锁保护，这意味着在msg.sender.call不能再次调用函数f了。
    // 'return 7'语句将7赋给返回值，但仍然在修饰符中执行'locked = false'语句。
    function f() public noReentrancy returns (uint) {
        require(msg.sender.call());
        return 7;
    }
}
```

##Constant State Variables

##Functions

####View Functions

####Pure Functions

####Fallback Function

####Function Overloading

##Events

####Low-Level Interface to Logs

####Additional Resources for Understanding Events

##Inheritance

####Constructors

####Arguments for Base Constructors

####Multiple Inheritance and Linearization

####Inheriting Different Kinds of Members of the Same Name

##Abstract Contracts

##Interfaces

##Libraries

####Call Protection For Libraries

##Using For