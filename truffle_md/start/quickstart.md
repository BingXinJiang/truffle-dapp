#QUICKSTART

This page will take you through the basics of creating a Truffle project and deploying a smart contract to a blockchain.

这一页通过创建一个基本的truffle项目，并部署一个智能合约到区块链上。

```
Note: Before you begin, make sure that you read our Ethereum Overview page.

注意：开始之前请阅读以太坊概述页面。
```

##TABLE OF CONTENTS 目录

1. Creating a project
	-	Exploring the project
	-	Testing
	-	Compling
	-	Migrating with Truffle Develop
	-	Alternative:Migrating with Ganache
	-	Interacting with the contract

##CREATING A PROJECT

To use most Truffle commands, you need to run them against an existing Truffle project. So the first step is to create a Truffle project.

为了使用大多数的truffle命令行，你需要一个truffle项目来运行它们。因此第一步就是构建一个truffle项目。

You can create a bare project template, but for those just getting started, you can use Truffle Boxes, which are example applications and project templates. We'll use the MetaCoin box, which creates a token that can be transferred between accounts:

你可以创建一个项目模板，但是对于刚开始的学者，你可以使用Truffle Box，里面包含一些应用案例和项目模板。我们这里使用MetaCoin的例子，它创建了一个可以通过账户交易的token：

1. Create a new directory for your Truffle project: 为你的truffle项目，创建一个新的目录

```
mkdir MetaCoin
cd MetaCoin
```

2. Download ("unbox") the MetaCoin box: 下载MetaCoin

```
truffle unbox metacoin
```

```
Note: You can use the truffle unbox <box-name> command to download any of the other Truffle Boxes.

注意：你可以使用‘truffle unbox <box-name>’的命令去下载其他的truffle案例项目。
```

```
Note: To create a bare Truffle project with no smart contracts included, use truffle init.

注意：创建一个不包含合约的空白truffle想哭，使用‘truffle init’
```

Once this operation is completed, you'll now have a project structure with the following items:

操作执行完成后，你会得到如下结构的项目：

	*	contracts/: Directory for Solidity contracts Solidity合约目录
	*	migrations/: Directory for scriptable deployment files 部署脚本目录
	*	test/: Directory for test files for testing your application and contracts 测试你的合约应用的测试文件
	*	truffle.js: Truffle configuration file truffle配置文件

##EXPLORING THE PROJECT

```
Note: This page is just a quickstart, so we're not going to go into much detail here. Please see the rest of the Truffle documentation to learn more.

注意：本页只是快速开始介绍，因此不会涉及太多的细节。请查看其他的truffle文档来了解更多。
```

1. Open the 'contracts/MetaCoin.sol' file in a text editor. This is a smart contract (written in Solidity) that creates a MetaCoin token. Note that this also references another Solidity file 'contracts/ConvertLib.sol' in the same directory.

在编辑器中打开‘contracts/MetaCoin.sol’文件。这就是创建MetaCoin token的智能合约(以Solidity编写)。在同目录下还有其他的Solidity文件‘contracts/ConvertLib.sol’文件。

2. Open the 'contracts/Migrations.sol' file. This is a separate Solidity file that manages and updates the status of your deployed smart contract. This file comes with every Truffle project, and is usually not edited. 

打开‘contracts/Migrations.sol’文件。这是一个独立的Solidity文件，它管理并更新你部署的智能合约的状态。每一个truffle项目都包含这个文件，它通常是不被编辑的。

3. Open the 'migrations/1_initial_deployment.js' file. This file is the migration (deployment) script for the Migrations contract found in the ‘Migrations.sol‘ file.

打开‘migrations/1_initial_deployment.js’文件。这个文件是’Migrations.sol‘中引用的迁移部署脚本。

4. Open the 'migrations/2_deploy_contracts.js' file. This file is the migration script for the 'MetaCoin' contract. (Migration scripts are run in order, so the file beginning with 2 will be run after the file beginning with 1.)

打开’migrations/2_deploy_contracts.js‘文件。这个文件是MetaCoin的迁移脚本。迁移脚本按顺序执行，因此以2开头的脚本将在以1开头的脚本执行过后执行。

5. Open the ’test/TestMetacoin.sol‘ file. This is a test file written in Solidity which ensures that your contract is working as expected.

打开’test/TestMetacoin.sol‘文件。这是一个以solidity编写的测试文件，它可以确保你的合约按照期望运行。

6. Open the test/metacoin.js file. This is a test file written in JavaScript which performs a similar function to the Solidity test above.

打开’test/metacoin.js‘文件。这是一个以JavaScript编写的测试文件，它与上面提到的Solidity测试文件起到一样的作用。

7. Open the ’truffle.js‘ file. This is the Truffle configuration file, for setting network information and other project-related settings. The file is blank, but this is okay, as we'll be using a Truffle command that has some defaults built-in.

打开’truffle.js‘文件。这是truffle的配置文件，用来配置网络信息和其他项目有关的设置。这个文件是空白的，但是没有关系，我们可以使用truffle命令行配置，并且也会有一些默认的配置项会被编译进去。

