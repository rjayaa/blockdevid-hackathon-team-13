// Mengimpor file JSON ABI dari folder /lib/abi/
import CarbonFiCoreABI from './abi/CarbonFiCore.json';
import CarbonTokenABI from './abi/CarbonToken.json';
import ProjectCertificateABI from './abi/ProjectCertificate.json';
import RetiredProofABI from './abi/RetiredProof.json';

// --- ALAMAT KONTRAK (FINAL DEPLOYMENT) ---
// Alamat-alamat ini sudah live di Lisk Sepolia

// Kontrak Utama (Otak)
export const CORE_CONTRACT_ADDRESS = "0xd91bA93114bB47c6C20bec08c20d36D195Cad29D";

// Kontrak Token
export const TOKEN_CONTRACT_ADDRESS = "0x32794DDB0B309f0eEC235d6434D064AccDB927a3";
export const CERTIFICATE_CONTRACT_ADDRESS = "0x6C4668AB0679A4409b138e7F2bC6045a3D80f8e1";
export const PROOF_CONTRACT_ADDRESS = "0x526c5935F5BAE0E97b207a0aFc5d07754C0148e8";

// --- ABI (PANDUAN FUNGSI) ---
// Kita ambil hanya bagian '.abi' dari file JSON

export const CORE_ABI = CarbonFiCoreABI.abi;
export const TOKEN_ABI = CarbonTokenABI.abi;
export const CERTIFICATE_ABI = ProjectCertificateABI.abi;
export const PROOF_ABI = RetiredProofABI.abi;