// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// --- [UPDATE] ---
// Library Counters.sol dihapus

/**
 * @title RetiredProof
 * @dev Kontrak ERC-721 untuk NFT bukti pensiun (offset).
 * Menggunakan auto-incrementing ID manual.
 */
contract RetiredProof is ERC721, ERC721URIStorage, AccessControl {
    // --- [UPDATE] ---
    // Gunakan counter uint256 manual (dimulai dari 0)
    uint256 private _tokenIdCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721("CarbonFi Retired Proof", "CFRETIRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
        // --- [UPDATE] ---
        // Gunakan counter manual
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}