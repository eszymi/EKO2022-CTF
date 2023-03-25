const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Pelusa", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.Pelusa = await (
      await ethers.getContractFactory("Pelusa", deployer)
    ).deploy();
    await this.Pelusa.deployed();
  });

  it("Exploit", async function () {
    this.DeployPelusaAttacker = await (
      await ethers.getContractFactory("DeployPelusaAttacker", attacker)
    ).deploy(await this.Pelusa.address, deployer.address);
    await this.DeployPelusaAttacker.deployed();

    let PelusaAttacker = (
      await ethers.getContractFactory("PelusaAttacker")
    ).attach(await this.DeployPelusaAttacker.pelusaAttacker());

    let tx = await PelusaAttacker.connect(attacker).attack(
      await this.Pelusa.address
    );
    await tx.wait();
  });

  after(async function () {
    expect(await this.Pelusa.goals()).to.be.eq(2, "Not 2 goals!!");
  });
});
