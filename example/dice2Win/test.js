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

const CONTRACT_ADDRESS = '0x8e37d32f08cb4c43c0617dd468b1c18bfd3b5e41'

let Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,CONTRACT_ADDRESS);

/**调用 setSecretSigner 
	param：newSecretSigner  新加密注册者的地址
	exampleParam：0x16d194Af0220b2673618b5ef207479e86AC0A485
*/
let newSecretSigner_1 = '0x16d194Af0220b2673618b5ef207479e86AC0A485'

const setSecretSigner = function(newSecretSigner,callback){
	Dice2Win.methods.setSecretSigner(newSecretSigner).call({
		from:newSecretSigner
	}).then(function(result){
		callback()
	})
}

/**查看智能合约的状态state*/

let ADDRESS = {}

let ADDRESS_1 = {
	address:'0x16d194Af0220b2673618b5ef207479e86AC0A485',
	secret:'0xe53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1',
	betMask:1,
	modulo:2,
	commitLastBlock:26,
	commit:1,
	value:'100000000000000000'
}
let ADDRESS_2 = {
	address:'0xfc450c33A6a96eF5cAaeC7D953071bCFF9ff7F6c',
	secret:'0xd118388b79b8b5598bb9a6ae9d8af6392dbea1ca89dd6da3fd23f29704016a47',
	betMask:1,
	modulo:2,
	commitLastBlock:26,
	commit:1,
	value:'100000000000000000'
}
let ADDRESS_3 = {
	address:'0x015F20CA4f74F9D3aEF4392bBaFa57a0623eC4a9',
	secret:'0xc85999e17cb597dd1d744218f69a5d2f09f86aba9e50c7a35d75606f8928402e',
	betMask:1,
	modulo:2,
	commitLastBlock:26,
	commit:1,
	value:'100000000000000000'
}
let ADDRESS_4 = {
	address:'0x91948957E37faA1630Dd3f4611B0A89322D40ad2',
	secret:'0x75738dd24256a5f58e2aedd619c5cad790fb231f90f4d3757172c7bad122b395',
	betMask:1,
	modulo:2,
	commitLastBlock:26,
	commit:1,
	value:'100000000000000000'
}
/** 获取 r，s 参数 */
const getSecretParams = function(address){
	const result = web3.eth.accounts.sign(address.commit.toString(),address.secret);
	ADDRESS = {
		...address,
		...result
	}
}

/**下注 调用合约的 placeBet 函数 */
const placeBet = function(){
	Dice2Win.methods.placeBet(ADDRESS.betMask,ADDRESS.modulo,ADDRESS.commitLastBlock,ADDRESS.commit,ADDRESS.r,ADDRESS.s)
	.send({
		from:ADDRESS.address,
		value:Web3.utils.toWei("1","ether")
	}).on('transactionHash', function(hash){
		console.log('transactionHash-hash:',hash)
	}).on('confirmation', function(confirmationNumber, receipt){
		console.log('confirmation-confirmationNumber:',confirmationNumber)
		console.log('confirmation-receipt:',receipt)
	}).on('receipt', function(receipt){
    	console.log('receipt-receipt:',receipt)
	}).on('error', function(err){
		console.log('error-err:',err)
	})
}

setSecretSigner(newSecretSigner_1, function(){
	getSecretParams(ADDRESS_1)
	placeBet()
})




