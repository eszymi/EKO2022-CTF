const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] MetaverseSupermarket", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.Supermarket = await (
      await ethers.getContractFactory("InflaStore", deployer)
    ).deploy(attacker.address);
    await this.Supermarket.deployed();
  });

  it("Exploit", async function () {
    this.SupermarketAttacker = await (
      await ethers.getContractFactory("MetaverseSupermarketAttacker", attacker)
    ).deploy(await this.Supermarket.address);
    await this.SupermarketAttacker.deployed();

    let tx = await this.SupermarketAttacker.connect(attacker).attack();
    await tx.wait();
  });

  after(async function () {
    let mealAddress = await this.Supermarket.meal();
    let meal = (await ethers.getContractFactory("Meal")).attach(mealAddress);
    expect(await meal.balanceOf(attacker.address)).to.be.greaterThanOrEqual(10);
  });
});
