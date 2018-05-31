#Structure of a contract

Contracts in Solidity are similar to classes in object-oriented languages. Each contract can contain declarations of State Variables, Functions, Function Modifiers, Events, Struct Types and Enum Types. Furthermore, contracts can inherit from other contracts.

Solidity中的合约和面向对象语言中的类相似。每一个合约可以包含状态变量的声明，函数，函数修饰符，事件，结构体和枚举。更进一步，合约可以继承于其他合约。

##State Variables

State variables are values which are permanently stored in contract storage.

状态变量是会永久存储在合约内存里面。

```
pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData; // State variable
    // ...
}
```

See the Types section for valid state variable types and Visibility and Getters for possible choices for visibility.

有关状态变量的类型的有效性和可见性，getter方法的有效性，请参考Types的章节。

##Functions 函数

Functions are the executable units of code within a contract.

函数是合约中的可执行元素。

```
pragma solidity ^0.4.0;

contract SimpleAuction {
    function bid() public payable { // Function
        // ...
    }
}
```

Function Calls can happen internally or externally and have different levels of visibility (Visibility and Getters) towards other contracts.

函数的调用可能发生在合约的内部和合约的外部，并且函数对于其他合约具有不同的可见性（Visibility和Getters）。

##Function Modifiers 函数修饰符

Function modifiers can be used to amend the semantics of functions in a declarative way (see Function Modifiers in contracts section).

函数修饰符可以用于以函数声明的方式修改函数语义（具体查看函数合约章节的函数修饰符）。

```
pragma solidity ^0.4.22;

contract Purchase {
    address public seller;

    modifier onlySeller() { // Modifier
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    function abort() public onlySeller { // Modifier usage
        // ...
    }
}
```

##Events 事件

Events are convenience interfaces with the EVM logging facilities.

事件是链接EVM虚拟机日志系统的便利接口。

```
pragma solidity ^0.4.21;

contract SimpleAuction {
    event HighestBidIncreased(address bidder, uint amount); // Event

    function bid() public payable {
        // ...
        emit HighestBidIncreased(msg.sender, msg.value); // Triggering event
    }
}
```

See Events in contracts section for information on how events are declared and can be used from within a dapp.

更多的关于事件如何声明和在dapp里面被调用的信息，可以查看合约章节的事件。

##Struct Types 结构体类型

Structs are custom defined types that can group several variables (see Structs in types section).

结构体类型通常是将几种类型集合起来的一种数据类型（参考types章节的Structs）。

```
pragma solidity ^0.4.0;

contract Ballot {
    struct Voter { // Struct
        uint weight;
        bool voted;
        address delegate;
        uint vote;
    }
}
```


##Enum Types 枚举类型

Enums can be used to create custom types with a finite set of ‘constant values’ (see Enums in types section).

枚举类型可以使用有限的常量集创建的自定义类型（参考types章节的Enums）。


```
pragma solidity ^0.4.0;

contract Purchase {
    enum State { Created, Locked, Inactive } // Enum
}
```























