const {
	getRandom
} = require('./util');
const crypto = require("crypto");
const BigNumber = require('bignumber.js');

let r = getRandom(32).toString('hex');
let s = getRandom(32).toString('hex');

console.log('r:',r);
//b1b90a95f6bdae5a813cbca660f97b70fcc1acb7ae71b9d321fd850fc2e27b6c
console.log('s:',s);
//b83a95698685101a5274f848bd5083144c67259b628b0750254da24c090ba53b

// console.log('random_1:',random_1); 
// reveal -- 784fa2f188


// const DICE_SECRET = '784fa2f188';
// const commit_hash_1 = crypto.createHmac('keccak256', DICE_SECRET)
//                    .update('I love cupcakes')
//                    .digest('hex');

