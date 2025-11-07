// Mengimpor file JSON ABI dari folder /lib/abi/
import CarbonFiCoreABI from './abi/CarbonFiCore.json';
import CarbonTokenABI from './abi/CarbonToken.json';
import ProjectCertificateABI from './abi/ProjectCertificate.json';
import RetiredProofABI from './abi/RetiredProof.json';

// --- ALAMAT KONTRAK (FINAL DEPLOYMENT V2 - FIX) ---
// Alamat-alamat ini sudah live di Lisk Sepolia

// Kontrak Utama (Otak)
export const CORE_CONTRACT_ADDRESS = "0x1aa078a3b417d214319bA2fA6e6306b943aE5489";

// Kontrak Token
export const TOKEN_CONTRACT_ADDRESS = "0xb4b8ccD3e378167e604a06b38A2b72e077C1a1b7";
export const CERTIFICATE_CONTRACT_ADDRESS = "0xE3303A79D46225A661092e62Ad3F9ED927ffD93E";
export const PROOF_CONTRACT_ADDRESS = "0x84BA879eC7b0C92F54Ef8C8E15abf59448b125f1";

// --- ABI (PANDUAN FUNGSI) ---
// Kita ambil hanya bagian '.abi' dari file JSON

export const CORE_ABI = CarbonFiCoreABI.abi;
export const TOKEN_ABI = CarbonTokenABI.abi;
export const CERTIFICATE_ABI = ProjectCertificateABI.abi;
export const PROOF_ABI = RetiredProofABI.abi;