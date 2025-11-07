// src/lib/constants.ts (DUMMY CONTRACT ADDRESSES)
// Ini harus diganti dengan alamat kontrak yang sebenarnya setelah deployment ke Lisk Sepolia
export const CONTRACT_ADDRESSES = {
  PORCE_CORE: '0x5Fb30d8dFbf26C957abD0d922a84E290c06463Cb', // Contract utama (Minter/Burner/Core Logic)
  PORCE_TOKEN: '0x88F065464161b9428Ff72a4E10c0e393318f5F9B', // PORCEToken.sol (ERC-1155)
  PORCE_CERTIFICATE: '0x9fE46f5c8F79D4c74f5145fC12a6D1E61618e7eF', // ProjectCertificate.sol (ERC-721)
  PORCE_PROOF: '0xCf75dC8d8A4f757f12e873B8e7587B67e2F5f84E', // RetiredProof.sol (ERC-721)
};

export const CONTRACT_ABI_PLACEHOLDER = {
    PORCECore: 'ABI_PORCE_CORE_GOES_HERE',
    PORCEToken: 'ABI_PORCE_TOKEN_GOES_HERE',
    ProjectCertificate: 'ABI_PROJECT_CERTIFICATE_GOES_HERE',
    RetiredProof: 'ABI_RETIRED_PROOF_GOES_HERE',
};

// --- DUMMY DATA ---
// Simulasi data proyek yang diambil dari IPFS/Smart Contract
export interface Project {
    projectId: number;
    name: string;
    location: string;
    co2Amount: number; // Ton CO2 (Token ERC-1155 Supply)
    priceInWei: bigint; // Harga per 1 token dalam Wei
    ownerWallet: string; // Wallet NGO/penjual
    metadataUri: string; // Tautan IPFS ke metadata lengkap
    isForSale: boolean;
}

// Simulasi data Sertifikat NFT (Proyek atau Penebusan)
export interface Certificate {
    type: 'Proyek' | 'Pensiun';
    tokenId: number; // ID unik NFT (ERC-721)
    projectName: string;
    co2Amount: number; // Jumlah yang di-mint/dibakar
    issuedTo: string;
    txHash: string;
}

export const DUMMY_PROJECTS: Project[] = [
    { projectId: 1, name: "Mangrove Delta Kalimantan", location: "Kalimantan Barat", co2Amount: 5000, priceInWei: 1000000000000000n, ownerWallet: '0xAb8...cb2', metadataUri: 'ipfs://mangrove-uri', isForSale: true },
    { projectId: 2, name: "Reboisasi Hutan Sumatra", location: "Sumatra Utara", co2Amount: 2500, priceInWei: 1500000000000000n, ownerWallet: '0xAb8...cb2', metadataUri: 'ipfs://sumatra-uri', isForSale: true },
    { projectId: 3, name: "Solar Panel Komunitas", location: "Jawa Tengah", co2Amount: 1000, priceInWei: 800000000000000n, ownerWallet: '0x4B2...db', metadataUri: 'ipfs://solar-uri', isForSale: false },
];

export const DUMMY_USER_TOKENS = {
    '1': 1250, // Saldo Token ID 1
    '2': 350,  // Saldo Token ID 2
};

export const DUMMY_CERTIFICATES: Certificate[] = [
    { type: 'Pensiun', tokenId: 101, projectName: 'Mangrove Delta Kalimantan', co2Amount: 3750, issuedTo: 'PT. Polutif', txHash: '0xabc123...' },
    { type: 'Proyek', tokenId: 1, projectName: 'Reboisasi Hutan Sumatra', co2Amount: 2500, issuedTo: 'NGO A', txHash: '0xdef456...' },
];