const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Valve", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.Valve = await (
      await ethers.getContractFactory("Valve", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    this.attackContract = await (
      await ethers.getContractFactory("ValveAttacker", attacker)
    ).deploy();

    let tx = await this.attackContract
      .connect(attacker)
      .attack(this.Valve.address);
    await tx.wait(1);
  });

  after(async function () {
    // Attacker must have opened the valve
    expect(await this.Valve.open()).to.be.eq(true, "Valve is not open!");
  });
});
