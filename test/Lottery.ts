import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lottery", function () {
  let Lottery;
  let lottery: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs;
  let lotteryPrice = ethers.parseEther("0.01"); // The price for one ticket in the lottery

  // Deploy the contract before each test
  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.connect(owner).deploy(lotteryPrice);
  });

  // Test the deployment and initial settings of the contract
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await lottery.owner()).to.equal(owner.address);
    });

    it("Should set the lottery price", async function () {
      expect(await lottery.lotteryPrice()).to.equal(lotteryPrice);
    });
  });

  // Test the enter function
  describe("Enter lottery", function () {
    it("Should allow a user to enter", async function () {
      await lottery.connect(addr1).enter({ value: lotteryPrice });
      expect(await lottery.getPlayers()).to.include(addr1.address);
    });

    it("Should fail if the wrong amount of ether is sent", async function () {
      await expect(lottery.connect(addr1).enter({ value: (lotteryPrice - 1n) })).to.be.revertedWith(
        "Must send the exact lottery price to enter."
      );
    });

    it("Should emit an event when a new player enters", async function () {
      await expect(lottery.connect(addr1).enter({ value: lotteryPrice }))
        .to.emit(lottery, "LotteryEnter")
        .withArgs(addr1.address);
    });
  });

  // Test the pickWinner function
  describe("Pick winner", function () {
    beforeEach(async function () {
      // Enter two players into the lottery
      await lottery.connect(addr1).enter({ value: lotteryPrice });
      await lottery.connect(addr2).enter({ value: lotteryPrice });
    });

    it("Should only be callable by owner", async function () {
      await expect(lottery.connect(addr1).pickWinner()).to.be.revertedWith(
        "Only the owner can call this function."
      );
    });

    it("Should pick a winner, reset the lottery, and transfer balance", async function () {
      await lottery.connect(owner).pickWinner();
      const finalBalance = await ethers.provider.getBalance(lottery);

      expect(finalBalance).to.equal(0);
      expect(await lottery.getPlayers()).to.deep.equal([]);
    });
  });

  // Test the emergencyWithdraw function
  describe("Emergency withdraw", function () {
    it("Should only be callable by owner", async function () {
      await expect(lottery.connect(addr1).emergencyWithdraw()).to.be.revertedWith(
        "Only the owner can call this function."
      );
    });
  });

  // Additional tests can be written to cover all scenarios...
});
