//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract BirthdayMoneyCollector is Ownable {
    string _name;
    string _image;
    uint256 _birthdayDate;

    bool _isActive;

    uint256 _participationAmount;
    uint256 _targetGiftAmount;
    address[] _participantList;
    mapping(address => uint256) _participants;

    constructor(
        string memory name,
        string memory image,
        uint256 birthdayDate,
        uint256 participationAmout,
        uint256 targetGiftAmount
    ) {
        require(birthdayDate > block.timestamp, "The birthdayDate is invalid");

        _name = name;
        _image = image;
        _birthdayDate = birthdayDate;
        _participationAmount = participationAmout;
        _targetGiftAmount = targetGiftAmount;
        _isActive = true;

        emit BirthdayMoneyCollectorCreated(
            owner(),
            _name,
            _image,
            _birthdayDate,
            _participationAmount,
            _targetGiftAmount
        );
    }

    modifier isContractActive() {
        require(_isActive, "Contract is not active");
        _;
    }

    function changeContractStatus() public onlyOwner returns (bool) {
        _isActive = !_isActive;
        return _isActive;
    }

    function getBirthdayData() public view returns (string memory, string memory, uint256, uint256, uint256, uint256, address[] memory ) {
        return (_name, _image, _birthdayDate, _participationAmount, _targetGiftAmount, address(this).balance, _participantList );
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getParticipantList() public view returns (address[] memory) {
        return _participantList;
    }

    function participateBirthday() public payable isContractActive {
        require(
            _participationAmount == msg.value,
            "Insufficient participation amount"
        );
        require(
            _participants[msg.sender] == 0,
            "You have already been participated"
        );

        _participants[msg.sender] = msg.value;
        _participantList.push(msg.sender);
        emit UserParticipated(msg.sender, msg.value);
    }

    function close(address payable to) public onlyOwner {
        /* console.log(
            "Current block.timestamp %d and birthdayDate",
            block.timestamp,_birthdayDate
        );
        */

        require(
            _birthdayDate < block.timestamp,
            "The birthday hasn't come yet"
        );

        uint256 collectedAmount = getContractBalance();
        to.transfer(collectedAmount);
        emit CollectedBirthdayMoneyTransfered(to, collectedAmount);
    }

    event BirthdayMoneyCollectorCreated(
        address owner,
        string name,
        string image,
        uint256 birthdayDate,
        uint256 participationAmount,
        uint256 targetContractBalance
    );
    event UserParticipated(address user, uint256 participationAmount);
    event CollectedBirthdayMoneyTransfered(
        address to,
        uint256 tatolCollectedAmount
    );
}
