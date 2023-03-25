const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] RootMe", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.RootMe = await (
      await ethers.getContractFactory("RootMe", deployer)
    ).deploy();
    await this.RootMe.deployed();
  });

  it("Exploit", async function () {
    RootMeAttacker = await (
      await ethers.getContractFactory("RootMeAttacker", attacker)
    ).deploy(await this.RootMe.address);
    await RootMeAttacker.deployed();
  });

  after(async function () {
    expect(await this.RootMe.victory()).to.be.eq(
      true,
      "You didn't change value of victory"
    );
  });
});
