"use strict";
const Web3 = require('web3');
const Dice2Win_JSON_Interface = require('./build/contracts/Dice2Win.json').abi;

let provider = 'http://localhost:8545';
if (process.env.WEB3_PROVIDER) provider = process.env.WEB3_PROVIDER;
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

const CONTRACT_ADDRESS = '0x7fb7ea53e43eede24a0665266b057fb256f6624a'

let Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,CONTRACT_ADDRESS);