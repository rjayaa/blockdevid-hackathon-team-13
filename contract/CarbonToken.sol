// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CarbonToken
 * @dev Kontrak ERC-1155 untuk unit kredit karbon.
 * Setiap tokenId mewakili satu proyek karbon yang unik.
 * Dikelola oleh CarbonFiCore.
 */
contract CarbonToken is ERC1155, AccessControl {
    // Role untuk akun (atau kontrak) yang boleh mint dan burn
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Menyimpan URI untuk setiap tokenId
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Constructor. Base URI dikosongkan karena kita set per-token.
     */
    constructor() ERC1155("") {
        // Deployer mendapatkan admin role
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Deployer bisa mint/burn untuk testing awal
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    /**
     * @dev Override fungsi uri untuk mengembalikan URI spesifik per token.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Fungsi untuk setup Core contract sebagai minter/burner.
     */
    function setupCoreRoles(address coreAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, coreAddress);
        _grantRole(BURNER_ROLE, coreAddress);
    }

    /**
     * @dev Fungsi mint, hanya bisa dipanggil oleh MINTER_ROLE.
     * Sekaligus mendaftarkan URI jika belum ada.
     */
    function mint(address to, uint256 id, uint256 amount, string memory tokenUri) public onlyRole(MINTER_ROLE) {
        _mint(to, id, amount, ""); // Data field kosong
        if (bytes(_tokenURIs[id]).length == 0) {
            _tokenURIs[id] = tokenUri;
        }
    }

    /**
     * @dev Fungsi burn, hanya bisa dipanggil oleh BURNER_ROLE.
     */
    function burn(address from, uint256 id, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, id, amount);
    }

    /**
     * @dev Diperlukan untuk AccessControl.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}