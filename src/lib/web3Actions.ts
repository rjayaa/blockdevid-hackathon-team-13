import { ethers } from "ethers";
import { 
  CORE_CONTRACT_ADDRESS, 
  CORE_ABI 
} from "./contractConfig"; // Hanya mengimpor yang kita butuhkan

// --- [HELPER 1: READ-ONLY] ---
/**
 * Membuat instance kontrak "Read-Only" (Hanya Baca).
 * Ini tidak butuh wallet/signer dan bagus untuk fetch data publik.
 */
function getReadOnlyContract() {
  // Kita pakai RPC publik Lisk Sepolia
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia-api.lisk.com");
  return new ethers.Contract(
    CORE_CONTRACT_ADDRESS,
    CORE_ABI,
    provider
  );
}

// --- [HELPER 2: UNTUK TRANSAKSI/WRITE] ---
/**
 * Catatan: Fungsi `getSigner` ini adalah placeholder.
 * GANTI INI DENGAN LOGIKA DARI panna-provider.tsx
 * Tim frontend harus menyediakan objek 'signer' ini.
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
 * Membuat instance dari kontrak CarbonFiCore (Untuk Transaksi/WRITE).
 */
async function getWriteContract() {
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
  certificateHash: string
) {
  try {
    const contract = await getWriteContract(); // Butuh signer
    console.log("Mengirim transaksi registerProject...");
    
    // Pastikan hash adalah 32 bytes
    const formattedHash = ethers.zeroPadValue(ethers.hexlify(certificateHash), 32);

    const tx = await contract.registerProject(
      ngoWallet,
      amount,
      metadataUri,
      formattedHash
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
  priceInWei: string 
) {
  try {
    const contract = await getWriteContract(); // Butuh signer
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
  totalCostInWei: string
) {
  try {
    const contract = await getWriteContract(); // Butuh signer
    console.log(`Membeli ${amount} token dari projectId ${projectId}...`);

    const tx = await contract.buyTokens(
      projectId,
      amount,
      {
        value: totalCostInWei // Mengirim LSK/ETH
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
    const contract = await getWriteContract(); // Butuh signer
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


// --- [FUNGSI FETCH DATA] ---
// --- UNTUK FETCH DATA MARKETPLACE (READ-ONLY) ---

/**
 * [BARU] Mengambil detail satu proyek.
 * Ini memanggil mapping 'projects' publik di kontrak.
 */
export async function callGetProjectDetails(projectId: number) {
  try {
    const contract = getReadOnlyContract(); // Tidak butuh signer
    console.log(`Mengambil detail proyek #${projectId}...`);

    const project = await contract.projects(projectId);

    // Cek jika proyeknya ada (owner tidak 0x0)
    if (project.owner === ethers.ZeroAddress) {
      throw new Error(`Proyek dengan ID ${projectId} tidak ditemukan.`);
    }

    return {
      projectId: projectId,
      owner: project.owner,
      priceInWei: project.priceInWei.toString(), // konversi BigInt ke string
      metadataUri: project.metadataUri
    };
  } catch (error) {
    console.error("Gagal mengambil detail proyek:", error);
    throw error;
  }
}

/**
 * [BARU] Mengambil SEMUA proyek untuk halaman Marketplace.
 * Ini adalah "fungsi" yang kita diskusikan.
 */
export async function callGetAllProjects() {
  try {
    const contract = getReadOnlyContract(); // Tidak butuh signer
    console.log("Mengambil total jumlah proyek...");

    // 1. Panggil counter untuk tahu total proyek
    const projectCount = await contract.projectCount();
    const projectCountNum = Number(projectCount); // Konversi BigInt ke angka

    console.log(`Total proyek ditemukan: ${projectCountNum}`);

    const allProjects = [];

    // 2. Lakukan looping di frontend
    for (let i = 1; i <= projectCountNum; i++) {
      console.log(`Mengambil data proyek #${i}`);
      // 3. Panggil detail setiap proyek satu per satu
      const project = await contract.projects(i);
      
      // Kita hanya tambahkan proyek yang valid (jika owner-nya ada)
      if (project.owner !== ethers.ZeroAddress) {
        allProjects.push({
          projectId: i,
          owner: project.owner,
          priceInWei: project.priceInWei.toString(),
          metadataUri: project.metadataUri
        });
      }
    }

    // 4. Kembalikan array berisi semua data proyek
    return allProjects;
  } catch (error) {
    console.error("Gagal mengambil semua proyek:", error);
    throw error;
  }
}