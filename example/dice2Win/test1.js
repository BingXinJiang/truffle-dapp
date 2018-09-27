"use strict";
const {
	getRandom
} = require('./util');

const async = require("async");
const Web3 = require('web3');
// const Dice2Win_JSON_Interface = require('./build/contracts/Dice2Win.json').abi;

let provider = 'http://localhost:8545';
if (process.env.WEB3_PROVIDER) provider = process.env.WEB3_PROVIDER;
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

// const CONTRACT_ADDRESS = '0x8c11a16f3d7ecf8b283d5a12f0359cc1ce7f6dd7'
// let Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,CONTRACT_ADDRESS);

/**对message取hash */
// const commit = '1';
// const commitHash = web3.utils.sha3(commit);
// console.log('commitHash: ', commitHash);
// commitHash:0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6

/**commitLastBlock的处理 */
// const commitLastBlock = 20;
// const commitLastBlockPadLeft = web3.utils.padLeft(20,10);
// console.log('commitLastBlockPadLeft: ', commitLastBlockPadLeft);
// commitLastBlockPadLeft: 0x0000000014

/**对commit，和commitLastBlock参数做压缩处理 */
// const packed = web3.eth.abi.encodeParameters(['uint40','uint256'],[20,'0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6']);
// console.log('packed: ', packed);
// packed:0x0000000000000000000000000000000000000000000000000000000000000014c89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6

/**对压缩的数据取hash */
// const ha = web3.utils.sha3('0x0000000000000000000000000000000000000000000000000000000000000014c89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6');
// console.log('ha: ', ha);
// const ha2 = web3.utils.soliditySha3('0x0000000014','0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6');
// console.log('ha2: ', ha2);
// ha: 0x39be072bbf2ff40a969614e26ce931afeea6b62f4b8a24ee8ce5a82d9fcbcc3d
// ha2: 0x359a8c5930178c8c4e96caf6dac66574002e16f05a601d8a5942d66be0ed36fb

/**获取签名 */
// const sign = web3.eth.accounts.sign('0x39be072bbf2ff40a969614e26ce931afeea6b62f4b8a24ee8ce5a82d9fcbcc3d','0xe53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1');
// console.log('sign: ', sign);
// { 
// 	message: '0x39be072bbf2ff40a969614e26ce931afeea6b62f4b8a24ee8ce5a82d9fcbcc3d',
//   	messageHash: '0x1ed95773d38add5fa6f5779c29847061f4fd4d6a0ecf7bf3294eb63734242243',
//   	v: '0x1b',
//   	r: '0x1e33eed1d5ffc4e9beb25c91fa1113890833d5650f06c08950888e0828073224',
//   	s: '0x37e34f317d018eb8f08e2c2630935b9bffde56872859c5c92c30596a9364d83f',
//   	signature: '0x1e33eed1d5ffc4e9beb25c91fa1113890833d5650f06c08950888e082807322437e34f317d018eb8f08e2c2630935b9bffde56872859c5c92c30596a9364d83f1b' 
// }
//     0x359A8C5930178C8C4E96CAF6DAC66574002E16F05A601D8A5942D66BE0ED36FB
// 0x359A8C5930178C8C4E96CAF6DAC66574002E16F05A601D8A5942D66BE0ED36FB

// const recover = web3.eth.accounts.recover({
// 	messageHash:'0x1ed95773d38add5fa6f5779c29847061f4fd4d6a0ecf7bf3294eb63734242243',
// 	v:'0x1b',
// 	r:'0x1e33eed1d5ffc4e9beb25c91fa1113890833d5650f06c08950888e0828073224',
// 	s:'0x37e34f317d018eb8f08e2c2630935b9bffde56872859c5c92c30596a9364d83f'
// })
// console.log('recover: ', recover);
// 0x16d194Af0220b2673618b5ef207479e86AC0A485

/**设置secretSigner */
// Dice2Win.methods.setSecretSigner('0x16d194Af0220b2673618b5ef207479e86AC0A485');

/**设置maxProfit */
// Dice2Win.methods.setMaxProfit(Web3.utils.toWei('5', 'ether'));
// console.log('wei: ', Web3.utils.toWei('2','ether'));
//   2000000000000000000

/**设置Jackpot */
// Dice2Win.methods.increaseJackpot(Web3.utils.toWei('3', 'ether'));

//对commit去hash
// const commit = web3.eth.accounts.hashMessage(web3.utils.utf8ToHex("1"));
// console.log('commit: ', commit);

// commit:'0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee'
// commitLastBlock:12
// const param = web3.eth.abi.encodeParameters(
// 	['uint40','uint256'],[12,'1']
// )
// console.log('param: ', param);

// param:'0x000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001'
// const rs = web3.eth.accounts.sign('0x000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001', 'e53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1');
// console.log('rs: ', rs);
// let a = { "message": '0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee0000000000000000000000000000000000000000000000000000000000000006',
//   "messageHash": '0xad2775c6e7710f1f862b25191ecf802cb268643f8f89e9dbe3a5b5c4c499abf3',
//   "v": '0x1c',
//   "r": '0xb66321c9b0a920bf5cbed28d6e59c6c6ff8f4e4c2af29610691e951937c2cac6',
//   "s": '0x253c70a277e186c95c69307b40f4a7cffb4f6eb87581ffe4c6a860bb540d3399',
//   "signature": '0x4548f41634eba3b680871ccb7417d0cde3c9410edb999902cb8492cd09a0e0a61d19f46253bb5c868d34cbb616a7f6ce90f137e0f23481ca8861b6aebdda4ab91b' 
// }
// let bet = {
// 	betMask:1,
// 	modulo:2,
// 	commitLastBlock:5,
// 	commit:'0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee',
// 	r:'0x080448ce665ff4b1ebc7721994ed27afc9faede55da68f18a9be9e7103e53a8e',
// 	s:'0x72e6be3c5f4ee1cdd0db3dd209e3a5897010a275eaa24b25c4d10749394c895a'
// }
// Dice2Win.methods.placeBet(bet.betMask,bet.modulo,bet.commitLastBlock,bet.commit,bet.r,bet.s);

// const commit = '0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6';
// const commitLastBlock = 20;
// const packed = web3.eth.abi.encodeParameters(['uint40','uint256'],[commitLastBlock,commit]);
// const hash = web3.utils.sha3(packed);
// const sign = web3.eth.accounts.sign(hash,'0xe53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1');
// sign = { 
// 	message: '0x39be072bbf2ff40a969614e26ce931afeea6b62f4b8a24ee8ce5a82d9fcbcc3d',
//   	messageHash: '0x1ed95773d38add5fa6f5779c29847061f4fd4d6a0ecf7bf3294eb63734242243',
//   	v: '0x1b',
//   	r: '0x1e33eed1d5ffc4e9beb25c91fa1113890833d5650f06c08950888e0828073224',
//   	s: '0x37e34f317d018eb8f08e2c2630935b9bffde56872859c5c92c30596a9364d83f',
//   	signature: '0x1e33eed1d5ffc4e9beb25c91fa1113890833d5650f06c08950888e082807322437e34f317d018eb8f08e2c2630935b9bffde56872859c5c92c30596a9364d83f1b' 
// }
//上面的数据使用web3.js在node环境中计算的，下面两句是智能合约里面的代码，签名验证不通过啊，
//通过web3的recover函数是可以得到地址的，也是在智能合约中设置的地址，即下面的secretSigner
//bytes32 signatureHash = keccak256(abi.encodePacked(uint40(commitLastBlock), commit));
//require (secretSigner == ecrecover(signatureHash, 27, r, s), "ECDSA signature is not valid.");
