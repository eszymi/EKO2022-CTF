const { ethers } = require("hardhat");
const { expect } = require("chai");
const { mine } = require("@nomicfoundation/hardhat-network-helpers"); //Localhost start with block.number == 0, therefor I get error when I try block.number - 69

describe("[Challenge] HiddenKittyCat", function () {
  let deployer, attacker;

  // Using to set block.number to random value
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.House = await (
      await ethers.getContractFactory("House", deployer)
    ).deploy();
    await this.House.deployed();

    await mine(getRandomInt(69,100000)); // set block.number > 68
  });

  it("Exploit", async function () {
    this.HiddenKittyCatAttacker = await (
      await ethers.getContractFactory("HiddenKittyCatAttacker", attacker)
    ).deploy();
    await this.HiddenKittyCatAttacker.deployed();

    let tx = await this.HiddenKittyCatAttacker.connect(attacker).attack(
      this.House.address
    );
    await tx.wait();
  });

  after(async function () {
    expect(await this.House.catFound()).to.be.eq(
      true,
      "You haven't found the cat!"
    );
  });
});
