"use strict";
const Web3 = require('web3');
let provider = 'http://localhost:8545';
if (process.env.WEB3_PROVIDER) provider = process.env.WEB3_PROVIDER;
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

const commit = 1;
const commitLastBlock = 20;

const hash = web3.utils.soliditySha3(20,1);

const address = '0x16d194Af0220b2673618b5ef207479e86AC0A485';
const secret = 'e53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1';

// web3.eth.sign(hash,address)
//     .then((result)=>{
//         console.log('result: ', result);
//     })

//0x
r = '0x74c5992b1a01acb8a89a6c7f33ea917a69c198fc65bf14a14c449de252ad4999' 
s = '0x2e50be00ec8e1c84d87a70e650f2ae118d0153b5a6adfe0c356dc93e228be0d6'
v = 01;
let v = 28;
let r = '';
let s = '';

// const result = web3.eth.accounts.sign(hash,secret);
// console.log('result: ', result);
// { message: '0x467a5c61216cad3003bc3395c339807c735d5c3d989ca4bc0ef2a37e14ce2679',
//   messageHash: '0xbbe656c9b981bd700aa3d8fe9c3bec3a06db2bcaf98c27efb6c23e1895abd8dd',
//   v: '0x1b',
//   r: '0x35766df0aa0d542132fb67974cadb7fce7cdc40b744e19c5801f397d0883da2f',
//   s: '0x139f7e2f1daa29a2dddba5c3b2ef1eadc0e5db37fe767abd0189141e86424443',
//   signature: '0x35766df0aa0d542132fb67974cadb7fce7cdc40b744e19c5801f397d0883da2f139f7e2f1daa29a2dddba5c3b2ef1eadc0e5db37fe767abd0189141e864244431b' 
// }