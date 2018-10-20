"use strict";
const Web3 = require('web3');
// const util = require('ethereumjs-util');
let provider = 'http://localhost:8545';
if (process.env.WEB3_PROVIDER) provider = process.env.WEB3_PROVIDER;
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

// const Example_JSON_Interface = require('./build/contracts/Example.json').abi;

const address = '0x16d194Af0220b2673618b5ef207479e86AC0A485';
const secret = 'e53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1';

const CONTRACT_ADDRESS = '0xb0f1be372829e4959dbb269b0cf6653b23116ebf';

const str = '0x' + "hello".toString('hex');
