// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RetiredProof
 * @dev Kontrak ERC-721 untuk NFT bukti pensiun (offset).
 * Menggunakan auto-incrementing ID.
 * Dikelola oleh CarbonFiCore.
 */
contract RetiredProof is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("CarbonFi Retired Proof", "CFRETIRED") {
        // Deployer mendapatkan admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Deployer bisa mint untuk testing awal
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Fungsi untuk setup Core contract sebagai minter.
     */
    function setupCoreMinter(address coreAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, coreAddress);
    }

    /**
     * @dev Fungsi mint, hanya bisa dipanggil oleh MINTER_ROLE.
     * Menggunakan ID otomatis.
     */
    function safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    /**
     * @dev Override dari ERC721URIStorage
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Diperlukan untuk AccessControl.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}