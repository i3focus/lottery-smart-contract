// SPDX-License-Identifier: MIT
// Author: jetherrodrigues@gmail.com
// Website: https://jetherrodrigues.dev.br
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Lottery is ReentrancyGuard {
    address public owner;
    address payable[] public players;
    uint256 public lotteryPrice;

    // Emit when lottery is reset
    event LotteryReset(address indexed _from);
    // Emit when a player enters the lottery
    event LotteryEnter(address indexed _from);
    // Emit when a winner is selected
    event WinnerSelected(address indexed _winner, uint256 _amount);

    constructor(uint256 _price) {
        owner = msg.sender;
        lotteryPrice = _price;
    }

    // Ensure only the owner can call a function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Ensure the exact lottery price is paid
    modifier onlyWithExactPrice() {
        require(msg.value == lotteryPrice, "Must send the exact lottery price to enter.");
        _;
    }

    // Function to enter the lottery
    function enter() public payable onlyWithExactPrice nonReentrant {
        players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    // Function to get the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Helper function to generate a pseudo-random number
    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(owner, block.timestamp, players.length)));
    }

    // Function to select the winner
    function pickWinner() public onlyOwner nonReentrant {
        require(players.length > 0, "There must be at least one player to pick a winner.");

        uint256 index = random() % players.length;
        address payable winner = players[index];
        uint256 prizeMoney = getBalance();
        
        // Reset the players array before transferring money to prevent reentrancy attacks
        players = new address payable[](0);
        emit LotteryReset(msg.sender);
        
        // Transfer prize money to the winner
        winner.transfer(prizeMoney);
        emit WinnerSelected(winner, prizeMoney);
    }

    // Function to allow the owner to change the lottery price
    function changeLotteryPrice(uint256 _price) public onlyOwner {
        lotteryPrice = _price;
    }

    // Function to get the list of players
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    // Withdraw function in case of emergency, only callable by owner
    function emergencyWithdraw() public onlyOwner nonReentrant {
        payable(owner).transfer(getBalance());
    }
}
