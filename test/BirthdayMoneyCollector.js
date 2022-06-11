const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const Birthday = artifacts.require("BirthdayMoneyCollector");


contract('BirthdayMoneyCollector', function ([owner, addr1, addr2, addr3]) {

  const name = 'fatih';
  const participationAmount = new BN(100000);


  describe("Deployment", function () {
    it("it should revert because of invalid birhdate", async function () {
      await expectRevert(Birthday.new(name, 0, participationAmount), 'The birthdayDate is invalid');

    });


    it("it should set fields ", async function () {
      let birhdate = new BN(getDate(1));

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
      let birhdate = new BN(getDate(1));
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

  });


  function getDate(day) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    return date.getTime();
  }
});
