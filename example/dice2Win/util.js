"use strict";

const BigNumber = require('bignumber.js');
const ethUtil = require("ethereumjs-util");
const crypto = require("crypto");

function getRandom(bytes) {
    if (typeof window === 'undefined') { // node
        return crypto.randomBytes(bytes);
    } else { // browser
        let buf = new Buffer(bytes);
        return window.crypto.getRandomValues(buf);
    }
}

module.exports = {
    getRandom
};
