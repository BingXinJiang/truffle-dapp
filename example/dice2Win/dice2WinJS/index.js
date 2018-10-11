"use strict";
const Web3 = require('web3');
const util = require('ethereumjs-util');
const CONFIG = require('./config');
const Dice2Win_JSON_Interface = require('../build/contracts/Dice2Win.json').abi;

let provider = 'http://localhost:8545';
if (process.env.WEB3_PROVIDER) provider = process.env.WEB3_PROVIDER;
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(provider));

const Dice2Win = new web3.eth.Contract(Dice2Win_JSON_Interface,CONFIG.CONTRACT_ADDRESS);

/**
 * 切换合约的owner
 * 由现合约owner调用 approveNextOwner
 * 由下一个owner调用 acceptNextOwner
 * 
 * @param nextOwner string -> address
 */
const approveNextOwner = (nextOwner)=>{
    Dice2Win.methods.approveNextOwner(nextOwner);
}
const acceptNextOwner = ()=>{
    Dice2Win.methods.acceptNextOwner();
}

/**
 * 设置投注时使用的私钥所对应的address
 * 
 * @param signer string -> address
 */
const setSecretSigner = (signer)=>{
    Dice2Win.methods.setSecretSigner(signer);
}

/**
 * 设置投注获得的最大奖励
 * 
 * @param maxProfit number -> uint
 */
const setMaxProfit = (maxProfit)=>{
    Dice2Win.methods.setMaxProfit(maxProfit);
}

/**
 * 增加jackpot的资金
 * 
 * @param increaseAmount number -> uint
 */
const increaseJackpot = (increaseAmount)=>{
    Dice2Win.methods.increaseJackpot(increaseAmount);
}

/**
 * 资金的withdraw操作
 * 
 * @param beneficiary string -> addrss
 * @param withdrawAmount number -> uint
 */
const withdrawFunds = (beneficiary, withdrawAmount)=>{
    Dice2Win.methods.withdrawFunds(beneficiary, withdrawAmount);
}

/**
 * 销毁合约
 */
const kill = ()=>{
    Dice2Win.methods.kill();
}

/**
 * 投注函数
 * 
 * @param betMask number -> uint
 * @param modulo number -> uint
 * @param commitLastBlock number -> uint
 * @param commit number -> uint
 * @param r string -> bytes32
 * @param s string -> bytes32
 */
const placeBet = (betMask, modulo, commitLastBlock, commit)=>{

    const msg1 = new Buffer(commitLastBlock);
    const msg2 = new Buffer(commit);
    const msg = Buffer.concat([msg1, msg2]);
    const prefix = new Buffer("\x19Ethereum Signed Message:\n");
    const prefixedMsg = util.sha3(Buffer.concat([prefix, new Buffer(String(msg.length)), msg]));

    web3.eth.sign('0x' + msg.toString('hex'), CONFIG.USER_ADDRESS).then((sig)=>{
        const res = util.fromRpcSig(sig);
        const h = util.bufferToHex(prefixedMsg);
        const v = res.v;
        const r = util.bufferToHex(res.r);
        const s = util.bufferToHex(res.s);

        Dice2Win.methods.placeBet(betMask, modulo, commitLastBlock, commit, r, s)
            .send({from: CONFIG.USER_ADDRESS, value:100000000000000000})
            .on('transactionHash', function(hash){
                console.log('placeBet send transactionHash hash: ', hash);
            }).on('receipt', function(receipt){
                console.log('placeBet send receipt receipt: ', receipt)
            }).on('confirmation', function(confirmationNumber, receipt){
                console.log('placeBet send confirmation confirmationNumber: ', confirmationNumber)
                console.log('placeBet send confirmation receipt: ', receipt)
            }).on('error', console.error);
    })
}

/**
 * 设置交易
 * 
 * @param reveal number -> uint
 * @param blockHash string -> bytes32
 */
const settleBet = (reveal, blockHash)=>{
    Dice2Win.methods.settleBet(reveal, blockHash);
}

/**
 * 设置交易的默克尔树证明
 * 
 * @param reveal number -> uint
 * @param canonicalBlockNumber number -> uint40
 */
const settleBetUncleMerkleProof = (reveal, canonicalBlockNumber)=>{
    Dice2Win.methods.settleBetUncleMerkleProof(reveal, canonicalBlockNumber);
}

module.exports = {
    approveNextOwner,
    acceptNextOwner,
    setSecretSigner,
    setMaxProfit,
    increaseJackpot,
    withdrawFunds,
    kill,
    placeBet,
    settleBet,
    settleBetUncleMerkleProof,
    web3
}