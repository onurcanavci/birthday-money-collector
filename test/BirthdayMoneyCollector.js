const { expect } = require("chai");
const { network, web3 } = require("hardhat");
const { BN, balance, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const Birthday = artifacts.require("BirthdayMoneyCollector");

contract('BirthdayMoneyCollector', function ([owner, addr1, addr2, addr3, addr4]) {
  const name = 'fatih';
  const defaultAccountBalance = new BN("10000000000000000000000");//1000 ether in wei
  const participationAmount = new BN("1000000000000000000");//1 ether in wei

  describe("Deployment", function () {
    it("it should revert because of invalid birhdate", async function () {
      await expectRevert(Birthday.new(name, 0, participationAmount), 'The birthdayDate is invalid');
    });

    it("it should set fields ", async function () {
      let birhdate = new BN(createDate(1));

      //when
      this.birthday = await Birthday.new(name, birhdate, participationAmount, { from: owner });

      //then
      expect(await this.birthday.owner()).to.equal(owner);
      expect(await this.birthday.getName()).to.equal(name);
      expect(await this.birthday.getParticipationAmount()).to.be.bignumber.equal(participationAmount);
      expect(await this.birthday.getBirthdayDate()).to.be.bignumber.equal(birhdate);

    });
  });

  describe("Participation", function () {
    beforeEach(async function () {
      let birhdate = new BN(createDate(1));
      this.birthday = await Birthday.new(name, birhdate, participationAmount, { from: owner });
    });

    it("it should emit UserParticipated event ", async function () {
      //when
      const receipt = await this.birthday.participateBirthday({ from: addr1, value: participationAmount });

      //then
      expectEvent(receipt, 'UserParticipated', { user: addr1, participationAmount: participationAmount });
    });

    it("it should revert as Invalid participationAmount ", async function () {
      //when
      const result = this.birthday.participateBirthday({ from: addr1, value: new BN(10) });

      //then
      await expectRevert(result, 'Insufficient participation amount');
    });

    it("it should revert as You have already been participated ", async function () {
      await this.birthday.participateBirthday({ from: addr1, value: participationAmount });

      //when
      const result = this.birthday.participateBirthday({ from: addr1, value: participationAmount });

      //then
      await expectRevert(result, 'You have already been participated');
    });

    it("it should increase contract balance ", async function () {
      //given
      await this.birthday.participateBirthday({ from: addr1, value: participationAmount });
      await this.birthday.participateBirthday({ from: addr2, value: participationAmount });

      //then
      expect(await this.birthday.getContractBalance()).to.be.bignumber.equal(participationAmount.add(participationAmount));
    });

  });

  describe("Close", function () {

    beforeEach(async function () {
      let birhdate = new BN(createDate(1));
      this.birthday = await Birthday.new(name, birhdate, participationAmount, { from: owner });
    });

    it("it should revert as Ownable: caller is not the owner", async function () {
      //when
      const result = this.birthday.close(addr3, { from: addr3 });

      //then
      await expectRevert(result, 'Ownable: caller is not the owner');
    });

    it("it should revert as The birthday hasn't come yet", async function () {
      //when
      const result = this.birthday.close(addr4, { from: owner });

      //then
      await expectRevert(result, "The birthday hasn't come yet");
    });

    it("it should emit CollectedBirthdayMoneyTransfered", async function () {
      //given
      await this.birthday.participateBirthday({ from: addr1, value: participationAmount });
      await this.birthday.participateBirthday({ from: addr2, value: participationAmount });
      await this.birthday.participateBirthday({ from: addr3, value: participationAmount });

      await increaseBlockTime(5);
      const contractBalance = await this.birthday.getContractBalance()

      //when
      const receipt = await this.birthday.close(addr4, { from: owner });

      //then
      expectEvent(receipt, 'CollectedBirthdayMoneyTransfered', { to: addr4, tatolCollectedAmount: contractBalance });
      expect(await this.birthday.getContractBalance()).to.be.bignumber.equal(new BN(0));

      const balance = new BN(await web3.eth.getBalance(addr4))
      expect(balance).to.be.bignumber.equal(defaultAccountBalance.add(contractBalance));
    });

  });

  function createDate(dayCount) {
    const date = new Date();
    date.setDate(date.getDate() + dayCount);
    return date.getTime();
  }

  async function increaseBlockTime(dayCount) {
    await network.provider.send("evm_setNextBlockTimestamp", [createDate(dayCount)]);
    await network.provider.send("evm_mine");
  }
});