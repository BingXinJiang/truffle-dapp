"use strict";
const {
	getRandom
} = require('./util');

const Web3 = require('web3');
let provider = 'http://localhost:8545';
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

const ADDRESS_1 = {
    address:'0x16d194Af0220b2673618b5ef207479e86AC0A485',
    secret:'e53362cb0367d6334c8d2c9fe3c21586e655e7a84fc41b5a9d106d569d0560d1'
}

const ADDRESS_2 = {
    address:'0xfc450c33A6a96eF5cAaeC7D953071bCFF9ff7F6c',
    secret:'d118388b79b8b5598bb9a6ae9d8af6392dbea1ca89dd6da3fd23f29704016a47'
}

const ADDRESS_3 = {
    address:'0x015F20CA4f74F9D3aEF4392bBaFa57a0623eC4a9',
    secret:'c85999e17cb597dd1d744218f69a5d2f09f86aba9e50c7a35d75606f8928402e'
}

function transaction(){
    web3.eth.sendTransaction({
        from:ADDRESS_3.address,
        to:ADDRESS_2.address,
        value:Web3.utils.toWei('1','ether')
    })
}

transaction();