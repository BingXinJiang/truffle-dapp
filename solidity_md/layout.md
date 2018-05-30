#Layout of a Solidity Source File

Source files can contain an arbitrary number of contract definitions, include directives and pragma directives.

源文件可以定义任意数量的合约，包括指令和编译指示。



##Version Pragma

Source files can (and should) be annotated with a so-called version pragma to reject being compiled with future compiler versions that might introduce incompatible changes. We try to keep such changes to an absolute minimum and especially introduce changes in a way that changes in semantics will also require changes in the syntax, but this is of course not always possible. Because of that, it is always a good idea to read through the changelog at least for releases that contain breaking changes, those releases will always have versions of the form 0.x.0 or x.0.0.

源文件可以用版本号来标注，以防止后续引入了新的不兼容的版本。我们试图将这种版本升级带来的影响降到最小，尤其是引入语义的变化同时也改变语法。但这并不是总是可以做到的。因此，通读重大版本的修改日志是必要的，这些版本总是以0.X.0或X.0.0的变化来标示。

The version pragma is used as follows:

版本标注的格式如下：

```
pragma solidity ^0.4.0;
```

Such a source file will not compile with a compiler earlier than version 0.4.0 and it will also not work on a compiler starting from version 0.5.0 (this second condition is added by using ^). The idea behind this is that there will be no breaking changes until version 0.5.0, so we can always be sure that our code will compile the way we intended it to. We do not fix the exact version of the compiler, so that bugfix releases are still possible.

这样写的源码文件不会编译早于0.4.0的源码，同时它对于0.5.0以上（包含）的编译器也是不适用的（这一点是使用^来规范的）。这种设计背后的思考是，在0.5.0版本之前不会有重大的改变，以保证我们的代码可以以正确的方式编译。我们还没有确保编译器的确定版本，因此还存在很多改变的可能性。


##Importing other SOurce Files

##Comments



























