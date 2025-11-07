import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("\n🚀 Starting CarbonFi Contract Deployment...\n");

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia-api.lisk.com");
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in .env");
  }

  const signer = new ethers.Wallet(privateKey, provider);
  console.log(`📍 Deploying from account: ${signer.address}`);
  const balance = await provider.getBalance(signer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} LSK\n`);

  // Load artifacts
  const artifactsDir = path.resolve("artifacts/contracts");

  const loadArtifact = (name: string) => {
    const artifactPath = path.join(artifactsDir, `${name}.sol/${name}.json`);
    const content = fs.readFileSync(artifactPath, "utf-8");
    return JSON.parse(content);
  };

  const CarbonTokenArtifact = loadArtifact("CarbonToken");
  const ProjectCertificateArtifact = loadArtifact("ProjectCertificate");
  const RetiredProofArtifact = loadArtifact("RetiredProof");
  const CarbonFiCoreArtifact = loadArtifact("CarbonFiCore");

  // Step 1: Deploy CarbonToken (ERC-1155)
  console.log("📦 Step 1: Deploying CarbonToken (ERC-1155)...");
  const CarbonTokenFactory = new ethers.ContractFactory(
    CarbonTokenArtifact.abi,
    CarbonTokenArtifact.bytecode,
    signer
  );
  const carbonToken = await CarbonTokenFactory.deploy();
  await carbonToken.waitForDeployment();
  const carbonTokenAddress = await carbonToken.getAddress();
  console.log(`✅ CarbonToken deployed at: ${carbonTokenAddress}\n`);

  // Step 2: Deploy ProjectCertificate (ERC-721)
  console.log("📦 Step 2: Deploying ProjectCertificate (ERC-721)...");
  const ProjectCertificateFactory = new ethers.ContractFactory(
    ProjectCertificateArtifact.abi,
    ProjectCertificateArtifact.bytecode,
    signer
  );
  const projectCertificate = await ProjectCertificateFactory.deploy();
  await projectCertificate.waitForDeployment();
  const projectCertificateAddress = await projectCertificate.getAddress();
  console.log(`✅ ProjectCertificate deployed at: ${projectCertificateAddress}\n`);

  // Step 3: Deploy RetiredProof (ERC-721)
  console.log("📦 Step 3: Deploying RetiredProof (ERC-721)...");
  const RetiredProofFactory = new ethers.ContractFactory(
    RetiredProofArtifact.abi,
    RetiredProofArtifact.bytecode,
    signer
  );
  const retiredProof = await RetiredProofFactory.deploy();
  await retiredProof.waitForDeployment();
  const retiredProofAddress = await retiredProof.getAddress();
  console.log(`✅ RetiredProof deployed at: ${retiredProofAddress}\n`);

  // Step 4: Deploy CarbonFiCore
  console.log("📦 Step 4: Deploying CarbonFiCore (Main Contract)...");
  const CarbonFiCoreFactory = new ethers.ContractFactory(
    CarbonFiCoreArtifact.abi,
    CarbonFiCoreArtifact.bytecode,
    signer
  );

  // --- [FIX] ---
  // Urutan argumen ditukar agar sesuai dengan constructor:
  // 1. _certificateAddress
  // 2. _tokenAddress
  // 3. _proofAddress
  const carbonFiCore = await CarbonFiCoreFactory.deploy(
    projectCertificateAddress, // Argumen 1 (Sertifikat)
    carbonTokenAddress,        // Argumen 2 (Token)
    retiredProofAddress        // Argumen 3 (Bukti)
  );
  // ---------------

  await carbonFiCore.waitForDeployment();
  const carbonFiCoreAddress = await carbonFiCore.getAddress();
  console.log(`✅ CarbonFiCore deployed at: ${carbonFiCoreAddress}\n`);

  // Step 5: Setup Roles and Permissions
  console.log("🔐 Step 5: Setting up roles and permissions...");

  // Setup CarbonToken roles
  console.log("  → Setting up CarbonToken roles...");
  const carbonTokenContract = new ethers.Contract(carbonTokenAddress, CarbonTokenArtifact.abi, signer);
  let tx = await carbonTokenContract.setupCoreRoles(carbonFiCoreAddress);
  await tx.wait();
  console.log(`    ✅ CarbonToken roles configured`);

  // Setup ProjectCertificate minter role
  console.log("  → Setting up ProjectCertificate minter role...");
  const projectCertificateContract = new ethers.Contract(projectCertificateAddress, ProjectCertificateArtifact.abi, signer);
  tx = await projectCertificateContract.setupCoreMinter(carbonFiCoreAddress);
  await tx.wait();
  console.log(`    ✅ ProjectCertificate minter role configured`);

  // Setup RetiredProof minter role
  console.log("  → Setting up RetiredProof minter role...");
  const retiredProofContract = new ethers.Contract(retiredProofAddress, RetiredProofArtifact.abi, signer);
  tx = await retiredProofContract.setupCoreMinter(carbonFiCoreAddress);
  await tx.wait();
  console.log(`    ✅ RetiredProof minter role configured\n`);

  // Step 6: Print Summary
  console.log("═══════════════════════════════════════════════════════════");
  console.log("✨ CarbonFi Deployment Complete!");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("📋 Contract Addresses:");
  console.log(`   CarbonToken:           ${carbonTokenAddress}`);
  console.log(`   ProjectCertificate:    ${projectCertificateAddress}`);
  console.log(`   RetiredProof:          ${retiredProofAddress}`);
  console.log(`   CarbonFiCore:          ${carbonFiCoreAddress}\n`);

  console.log("🔗 Block Explorer:");
  console.log(`   https://sepolia-blockscout.lisk.com/address/${carbonFiCoreAddress}\n`);

  // Export addresses
  const addresses = {
    carbonToken: carbonTokenAddress,
    projectCertificate: projectCertificateAddress,
    retiredProof: retiredProofAddress,
    carbonFiCore: carbonFiCoreAddress,
    network: "lisk-sepolia",
    chainId: 4202,
    rpcUrl: "https://rpc.sepolia-api.lisk.com",
    blockExplorer: "https://sepolia-blockscout.lisk.com"
  };

  console.log("📦 Contract Addresses (JSON):");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });