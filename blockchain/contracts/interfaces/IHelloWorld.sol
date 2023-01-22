//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IHelloWorld {
    // Events
    event NewMessage(
        address indexed clientAddress,
        uint256 indexed blockNumber
    );

    function setMessage(string calldata newMessage) external;

    function getMessage() external view returns (string memory);

    // CONTRACT OWNER OPERATIONS

    function terminate() external;
}
