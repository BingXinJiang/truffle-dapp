"use strict";
const Web3 = require('web3');
const CONFIG = require('./config');
const Dice2Win_JSON_Interface = require('./build/contracts/Dice2Win.json').abi;

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
 * @param commit numner -> uint
 * @param r string -> bytes32
 * @param s string -> bytes32
 */
const placeBet = (betMask, modulo, commitLastBlock, commit, r, s)=>{
    Dice2Win.methods.placeBet(betMask, modulo, commitLastBlock, commit, r, s)
        .send({from: CONFIG.USER_ADDRESS})
        .on('transactionHash', function(hash){
            console.log('placeBet send transactionHash hash: ', hash);
        }).on('receipt', function(receipt){
            console.log('placeBet send receipt receipt: ', receipt)
        }).on('confirmation', function(confirmationNumber, receipt){
            console.log('placeBet send confirmation confirmationNumber: ', confirmationNumber)
            console.log('placeBet send confirmation receipt: ', receipt)
        }).on('error', console.error);
}