// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Impor AccessControl
import "@openzeppelin/contracts/access/AccessControl.sol";
// Impor untuk menerima ERC1155
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

// Impor 3 kontrak token kita
import "./ProjectCertificate.sol";
import "./CarbonToken.sol";
import "./RetiredProof.sol";

/**
 * @title CarbonFiCore
 * @dev Kontrak utama yang mengatur semua logika bisnis.
 * v2.1: Menghapus dependency Counters, kembali ke uint256 manual.
 * Mengandung patch certificateHash dan fix Re-entrancy.
 */
contract CarbonFiCore is AccessControl, ERC1155Holder {
    // --- [UPDATE] ---
    // Counter manual untuk Project ID. Kita mulai dari 1.
    uint256 private _projectIdCounter = 1;

    // Role untuk Verificator
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Referensi ke 3 kontrak token
    ProjectCertificate public certificateContract;
    CarbonToken public tokenContract;
    RetiredProof public proofContract;

    // --- STORAGE ---
    mapping(uint256 => address) public projectOwner;
    mapping(uint256 => uint256) public tokenPriceInWei;

    // --- [SECURITY PATCH 1] ---
    mapping(bytes32 => bool) public isHashUsed;

    // --- EVENTS ---
    event ProjectRegistered(uint256 indexed projectId, address indexed owner, uint256 amount, string metadataUri);
    event PriceSet(uint256 indexed projectId, uint256 price);
    event TokensPurchased(uint256 indexed projectId, address indexed buyer, address indexed seller, uint256 amount, uint256 totalCost);
    event TokensRetired(uint256 indexed projectId, address indexed owner, uint256 amount);

    /**
     * @dev Constructor, mendaftarkan alamat 3 kontrak token
     */
    constructor(
        address _certificateAddress,
        address _tokenAddress,
        address _proofAddress
    ) {
        certificateContract = ProjectCertificate(_certificateAddress);
        tokenContract = CarbonToken(_tokenAddress);
        proofContract = RetiredProof(_proofAddress);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    // --- FUNGSI SETUP (Tidak perlu dipanggil jika pakai script deploy) ---
    function grantRolesToCore() public onlyRole(DEFAULT_ADMIN_ROLE) {
        address coreAddress = address(this);
        certificateContract.setupCoreMinter(coreAddress);
        tokenContract.setupCoreRoles(coreAddress);
        proofContract.setupCoreMinter(coreAddress);
    }

    // --- FASE 1: REGISTRASI PROYEK ---
    function registerProject(
        address ngoWallet,
        uint256 amount,
        string memory metadataUri,
        bytes32 certificateHash // <-- [PATCH 1] Parameter baru
    ) public onlyRole(VERIFIER_ROLE) {
        
        // --- [SECURITY PATCH 1] ---
        require(!isHashUsed[certificateHash], "Certificate hash already used");
        
        require(ngoWallet != address(0), "Invalid NGO wallet");
        require(amount > 0, "Amount must be greater than zero");

        isHashUsed[certificateHash] = true;
        // --------------------------

        // --- [UPDATE] ---
        // Gunakan counter manual
        uint256 projectId = _projectIdCounter;
        _projectIdCounter++;

        projectOwner[projectId] = ngoWallet;

        certificateContract.safeMint(ngoWallet, projectId, metadataUri);
        tokenContract.mint(address(this), projectId, amount, metadataUri);

        emit ProjectRegistered(projectId, ngoWallet, amount, metadataUri);
    }

    // --- FASE 2: SET HARGA ---
    function setTokenPrice(uint256 projectId, uint256 priceInWei) public onlyRole(VERIFIER_ROLE) {
        require(projectOwner[projectId] != address(0), "Project not found");
        require(priceInWei > 0, "Price must be greater than zero");

        tokenPriceInWei[projectId] = priceInWei;
        emit PriceSet(projectId, priceInWei);
    }

    // --- FASE 3: BELI TOKEN ---
    function buyTokens(uint256 projectId, uint256 amount) public payable {
        // --- [SECURITY PATCH 2] ---
        // Pola "Checks-Effects-Interactions"
        // --------------------------

        // 1. CHECKS
        uint256 price = tokenPriceInWei[projectId];
        address seller = projectOwner[projectId];

        require(price > 0, "Price not set for this project");
        require(seller != address(0), "Project not found");
        require(amount > 0, "Amount must be greater than zero");

        uint256 totalCost = price * amount;
        require(msg.value == totalCost, "Incorrect ETH sent");

        uint256 escrowBalance = tokenContract.balanceOf(address(this), projectId);
        require(escrowBalance >= amount, "Not enough tokens in escrow");

        // 2. EFFECTS (Ubah State Internal Dulu)
        tokenContract.safeTransferFrom(address(this), msg.sender, projectId, amount, "");

        // 3. INTERACTIONS (Kirim ETH/LSK Paling Akhir)
        (bool success, ) = payable(seller).call{value: totalCost}("");
        require(success, "Payment to NGO failed");
        
        // --------------------------

        emit TokensPurchased(projectId, msg.sender, seller, amount, totalCost);
    }

    // --- FASE 4: PENSIUN TOKEN ---
    function retireTokens(uint256 projectId, uint256 amount, string memory retirementUri) public {
        require(amount > 0, "Amount must be greater than zero");

        tokenContract.burn(msg.sender, projectId, amount);
        proofContract.safeMint(msg.sender, retirementUri);

        emit TokensRetired(projectId, msg.sender, amount);
    }

    // --- FUNGSI VIEW & UTILS ---
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}