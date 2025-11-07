// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./ProjectCertificate.sol";
import "./CarbonToken.sol";
import "./RetiredProof.sol";

/**
 * @title CarbonFiCore
 * @dev v2.2: Menambahkan Project struct dan counter untuk frontend fetching
 */
contract CarbonFiCore is AccessControl, ERC1155Holder {
    
    // --- [BARU] ---
    // 1. Definisikan Struct untuk menyimpan semua info proyek
    struct Project {
        address payable owner;  // Pemilik proyek (NGO)
        uint256 priceInWei;     // Harga per token
        string metadataUri;     // Link ke IPFS
    }

    // 2. Buat counter publik agar frontend tahu total proyek
    uint256 public projectCount;

    // 3. Buat mapping dari ID ke Struct
    // Frontend akan memanggil ini untuk mendapat detail
    mapping(uint256 => Project) public projects;
    // --- [SELESAI BARU] ---

    // --- [BARU v2.3] ---
    // Tracking user purchases untuk getProjectsByUserAddress()
    mapping(address user => uint256[] projectIds) public userPurchasedProjects;
    mapping(address user => mapping(uint256 projectId => bool)) public hasUserBought;
    // --- [SELESAI BARU v2.3] ---


    // --- [HAPUS] ---
    // Kita tidak perlu mapping terpisah lagi
    // mapping(uint256 => address) public projectOwner;
    // mapping(uint256 => uint256) public tokenPriceInWei;
    // --- [SELESAI HAPUS] ---


    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    ProjectCertificate public certificateContract;
    CarbonToken public tokenContract;
    RetiredProof public proofContract;
    mapping(bytes32 => bool) public isHashUsed;

    // ... (Events tetap sama) ...
    event ProjectRegistered(uint256 indexed projectId, address indexed owner, uint256 amount, string metadataUri);
    event PriceSet(uint256 indexed projectId, uint256 price);
    event TokensPurchased(uint256 indexed projectId, address indexed buyer, address indexed seller, uint256 amount, uint256 totalCost);
    event TokensRetired(uint256 indexed projectId, address indexed owner, uint256 amount);


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
        
        // Kita tidak perlu increment _projectIdCounter lagi
    }

    // ... (grantRolesToCore tetap sama) ...
    function grantRolesToCore() public onlyRole(DEFAULT_ADMIN_ROLE) {
        address coreAddress = address(this);
        certificateContract.setupCoreMinter(coreAddress);
        tokenContract.setupCoreRoles(coreAddress);
        proofContract.setupCoreMinter(coreAddress);
    }


    // --- [UPDATE] ---
    function registerProject(
        address ngoWallet,
        uint256 amount,
        string memory metadataUri,
        bytes32 certificateHash
    ) public onlyRole(VERIFIER_ROLE) {
        
        require(!isHashUsed[certificateHash], "Certificate hash already used");
        require(ngoWallet != address(0), "Invalid NGO wallet");
        require(amount > 0, "Amount must be greater than zero");

        isHashUsed[certificateHash] = true;

        // Gunakan counter baru
        projectCount++;
        uint256 projectId = projectCount;

        // Simpan semua info ke struct baru
        projects[projectId] = Project({
            owner: payable(ngoWallet),
            priceInWei: 0, // Harga di-set di Fase 2
            metadataUri: metadataUri
        });

        certificateContract.safeMint(ngoWallet, projectId, metadataUri);
        tokenContract.mint(address(this), projectId, amount, metadataUri);

        emit ProjectRegistered(projectId, ngoWallet, amount, metadataUri);
    }

    // --- [UPDATE] ---
    function setTokenPrice(uint256 projectId, uint256 priceInWei) public onlyRole(VERIFIER_ROLE) {
        // Cek bahwa proyeknya ada
        require(projects[projectId].owner != address(0), "Project not found");
        require(priceInWei > 0, "Price must be greater than zero");

        // Update struct-nya
        projects[projectId].priceInWei = priceInWei;
        emit PriceSet(projectId, priceInWei);
    }

    // --- [UPDATE] ---
    function buyTokens(uint256 projectId, uint256 amount) public payable {
        // 1. CHECKS
        // Ambil data dari struct
        Project storage project = projects[projectId];
        
        uint256 price = project.priceInWei;
        address payable seller = project.owner;

        require(price > 0, "Price not set for this project");
        require(seller != address(0), "Project not found");
        require(amount > 0, "Amount must be greater than zero");

        uint256 totalCost = price * amount;
        require(msg.value == totalCost, "Incorrect ETH sent");

        uint256 escrowBalance = tokenContract.balanceOf(address(this), projectId);
        require(escrowBalance >= amount, "Not enough tokens in escrow");

        // 2. EFFECTS
        tokenContract.safeTransferFrom(address(this), msg.sender, projectId, amount, "");

        // 2.5. TRACK USER PURCHASE [NEW v2.3]
        if (!hasUserBought[msg.sender][projectId]) {
            userPurchasedProjects[msg.sender].push(projectId);
            hasUserBought[msg.sender][projectId] = true;
        }

        // 3. INTERACTIONS
        (bool success, ) = seller.call{value: totalCost}("");
        require(success, "Payment to NGO failed");

        emit TokensPurchased(projectId, msg.sender, seller, amount, totalCost);
    }

    // ... (retireTokens tetap sama) ...
    function retireTokens(uint256 projectId, uint256 amount, string memory retirementUri) public {
        require(amount > 0, "Amount must be greater than zero");
        tokenContract.burn(msg.sender, projectId, amount);
        proofContract.safeMint(msg.sender, retirementUri);
        emit TokensRetired(projectId, msg.sender, amount);
    }

    // --- [BARU v2.3] ---
    /**
     * @dev Mendapatkan semua project yang pernah dibeli oleh user
     * @param user Address dari user
     * @return Array dari project IDs yang user beli
     */
    function getProjectsByUserAddress(address user) external view returns (uint256[] memory) {
        return userPurchasedProjects[user];
    }
    // --- [SELESAI BARU v2.3] ---

    // ... (supportsInterface tetap sama) ...
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}