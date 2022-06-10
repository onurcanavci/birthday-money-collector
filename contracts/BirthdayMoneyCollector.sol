//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BirthdayGiftCollector is Ownable{
    string private birthdayChildName;
    bool private isContractAvailable;
    uint256 giftAmount;
    address[] moneySenderAddresses;
    mapping(address => uint256) private participants;


    constructor(string memory _birthdayChildName, uint256 _giftAmount) {
        birthdayChildName = _birthdayChildName;
        giftAmount = _giftAmount;
        isContractAvailable = true;
    }

    modifier isContractActive() {
        require(isContractAvailable, "Contract is not active");
        _;
    }

     function setContractFlag() public onlyOwner returns (bool) {
        isContractAvailable = !isContractAvailable;
        return isContractAvailable;
    }

    function getBirthdayChildName() public view isContractActive returns (string memory) {
        return birthdayChildName;
    }

    function getGiftAmount() public view isContractActive returns (uint256) {
        return giftAmount;
    }

    function getContractBalance() public view isContractActive returns (uint256) {
        return address(this).balance;
    }

    function getParticipantList() public view isContractActive returns (address[] memory) {
        return moneySenderAddresses;
    }

    function giftMoneyDeposit() public payable {
        require(msg.value == giftAmount, "Insufficient money");
        require(participants[msg.sender] == 0, "You send money before");
        
        participants[msg.sender] = msg.value;
        moneySenderAddresses.push(msg.sender);
        emit GiftMoneyDeposit(msg.sender, msg.value);
    }

    function finishContract(address payable birthdayChildAddress) public onlyOwner returns (bool) {
        emit CollectedMoneyTransfer(birthdayChildAddress, address(this).balance);
        birthdayChildAddress.transfer(address(this).balance);
        return true;
    }

    event GiftMoneyDeposit(address who, uint256 amount);
    event CollectedMoneyTransfer(address who, uint256 amount);
}
