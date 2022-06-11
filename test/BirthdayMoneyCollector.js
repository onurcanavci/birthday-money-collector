const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

describe("Birthday Money Collector contract", function () {
  let contractFactory;
  let birthdayContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  let mockBitrhdayChildName;
  let mockGiftAmount;

  beforeEach(async function () {
    mockBitrhdayChildName = "Onur";
    mockGiftAmount = ethers.utils.parseEther("100000");
    // Get the ContractFactory and Signers here.
    contractFactory = await ethers.getContractFactory("BirthdayGiftCollector");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Contract.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    birthdayContract = await contractFactory.deploy(
      mockBitrhdayChildName,
      mockGiftAmount
    );
  });

  describe("Deployment", function () {
    it("Should return the right birthday child name", async function () {
      expect(await birthdayContract.getBirthdayChildName()).to.equal(
        mockBitrhdayChildName
      );
    });

    it("Should return the right birthday money amount", async function () {
      expect(await birthdayContract.getGiftAmount()).to.equal(mockGiftAmount);
    });

    it("Should default return 0 in getContractBalance", async function () {
      mockDefaultContractBalance = ethers.utils.parseEther("0");
      expect(await birthdayContract.getContractBalance()).to.equal(
        mockDefaultContractBalance
      );
    });

    it("Should default return empty list in getParticipantList", async function () {
      expect(await birthdayContract.getParticipantList()).to.length(0);
    });

    // it("Should close the contract with set flag", async function () {
    //   await birthdayContract.setContractFlag();
    //   const result = await birthdayContract.getBirthdayChildName();
    //   console.log("result : ", result);
    //   // await expectRevert(result.reason, "Contract is not active");
    // });

    // it("Should deposit gift money to contract", async function () {
    //   const mockAddress = addr1;
    //   const mockAmount = mockGiftAmount;

    //   const receipt = await birthdayContract.giftMoneyDeposit({
    //     from: mockAddress,
    //     value: mockAmount,
    //   });

    //   expectEvent(receipt, "GiftMoneyDeposit", {
    //     who: mockAddress,
    //     amount: mockAmount,
    //   });
    // });

    it("should activate or deactivate contract by owner", async function () {
      const deactivateResult = await birthdayContract.setContractFlag({
        from: owner,
      });

      expect(deactivateResult).to.equal(false);

      const activateResult = await birthdayContract.setContractFlag({
        from: owner,
      });

      expect(activateResult).to.equal(true);
    });

    it("should not activate or deactivate contract by user if it is not owner of contract", async function () {
      const result = await birthdayContract.setContractFlag({ from: addr1 });

      await expectRevert(result, "Ownable: caller is not the owner");
    });

    // it("should finish contract by owner", async function () {
    //   const result = await birthdayContract.finishContract({ from: addr1 });

    //   expect(result).to.equal("contract is finished");
    // });
  });
});
