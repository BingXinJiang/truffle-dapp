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

const CONTRACT_ADDRESS = '0x8c11a16f3d7ecf8b283d5a12f0359cc1ce7f6dd7'

let Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,CONTRACT_ADDRESS);

/**设置secretSigner */
// Dice2Win.methods.setSecretSigner('0x16d194Af0220b2673618b5ef207479e86AC0A485');

/**设置maxProfit */
// Dice2Win.methods.setMaxProfit(Web3.utils.toWei('5', 'ether'));
// console.log('wei: ', Web3.utils.toWei('2','ether'));

/**设置Jackpot */
// Dice2Win.methods.increaseJackpot(Web3.utils.toWei('3', 'ether'));

//对commit去hash
// const commit = web3.eth.accounts.hashMessage(web3.utils.utf8ToHex("1"));
// console.log('commit: ', commit);

// commit:'0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee'
// commitLastBlock:2
// const param = web3.eth.abi.encodeParameters(
// 	['bytes32','uint256'],['0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee',2]
// )
// console.log('param: ', param);

// param:'0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee0000000000000000000000000000000000000000000000000000000000000002'
// const rs = web3.eth.accounts.sign('0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee0000000000000000000000000000000000000000000000000000000000000002', '0xd118388b79b8b5598bb9a6ae9d8af6392dbea1ca89dd6da3fd23f29704016a47');
// console.log('rs: ', rs);
// let a = { "message": '0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee0000000000000000000000000000000000000000000000000000000000000002',
//   "messageHash": '0xcf9b1cc381d8e7091512a405f21dba3839d973bbc1a0dd2b4a13201576afc685',
//   "v": '0x1c',
//   "r": '0x080448ce665ff4b1ebc7721994ed27afc9faede55da68f18a9be9e7103e53a8e',
//   "s": '0x72e6be3c5f4ee1cdd0db3dd209e3a5897010a275eaa24b25c4d10749394c895a',
//   "signature": '0x080448ce665ff4b1ebc7721994ed27afc9faede55da68f18a9be9e7103e53a8e72e6be3c5f4ee1cdd0db3dd209e3a5897010a275eaa24b25c4d10749394c895a1c' 
// }
// let bet = {
// 	betMask:1,
// 	modulo:2,
// 	commitLastBlock:2,
// 	commit:'0xd65fc3b188dd92cfcb2a193a50840c1b782030fb06c5eee3125dadc48b9042ee',
// 	r:'0x080448ce665ff4b1ebc7721994ed27afc9faede55da68f18a9be9e7103e53a8e',
// 	s:'0x72e6be3c5f4ee1cdd0db3dd209e3a5897010a275eaa24b25c4d10749394c895a'
// }
// Dice2Win.methods.placeBet(bet.betMask,bet.modulo,bet.commitLastBlock,bet.commit,bet.r,bet.s);