// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ProjectCertificate
 * @dev Kontrak ERC-721 untuk NFT bukti asal-usul proyek.
 * Dikelola oleh CarbonFiCore.
 */
contract ProjectCertificate is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("CarbonFi Project Certificate", "CFCERT") {
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
     */
    function safeMint(address to, uint256 tokenId, string memory uri) public onlyRole(MINTER_ROLE) {
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