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
const rs = web3.eth.accounts.sign('0x000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001', 'e53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1');
console.log('rs: ', rs);
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