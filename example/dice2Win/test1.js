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

const CONTRACT_ADDRESS = '0x7fb7ea53e43eede24a0665266b057fb256f6624a'

let Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,CONTRACT_ADDRESS);

/**设置secretSigner */
// Dice2Win.methods.setSecretSigner('9a7200a458446fe056047063e6157118749bb85b22c6b12dbad6894b135335e3');

/**设置maxProfit */
// Dice2Win.methods.setMaxProfit(Web3.utils.toWei('5', 'ether'));

/**设置Jackpot */
// Dice2Win.methods.increaseJackpot(Web3.utils.toWei('3', 'ether'));

/**投注 */
let ADDRESS_1 = {
	address:'0x72F188C9F962C41102FBfA60b218Af30fdc8690A',
	secret:'0x9a7200a458446fe056047063e6157118749bb85b22c6b12dbad6894b135335e3',
	betMask:1,
	modulo:2,
	commitLastBlock:3,
	commit:1,
	value:'100000000000000000'
}
// Dice2Win.methods.placeBet(1,2,3,commit,r,s);
