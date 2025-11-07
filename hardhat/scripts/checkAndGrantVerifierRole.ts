import { ethers } from "ethers";
// import CarbonFiCoreABI from "/artifacts/contracts/CarbonFiCore.sol/CarbonFiCore.json" assert { type: "json" };
 import CarbonFiCoreABI from "../artifacts/contracts/CarbonFiCore.sol/artifacts.js" assert { type: "json" };

const RPC_URL = "https://rpc.sepolia-api.lisk.com";

async function main() {
  const CARBONFI_CORE_ADDRESS = "0xB95a90DAE38990095B917f87199f3b539F3D5fA3";
  const WALLET_TO_CHECK = "0x14C7F1d75e8B74618D77E6eE5A830EeE7D7FB64F";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("📝 Connecting with signer:", signer.address);
  console.log("🌐 RPC URL:", RPC_URL);
  console.log("📜 Contract Address:", CARBONFI_CORE_ADDRESS);

  // Create contract instance with signer (so we can write)
  const contract = new ethers.Contract(
    CARBONFI_CORE_ADDRESS,
    CarbonFiCoreABI.abi,
    signer
  );

  // Get VERIFIER_ROLE
  const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
  console.log("VERIFIER_ROLE hash:", VERIFIER_ROLE);

  // Check if wallet has VERIFIER_ROLE
  const hasRole = await contract.hasRole(VERIFIER_ROLE, WALLET_TO_CHECK);
  console.log(`\nWallet ${WALLET_TO_CHECK}`);
  console.log(`Has VERIFIER_ROLE: ${hasRole}`);

  if (!hasRole) {
    console.log("\n⚠️ Wallet does NOT have VERIFIER_ROLE");
    console.log("Attempting to grant VERIFIER_ROLE...");

    try {
      const tx = await contract.grantRole(VERIFIER_ROLE, WALLET_TO_CHECK);
      console.log("Transaction sent:", tx.hash);

      await tx.wait();
      console.log("✓ Successfully granted VERIFIER_ROLE to", WALLET_TO_CHECK);

      // Verify
      const hasRoleAfter = await contract.hasRole(
        VERIFIER_ROLE,
        WALLET_TO_CHECK,
      );
      console.log(
        "Verification:",
        hasRoleAfter ? "✓ Role granted" : "❌ Role grant failed",
      );
    } catch (error) {
      console.error("❌ Error granting role:", error);
    }
  } else {
    console.log("\n✓ Wallet already has VERIFIER_ROLE");
  }
}

main().catch(console.error);
