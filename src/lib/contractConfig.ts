// Mengimpor file JSON ABI dari folder /lib/abi/
import CarbonFiCoreABI from './abi/CarbonFiCore.json';
import CarbonTokenABI from './abi/CarbonToken.json';
import ProjectCertificateABI from './abi/ProjectCertificate.json';
import RetiredProofABI from './abi/RetiredProof.json';

// --- ALAMAT KONTRAK (FINAL DEPLOYMENT V2.2) ---
// Alamat-alamat ini sudah live di Lisk Sepolia

// Kontrak Utama (Otak)
export const CORE_CONTRACT_ADDRESS = "0x1Bebc50E2A03e295Ae16A6a877e1B022903fA4b8";

// Kontrak Token
export const TOKEN_CONTRACT_ADDRESS = "0x755705D35921E008B0C1aBB43719Af16BEd7D2f1";
export const CERTIFICATE_CONTRACT_ADDRESS = "0x91edf5f53DF486220118dce53803Ec45b655B4cC";
export const PROOF_CONTRACT_ADDRESS = "0x2A5a229DeB7c9ba6E67de2225276ef53963372C1";

// --- ABI (PANDUAN FUNGSI) ---
// Kita ambil hanya bagian '.abi' dari file JSON

export const CORE_ABI = CarbonFiCoreABI.abi;
export const TOKEN_ABI = CarbonTokenABI.abi;
export const CERTIFICATE_ABI = ProjectCertificateABI.abi;
export const PROOF_ABI = RetiredProofABI.abi;