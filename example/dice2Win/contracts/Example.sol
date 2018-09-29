pragma solidity ^0.4.24;

contract Example {
    function testRecovery(bytes32 h, uint8 v, bytes32 r, bytes32 s) pure external returns (address) {
       /* prefix might be needed for geth only
        * https://github.com/ethereum/go-ethereum/issues/3731
        */
        // bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        // h = sha3(prefix, h);
        address addr = ecrecover(h, v, r, s);
        require(addr == 0x16d194Af0220b2673618b5ef207479e86AC0A485, "哈哈哈哈哈");
        require(addr == 0x91948957E37faA1630Dd3f4611B0A89322D40ad2, "dfhdgdfhgfdgfhg");
        return addr;
    }
}