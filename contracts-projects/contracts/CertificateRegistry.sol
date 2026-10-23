// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {
    address public owner;

    struct Certificate {
        address issuer;
        uint256 issuedAt;
        bool exists;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(bytes32 indexed hash, address indexed issuer, uint256 issuedAt);

    error NotOwner();
    error AlreadyIssued();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(bytes32 hash) external onlyOwner {
        if (certificates[hash].exists) revert AlreadyIssued();
        certificates[hash] = Certificate(msg.sender, block.timestamp, true);
        emit CertificateIssued(hash, msg.sender, block.timestamp);
    }

    function verify(bytes32 hash) external view returns (bool valid, address issuer, uint256 issuedAt) {
        Certificate memory c = certificates[hash];
        return (c.exists, c.issuer, c.issuedAt);
    }
}