##TESTING

1. On a terminal, run the Solidity test: 命令行运行测试文件

```
truffle test ./test/TestMetacoin.sol
```

You will see the following output 

你可以看到以下输出

```
  TestMetacoin
    √ testInitialBalanceUsingDeployedContract (71ms)
    √ testInitialBalanceWithNewMetaCoin (59ms)

  2 passing (794ms)
```

```
Note: If you're on Windows and encountering problems running this command, please see the documentation on resolving naming conflicts on Windows.

注意：如果你在windows上运行这句命令行遇到了一些问题，请查看在windows上解决命名冲突的文档。
```

These tree tests were run against the contract, with descriptions displayed on what the tests are supposed to do.

这些测试是针对合约运行的，并且针对测试目标具有描述呈现。

2. Run the JavaScript test: 运行JavaScript测试

```
truffle test ./test/metacoin.js
```

You will see the following output

你可以看到如下输出：

```
  Contract: MetaCoin
    √ should put 10000 MetaCoin in the first account
    √ should call a function that depends on a linked library (40ms)
    √ should send coin correctly (129ms)

  3 passing (255ms)
```

##COMPILING

1. Compile the smart contracts: 编译智能合约

```
truffle compile
```

You will see the following output:

你会看到如下输出：

```
Compiling .\contracts\ConvertLib.sol...
Compiling .\contracts\MetaCoin.sol...
Compiling .\contracts\Migrations.sol...

Writing artifacts to .\build\contracts
```

##MIGRATING WITH TRUFFLE DEVELOP

```
Note: To use Ganache, please skip to the next section.

注意：使用Ganache，请跳过下一个章节。
```

To deploy our smart contracts, we're going to need to connect to a blockchain. Truffle has a built-in personal blockchain that can be used for testing. This blockchain is local to your system and does not interact with the main Ethereum network.

为了部署你的智能合约，我们需要连接到区块链。truffle有一个内置的私链可以用来测试。这个区块链存在于你的系统中，和以太坊主网不交互。

You can create this blockchain and interact with it using Truffle Develop.

你可以使用’truffle develop‘创建一个区块链，并且与它进行交互。

```
truffle develop
```

You will see the following information:

你可以看到以下信息输出：

```
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
(1) 0xf17f52151ebef6c7334fad080c5704d77216b732
(2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
(3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
(4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
(5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
(6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
(7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
(8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
(9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de

Private Keys:
(0) c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
(1) ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
(2) 0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
(3) c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
(4) 388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
(5) 659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
(6) 82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
(7) aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
(8) 0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
(9) 8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5

Mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
Ensure you do not use it on production blockchains, or else you risk losing funds.   

truffle(development)>
```

This shows ten accounts (and their private keys) that can be used when interacting with the blockchain.

上面显示了10个账户包括他们的私钥，可以用来与区块链交互。

2. On the Truffle Develop prompt, Truffle commands can be run by omitting the ’truffle‘ prefix. For example, to run ’truffle compile‘ on the prompt, type ’compile‘. The command to deploy your compiled contracts to the blockchain is ’truffle migrate‘, so at the prompt, type:

在truffle提示符下，truffle命令行可以省略truffle的前缀。例如：要运行’truffle compile‘，只需要输入’compile‘就可以了。将编译好的合约部署到区块链是’truffle migrate‘，在提示符下：

```
migrate
```

You will see the following output:

你会得到以下输出：

```
Using network 'develop'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x63b393bd50251ec5aa3e159070609ee7c61da55531ff5dea5b869e762263cb90
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying ConvertLib...
  ... 0xa59221bc26a24f1a2ee7838c36abdf3231a2954b96d28dd7def7b98bbb8a7f35
  ConvertLib: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
  Linking ConvertLib to MetaCoin
  Deploying MetaCoin...
  ... 0x1cd9e2a790f4795fa40205ef58dbb061065ca235bee8979a705814f1bc141fd5
  MetaCoin: 0xf25186b5081ff5ce73482ad761db0eb0d25abfbf
Saving successful migration to network...
  ... 0x059cf1bbc372b9348ce487de910358801bbbd1c89182853439bec0afaee6c7db
Saving artifacts...
```

This shows the transaction IDs and addresses of your deployed contracts.

这些输出指出了交易的IDs和你部署的合约的地址。

```
Note: Your transaction IDs and contract addresses will be different from the above.

注意：你的交易IDs和合约地址和上面的是不一样的。
```

```
Note: To see how to interact with the contract, please skip to the next section.

注意：想要了解怎么与合约交互，请跳过下面的章节。
```

##ALTERNATIVE: MIGRATING WITH GANACHE

While Truffle Develop is an all-in-one personal blockchain and console, you can also use Ganache, a desktop application, to launch your personal blockchain. Ganache can be a more easy-to-understand tool for those new to Ethereum and the blockchain, as it displays much more information up-front.

虽然truffle develop是一个全功能的私链，你也可以使用Ganache，一个桌面应用来登录你的私链。对于新接触区块链和以太坊的人Ganache可能是一个更好的工具，它将更多的信息直接在前端呈现了出来。

