//SPDX-License-Identifier: MIT
// contracts//HelloWorld.sol
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IHelloWorld.sol";

//import "hardhat/console.sol";

contract HelloWorld is Ownable, IHelloWorld {
    mapping(address => string) private messages;

    function setMessage(string calldata newMessage) external override {
        messages[msg.sender] = newMessage;
        emit NewMessage(msg.sender, block.number);
    }

    function getMessage() external view override returns (string memory) {
        return messages[msg.sender];
    }

    // CONTRACT OWNER OPERATIONS
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(success);
    }

    receive() external payable {
        (bool success, ) = payable(owner()).call{value: msg.value}("");
        require(success);
    }

    fallback() external payable {
        (bool success, ) = payable(owner()).call{value: msg.value}("");
        require(success);
    }

    function terminate() external override onlyOwner {
        selfdestruct(payable(owner()));
    }
}
