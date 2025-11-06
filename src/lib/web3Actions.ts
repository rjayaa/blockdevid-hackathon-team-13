import { ethers } from "ethers";
import { CORE_CONTRACT_ADDRESS, CORE_ABI } from "./contractConfig";

/**
 * Catatan: Fungsi `getSigner` ini adalah placeholder.
 * Di aplikasi Next.js-mu, kamu akan mendapatkan 'signer' dari 
 * provider wallet-mu (seperti PannaSDK, Wagmi, Ethers, dll).
 * * Tim frontend harus menyediakan objek 'signer' ini.
 */
async function getSigner() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask (atau provider) tidak terdeteksi!");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
}

/**
 * Membuat instance dari kontrak CarbonFiCore.
 */
async function getCoreContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    CORE_CONTRACT_ADDRESS,
    CORE_ABI,
    signer
  );
}

// --- FASE 1: REGISTRASI PROYEK (Oleh Verificator) ---
/**
 * Memanggil fungsi registerProject di smart contract.
 * Ini akan dipanggil dari halaman admin oleh Verificator.
 */
export async function callRegisterProject(
  ngoWallet: string,
  amount: number,
  metadataUri: string,
  certificateHash: string // Pastikan ini adalah bytes32 (diawali '0x...')
) {
  try {
    const contract = await getCoreContract();
    console.log("Mengirim transaksi registerProject...");
    
    const tx = await contract.registerProject(
      ngoWallet,
      amount,
      metadataUri,
      ethers.zeroPadValue(certificateHash, 32) // Memastikan ini 32 bytes
    );
    
    await tx.wait(); // Menunggu transaksi dikonfirmasi
    console.log("registerProject sukses! Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Gagal memanggil registerProject:", error);
    throw error;
  }
}

// --- FASE 2: SET HARGA (Oleh Verificator) ---
/**
 * Memanggil fungsi setTokenPrice di smart contract.
 * Ini akan dipanggil dari halaman admin oleh Verificator.
 */
export async function callSetTokenPrice(
  projectId: number,
  priceInWei: string // Kirim sebagai string untuk angka besar
) {
  try {
    const contract = await getCoreContract();
    console.log(`Menetapkan harga untuk projectId ${projectId}...`);

    const tx = await contract.setTokenPrice(projectId, priceInWei);
    
    await tx.wait();
    console.log("setTokenPrice sukses! Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Gagal memanggil setTokenPrice:", error);
    throw error;
  }
}

// --- FASE 3: BELI TOKEN (Oleh Perusahaan B) ---
/**
 * Memanggil fungsi buyTokens di smart contract.
 * Ini akan dipanggil dari halaman Marketplace oleh Perusahaan B.
 */
export async function callBuyTokens(
  projectId: number,
  amount: number,
  totalCostInWei: string // Kirim sebagai string
) {
  try {
    const contract = await getCoreContract();
    console.log(`Membeli ${amount} token dari projectId ${projectId}...`);

    const tx = await contract.buyTokens(
      projectId,
      amount,
      {
        value: totalCostInWei // Mengirim LSK/ETH bersama transaksi
      }
    );

    await tx.wait();
    console.log("buyTokens sukses! Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Gagal memanggil buyTokens:", error);
    throw error;
  }
}

// --- FASE 4: PENSIUN TOKEN (Oleh Perusahaan B) ---
/**
 * Memanggil fungsi retireTokens di smart contract.
 * Ini akan dipanggil dari halaman Portfolio oleh Perusahaan B.
 */
export async function callRetireTokens(
  projectId: number,
  amount: number,
  retirementUri: string
) {
  try {
    const contract = await getCoreContract();
    console.log(`Membakar ${amount} token dari projectId ${projectId}...`);

    const tx = await contract.retireTokens(
      projectId,
      amount,
      retirementUri
    );

    await tx.wait();
    console.log("retireTokens sukses! Hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Gagal memanggil retireTokens:", error);
    throw error;
  }
}