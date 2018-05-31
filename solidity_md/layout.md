#Layout of a Solidity Source File

Source files can contain an arbitrary number of contract definitions, include directives and pragma directives.

源文件可以定义任意数量的合约，包括指令和编译指示。

##Version Pragma 编译版本

Source files can (and should) be annotated with a so-called version pragma to reject being compiled with future compiler versions that might introduce incompatible changes. We try to keep such changes to an absolute minimum and especially introduce changes in a way that changes in semantics will also require changes in the syntax, but this is of course not always possible. Because of that, it is always a good idea to read through the changelog at least for releases that contain breaking changes, those releases will always have versions of the form 0.x.0 or x.0.0.

源文件可以用版本号来标注，以防止后续引入了新的不兼容的版本。我们试图将这种版本升级带来的影响降到最小，尤其是引入语义的变化同时也改变语法。但这并不是总是可以做到的。因此，通读重大版本的修改日志是必要的，这些版本总是以0.X.0或X.0.0的变化来标示。

The version pragma is used as follows:

版本标注的格式如下：

```
pragma solidity ^0.4.0;
```

Such a source file will not compile with a compiler earlier than version 0.4.0 and it will also not work on a compiler starting from version 0.5.0 (this second condition is added by using ^). The idea behind this is that there will be no breaking changes until version 0.5.0, so we can always be sure that our code will compile the way we intended it to. We do not fix the exact version of the compiler, so that bugfix releases are still possible.

这样写的源码文件不会编译早于0.4.0的源码，同时它对于0.5.0以上（包含）的编译器也是不适用的（这一点是使用^来规范的）。这种设计背后的思考是，在0.5.0版本之前不会有重大的改变，以保证我们的代码可以以正确的方式编译。我们还没有确保编译器的确定版本，因此还存在很多改变的可能性。

It is possible to specify much more complex rules for the compiler version, the expression follows those used by npm.

为编译器版本指定更为复杂的规则也是可以的，这里支持npm的使用规范。


##Importing other Source Files 导入其他的源文件

####Syntax and Semantics 语法和语义

Solidity supports import statements that are very similar to those available in JavaScript (from ES6 on), although Solidity does not know the concept of a “default export”.

Solidity的导入语法非常类似于JavaScript（从ES6开始）的语法，尽管Solidity还不支持“default export”的方法。

At a global level, you can use import statements of the following form:

在全局层面，你可以按下面的格式导入：

```
import "filename";
```

This statement imports all global symbols from “filename” (and symbols imported there) into the current global scope (different than in ES6 but backwards-compatible for Solidity).

这种声明从全局范围内搜索导入“filename”的文件。

```
import * as symbolName from "filename";
```
…creates a new global symbol symbolName whose members are all the global symbols from "filename".

给引入的全局标示的所有成员起一个新的名字。

Another syntax is not part of ES6, but probably convenient:

另一种语法不属于ES6的范围，但可能更方便：

```
import "filename" as symbolName;
```

which is equivalent to import * as symbolName from "filename";.

这种写法等同于‘import * as symbolName from "filename";.’

####Paths 路径

In the above, filename is always treated as a path with / as directory separator, . as the current and .. as the parent directory. When . or .. is followed by a character except /, it is not considered as the current or the parent directory. All path names are treated as absolute paths unless they start with the current . or the parent directory ...

在上面的写法中，引入的文件是/作为路径分割符，.作为当前路径，..代表上级路径。所有不以.或..开头的路径都被认为是绝对路径。

To import a file x from the same directory as the current file, use import "./x" as x;. If you use import "x" as x; instead, a different file could be referenced (in a global “include directory”).

从同一个路径引入文件x，使用 import “./x” as x; 如果你使用 import "x" as x; 将会引入不同的文件，从全局文件中引入。

It depends on the compiler (see below) how to actually resolve the paths. In general, the directory hierarchy does not need to strictly map onto your local filesystem, it can also map to resources discovered via e.g. ipfs, http or git.

这取决于编译器如何解析路径。通常来说，目录结构不一定非要映射到本地的文件系统，也可以是ipfs，http或者git。

####Use in Actual Compilers 使用编译器

When the compiler is invoked, it is not only possible to specify how to discover the first element of a path, but it is possible to specify path prefix remappings so that e.g. github.com/ethereum/dapp-bin/library is remapped to /usr/local/dapp-bin/library and the compiler will read the files from there. If multiple remappings can be applied, the one with the longest key is tried first. This allows for a “fallback-remapping” with e.g. "" maps to "/usr/local/include/solidity". Furthermore, these remappings can depend on the context, which allows you to configure packages to import e.g. different versions of a library of the same name.

当编译器被调用时，不仅可以指定某个路径下的第一个元素，而且可以指定路径的前缀修饰符，例如：可以将路径“github.com/ethereum/dapp-bin/library”下的文件映射到“/usr/local/dapp-bin/library”，编译器将会从这个路径下读取。如果使用了多个重定向，具有最长key的将会被优先尝试使用。This allows for a “fallback-remapping” with e.g. "" maps to "/usr/local/include/solidity". 此外，这些重构可以依赖于上下文，允许你按照相同的名字引入不同版本的依赖包。

