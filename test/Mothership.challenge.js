const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Mothership", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.Mothership = await (
      await ethers.getContractFactory("Mothership", deployer)
    ).deploy();
    await this.Mothership.deployed();
  });

  it("Exploit", async function () {
    this.MothershipAttacker = await (
      await ethers.getContractFactory("AttackerMothership", attacker)
    ).deploy(await this.Mothership.address);
    await this.MothershipAttacker.deployed();

    let tx = await this.MothershipAttacker.connect(attacker).attack();
    await tx.wait();
  });

  after(async function () {
    expect(await this.Mothership.hacked()).to.be.eq(
      true,
      "Mothership is not hacked!"
    );
  });
});