The only extra step, aside from running Ganache, is that it requires editing the Truffle configuration file to point to the Ganache instance.

唯一的额外需要做的就是，除了运行Ganache，你还需要编辑truffle的配置文件，指出使用的Ganache实例。

1. Download and install Ganache. 下载安装Ganache。

2. Open truffle.js in a text editor. Replace the content with the following:

打开’truffle.js'文件。将下面的内容替换进去。、

```
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
```

This will allow a connection using Ganache's default connection parameters.

这允许使用Ganache的默认链接参数建立链接。

3. Save and close that file. 保存关闭文件。

4. Launch Ganache. 登录Ganache。

5. On the terminal, migrate the contract to the blockchain created by Ganache:

在终端，将合约部署到Ganache创建的区块链上。

```
truffle migrate
```

You will see the following output

你可以看到以下输出：

```
Using network 'development'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0x63b393bd50251ec5aa3e159070609ee7c61da55531ff5dea5b869e762263cb90
  Migrations: 0xd6d1ea53b3a7dae2424a0525d6b1754045a0df9f
Saving successful migration to network...
  ... 0xe463b4cb6a3bbba06ab36ac4d7ce04e2a220abd186c8d2bde092c3d5b2217ed6
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing ConvertLib...
  ... 0xa59221bc26a24f1a2ee7838c36abdf3231a2954b96d28dd7def7b98bbb8a7f35
  ConvertLib: 0x33b217190208f7b8d2b14d7a30ec3de7bd722ac6
  Replacing MetaCoin...
  ... 0x5d51f5dc05e5d926323d580559354ad39035f16db268b91b6db5c7baddef5de5
  MetaCoin: 0xcd2c65cc0b498cb7a3835cfb1e283ccd25862086
Saving successful migration to network...
  ... 0xeca6515f3fb47a477df99c3389d3452a48dfe507980bfd29a3c57837d6ef55c5
Saving artifacts...
```

This shows the transaction IDs and addresses of your deployed contracts.

上面输出指出了交易IDs和合约部署的地址。

```
Note: Your transaction IDs and contract addresses will be different from the above.

注意：你的交易IDs和合约地址和上面的不同。
```

6. In Ganache, click the "Transactions" button to see that the transactions have been processed.

在Ganache中，点击“Transactions”按钮，可以看到交易已经产生。

7. To interact with the contract, you can use the Truffle console. The Truffle console is similar to Truffle Develop, except it connects to an existing blockchain (in this case, the one generated by Ganache).

利用truffle的控制台，你可以与合约进行交互。truffle的控制台类似于truffle develop，除了它连接的是一个已经存在的区块链(本例中它是由Ganache产生)。

```
truffle console
```

You will see the following prompt:

你可以看到下面的控制符：

```
truffle(development)>
```

##INTERACTING WITH THE CONTRACT

Interact with the contract using the console in the following ways:

以下面的方式与合约进行交互：

```
Note: We're using 'web3.eth.accounts[]'' in these examples, which is an array of all the accounts generated by the mnemonic. So, given the addresses generated by our mnemonic above, specifying 'web3.eth.accounts[0]'' is equivalent to the address '0x627306090abab3a6e1400e9345bc60c78a8bef57'.

在这些例子中，我们使用’web3.eth.accounts[]‘，一个包含所有由助记符产生的账户组成的数组。因此在上述由助记符产生的账户中，指定’web3.eth.accounts[0]‘等同于’0x627306090abab3a6e1400e9345bc60c78a8bef57‘。
```

	*	Check the metacoin balance of the account that deployed the contract:

```
MetaCoin.deployed().then(function(instance){return instance.getBalance(web3.eth.accounts[0]);}).then(function(value){return value.toNumber()});
```

	*	See how much ether that balance is worth (and note that the contract defines a metacoin to be worth 2 ether): 查看余额价值多少ehter(合约定义一个metacoin价值2ether)。

```
MetaCoin.deployed().then(function(instance){return instance.getBalanceInEth(web3.eth.accounts[0]);}).then(function(value){return value.toNumber()});
```

	*	Transfer some metacoin from one account to another: 将一些metacoin从一个账户转移到另一个账户。

```
MetaCoin.deployed().then(function(instance){return instance.sendCoin(web3.eth.accounts[1], 500);});
```

	*	Check the balance of the account that received the metacoin: 查看接收metacoin账户的余额。

```
MetaCoin.deployed().then(function(instance){return instance.getBalance(web3.eth.accounts[1]);}).then(function(value){return value.toNumber()});
```

	*	Check the balance of the account that sent the metacoin: 查看发送metacoin账户的余额。

```
MetaCoin.deployed().then(function(instance){return instance.getBalance(web3.eth.accounts[0]);}).then(function(value){return value.toNumber()});
```

##CONTINUE LEARNING

This quickstart showed you the basics of the Truffle project lifecycle, but there is much more to learn. Please continue on with the rest of our documentation and especially our tutorials to learn more.

这篇快速入门指出了truffle项目基本的周期，但是还有很多东西需要学习。请继续下面的文档学习，尤其是我们的教程。