#####solc： solc编译器

For solc (the commandline compiler), these remappings are provided as context:prefix=target arguments, where both the context: and the =target parts are optional (where target defaults to prefix in that case). All remapping values that are regular files are compiled (including their dependencies). This mechanism is completely backwards-compatible (as long as no filename contains = or :) and thus not a breaking change. All imports in files in or below the directory context that import a file that starts with prefix are redirected by replacing prefix by target.

对于solc (commandline编译器)，这些重设是作为上下文提供的:prefix=target 参数，其中“context:”和“=target”是可选的(在这种情况下，目标默认为前缀)。所有重新映射的值都是被编译过的常规文件(包括它们的依赖项)。这一机制完全向后兼容(只要没有文件名包含=或:)，因此不会发生破坏性的变化。在导入一个以前缀开头的文件的目录”context“内或以下的文件中的所有导入都是通过替换前缀来重定向的。

So as an example, if you clone "github.com/ethereum/dapp-bin/" locally to "/usr/local/dapp-bin", you can use the following in your source file:

例如：如果你要克隆”github.com/ethereum/dapp-bin/“到本地”/usr/local/dapp-bin“你可以按照下面这种写法：

```
import "github.com/ethereum/dapp-bin/library/iterable_mapping.sol" as it_mapping;
```

and then run the compiler as

运行编译

```
solc github.com/ethereum/dapp-bin/=/usr/local/dapp-bin/ source.sol
```

As a more complex example, suppose you rely on some module that uses a very old version of dapp-bin. That old version of dapp-bin is checked out at /usr/local/dapp-bin_old, then you can use

设想一个更复杂的例子，假设你所依赖的模块使用了dapp-in的非常老的版本。这些旧版本在”/usr/local/dapp-bin_old“，你可以这样使用：

```
solc module1:github.com/ethereum/dapp-bin/=/usr/local/dapp-bin/ \
     module2:github.com/ethereum/dapp-bin/=/usr/local/dapp-bin_old/ \
     source.sol
```

so that all imports in module2 point to the old version but imports in module1 get the new version.

因此，所有module2中的导入来源于旧版本，而module1中的导入都来自于新版本。

Note that solc only allows you to include files from certain directories: They have to be in the directory (or subdirectory) of one of the explicitly specified source files or in the directory (or subdirectory) of a remapping target. If you want to allow direct absolute includes, just add the remapping ”=/.“

注意到solc只允许包含特定文件夹的文件：它们必须位于明确指定的文件夹或子文件夹中或者或者重新映射的目录或子目录中。如果你想直接包含绝对路径下的路径，只需要添加重新映射 ”=/.“

If there are multiple remappings that lead to a valid file, the remapping with the longest common prefix is chosen.

如果有多个重新映射指向了同一个有效文件，则具有最长公共前缀的文件会被选择。

#####Remix：

Remix provides an automatic remapping for github and will also automatically retrieve the file over the network: You can import the iterable mapping by e.g.

Remix为github提供了一个自动的重新映射，并且可以通过网络自动检索文件：你可以像下面这样引入可迭代的映射：

```
import "github.com/ethereum/dapp-bin/library/iterable_mapping.sol" as it_mapping;
```

Other source code providers may be added in the future.

其他的资源在未来会被陆续加入。



##Comments 注释

Single-line comments (//) and multi-line comments (/*...*/) are possible.

单行注释使用// 多行注释使用 /*.....*/

```
// This is a single-line comment.

/*
This is a
multi-line comment.
*/
```

Additionally, there is another type of comment called a natspec comment, for which the documentation is not yet written. They are written with a triple slash ("///") or a double asterisk block(/** ...) and they should be used directly above function declarations or statements. You can use Doxygen-style tags inside these comments to document functions, annotate conditions for formal verification, and provide a confirmation text which is shown to users when they attempt to invoke a function.

另外还有另外一种注释叫做natspec注释，关于它的文档还没有完善。natspec注释的写法为”///“和"/** /分别完成单行注释和多行注释。它们可以被直接使用在函数定义或声明的上方。你可以在这些注释中使用Doxygen-style标签写函数文档，注明标准验证的条件。当用户试图调用函数的时候提供给用户一个确认文本。

In the following example we document the title of the contract, the explanation for the two input parameters and two returned values.

在下面的例子中，我们注明了合约的标题，解释了两个输入参数和两个返回参数。

```
pragma solidity ^0.4.0;

/** @title Shape calculator. */
contract shapeCalculator {
    /** @dev Calculates a rectangle's surface and perimeter.
      * @param w Width of the rectangle.
      * @param h Height of the rectangle.
      * @return s The calculated surface.
      * @return p The calculated perimeter.
      */
    function rectangle(uint w, uint h) returns (uint s, uint p) {
        s = w * h;
        p = 2 * (w + h);
    }
}
```































