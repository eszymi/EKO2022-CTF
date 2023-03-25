const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("[Challenge] GoldenTicket", function () {
  let deployer, attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    this.GoldenTicket = await (
      await ethers.getContractFactory("GoldenTicket", deployer)
    ).deploy();
    await this.GoldenTicket.deployed();
  });

  it("Exploit", async function () {
    this.GoldenTicketAttacker = await (
      await ethers.getContractFactory("GoldenTicketAttacker", attacker)
    ).deploy(await this.GoldenTicket.address);
    await this.GoldenTicketAttacker.deployed();

    let tx = await this.GoldenTicketAttacker.connect(attacker).attack();
    await tx.wait()
  });

  after(async function () {
    expect(
      await this.GoldenTicket.hasTicket(attacker.address)
    ).to.be.eq(true, "You don't have the ticket!");
    
  });
});
