"use strict";
const {
	getRandom
} = require('./util');

const async = require("async");
const Web3 = require('web3');
const Dice2Win_JSON_Interface = require('./build/contracts/Dice2Win.json').abi;

let provider = 'http://localhost:8545';
if (process.env.WEB3_PROVIDER) provider = process.env.WEB3_PROVIDER;
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

/**获取当前的合约实例
	合约地址：0x8e37d32f08cb4c43c0617dd468b1c18bfd3b5e41
*/
// console.log(Dice2Win_JSON_Interface);
let Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,'0x8e37d32f08cb4c43c0617dd468b1c18bfd3b5e41');

// console.log('Dice2Win:',Dice2Win);

/**调用 setSecretSigner 
	param：newSecretSigner  新加密注册者的地址
	exampleParam：0x16d194Af0220b2673618b5ef207479e86AC0A485
*/
// Dice2Win.methods.setSecretSigner('0x16d194Af0220b2673618b5ef207479e86AC0A485').call({
// 	from:'0x16d194Af0220b2673618b5ef207479e86AC0A485'
// }).then(function(result){
// 	console.log('result:',result);
// })

/**查看智能合约的状态state*/
/**获取加密参数 r s 
	使用秘钥：e53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1
	参数对应的address：0x16d194Af0220b2673618b5ef207479e86AC0A485

	结果：{ message: '1',
  		   messageHash: '0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee',
           v: '0x1b',
           r: '0xb09ca1e95dbd264e5d56471bd6bb2921014ec453f60a0b9a745e4fc26bca374e',
           s: '0x74d7d05d1c776e05a14a5bfae77a98229da382796eb0b4ec4d330b0beaad9158',
           signature: '0xb09ca1e95dbd264e5d56471bd6bb2921014ec453f60a0b9a745e4fc26bca374e74d7d05d1c776e05a14a5bfae77a98229da382796eb0b4ec4d330b0beaad91581b' 
         }

    使用秘钥：d118388b79b8b5598bb9a6ae9d8af6392dbea1ca89dd6da3fd23f29704016a47
	参数对应的address：0xfc450c33A6a96eF5cAaeC7D953071bCFF9ff7F6c

	结果：{ message: '1',
  		   messageHash: '0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee',
           v: '0x1c',
           r: '0x5f190f12b48a98b789c595447846e381390c1f7d31cb4401d49d6c7d9dce5268',
           s: '0x76baabd81bc3821655dbed7d6b426f7c8f4ca47d0914e498454b9c9535e6bef5',
           signature: '0x5f190f12b48a98b789c595447846e381390c1f7d31cb4401d49d6c7d9dce526876baabd81bc3821655dbed7d6b426f7c8f4ca47d0914e498454b9c9535e6bef51c' 
         }

    使用秘钥：'c85999e17cb597dd1d744218f69a5d2f09f86aba9e50c7a35d75606f8928402e'
	参数对应的address：'0x015F20CA4f74F9D3aEF4392bBaFa57a0623eC4a9'

	结果：{ message: '1',
  		   messageHash: '0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee',
           v: '0x1c',
           r: '0xff25c3b5e3ca3215f9a14a6f6ca71d2f715afc3412a980c061acf3a694896c71',
           s: '0x14b69ebe58017f7cdd4dd17c372c5db6bd941a3f7f42aa3052ec7f3266706391',
           signature: '0xff25c3b5e3ca3215f9a14a6f6ca71d2f715afc3412a980c061acf3a694896c7114b69ebe58017f7cdd4dd17c372c5db6bd941a3f7f42aa3052ec7f32667063911c' 
         }
*/
// let getSecretParams = web3.eth.accounts.sign('1','c85999e17cb597dd1d744218f69a5d2f09f86aba9e50c7a35d75606f8928402e');
// console.log('getSecretParams:',getSecretParams);

/**下注 调用合约的 placeBet 函数
	params：{
		uint betMask, //  1
		uint modulo, //  2
		uint commitLastBlock, //  3
		uint commit, //  1
		bytes32 r, // 0xb09ca1e95dbd264e5d56471bd6bb2921014ec453f60a0b9a745e4fc26bca374e
		bytes32 s  // 0x74d7d05d1c776e05a14a5bfae77a98229da382796eb0b4ec4d330b0beaad9158
	}
	params：{
		uint betMask, //  1
		uint modulo, //  2
		uint commitLastBlock, //  3
		uint commit, //  1
		bytes32 r, // 0x5f190f12b48a98b789c595447846e381390c1f7d31cb4401d49d6c7d9dce5268
		bytes32 s  // 0x76baabd81bc3821655dbed7d6b426f7c8f4ca47d0914e498454b9c9535e6bef5
	}
	params：{
		uint betMask, //  1
		uint modulo, //  2
		uint commitLastBlock, //  3
		uint commit, //  1
		bytes32 r, // 0xff25c3b5e3ca3215f9a14a6f6ca71d2f715afc3412a980c061acf3a694896c71
		bytes32 s  // 0x14b69ebe58017f7cdd4dd17c372c5db6bd941a3f7f42aa3052ec7f3266706391
	}
*/
let placeBetResult = Dice2Win.methods.placeBet(1,2,3,1,'0xff25c3b5e3ca3215f9a14a6f6ca71d2f715afc3412a980c061acf3a694896c71','0x14b69ebe58017f7cdd4dd17c372c5db6bd941a3f7f42aa3052ec7f3266706391').send({
		from:'0x015F20CA4f74F9D3aEF4392bBaFa57a0623eC4a9',
		gasPrice:'100000000000',
		gas:'10000000000000',
		value:'1000000000000000000'
},function(err,result){
	console.log('err:',err);
	console.log('result:',result);
});


