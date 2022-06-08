const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Birthday Money Collector contract", function () {
  let contractFactory;
  let birthdayContract;

  let mockBitrhdayChildName;
  let mockGiftAmount;

  beforeEach(async function () {
    mockBitrhdayChildName = "Onur";
    mockGiftAmount = ethers.utils.parseEther("100000");
    // Get the ContractFactory and Signers here.
    contractFactory = await ethers.getContractFactory("BirthdayGiftCollector");

    // To deploy our contract, we just have to call Contract.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    birthdayContract = await contractFactory.deploy(
      mockBitrhdayChildName,
      mockGiftAmount
    );
  });

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
});
