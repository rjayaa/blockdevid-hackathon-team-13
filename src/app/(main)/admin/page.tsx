// src/app/(main)/admin/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Upload,
  ShieldCheck,
  Zap,
  AlertCircle,
  CheckCircle,
  Tag,
} from "lucide-react";
import { useActiveAccount } from "panna-sdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { callRegisterProject, callSetTokenPrice } from "@/lib/web3Actions";
import { ethers } from "ethers";

// Admin address - sama dengan Navbar
const VERIFICATOR_ADDRESS =
  "0x14C7F1d75e8B74618D77E6eE5A830EeE7D7FB64F".toLowerCase();

const DUMMY_ADMIN_ADDRESS = "0x00000";

export default function AdminDashboard() {
  const account = useActiveAccount();
  const router = useRouter();
  const [isVerifier, setIsVerifier] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Form states - Register Project
  const [formData, setFormData] = useState({
    amount: "",
    ngoWallet: "",
    metadataUri: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form states - Set Token Price
  const [priceFormData, setPriceFormData] = useState({
    projectId: "",
    priceValue: "",
    priceUnit: "eth", // "wei", "gwei", "eth"
  });
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceSuccessMessage, setPriceSuccessMessage] = useState("");
  const [priceErrorMessage, setPriceErrorMessage] = useState("");

  useEffect(() => {
    function verifyRole() {
      if (!account?.address) {
        console.log("⚠️ No account address found");
        setIsChecking(false);
        return;
      }

      const userAddress = account.address.toLowerCase();
      console.log("🔍 [Admin Page] Verifying VERIFIER_ROLE");
      console.log("   User Address:", userAddress);
      console.log("   Expected Address:", VERIFICATOR_ADDRESS);

      // Log network info
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const currentChainId = (window as any).ethereum.chainId;
        const chainIdNum = currentChainId ? parseInt(currentChainId, 16) : null;
        console.log("   🌐 Current Network Chain ID:", chainIdNum);
        console.log("   🌐 Expected Network: 4202 (Lisk Sepolia)");

        if (chainIdNum !== 4202) {
          console.warn("⚠️ WRONG NETWORK! Expected Lisk Sepolia (4202)");
        }
      }

      // Check if user address matches admin address (same as Navbar)
      const isAdmin = userAddress === VERIFICATOR_ADDRESS;
      console.log("✓ [Admin Page] Is Admin?", isAdmin);
      setIsVerifier(isAdmin);

      if (!isAdmin) {
        console.warn("❌ Access Denied: User is not the admin");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        console.log("✅ Access Granted: User is admin");
      }

      setIsChecking(false);
    }

    verifyRole();
  }, [account?.address, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">⏳ Verifying admin access...</p>
          <p className="text-sm text-foreground/60">
            Checking VERIFIER_ROLE in smart contract...
          </p>
        </div>
      </div>
    );
  }

  if (!isVerifier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">❌ Access Denied</p>
          <p className="text-sm text-foreground/60">
            You don't have VERIFIER_ROLE. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">⚠️ Wallet Not Connected</p>
          <p className="text-sm text-foreground/60">
            Please connect your wallet first
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.amount || !formData.ngoWallet || !formData.metadataUri) {
        throw new Error(
          "Semua field (Amount, NGO Wallet, Metadata URI) harus diisi",
        );
      }

      if (!account?.address) {
        throw new Error(
          "Wallet tidak terdeteksi. Pastikan sudah connect dengan Panna SDK",
        );
      }

      console.log("📝 Registering project with data:", formData);

      // Get signer dari connected wallet
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("MetaMask/Panna wallet not detected");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      console.log("✓ Signer obtained from connected wallet");

      // Generate unique certificate hash dari metadataUri + timestamp (untuk prevent duplicate)
      const certificateData = JSON.stringify({
        metadataUri: formData.metadataUri,
        timestamp: Date.now(),
        nonce: Math.random(),
      });
      const certificateHash = ethers.keccak256(
        ethers.toUtf8Bytes(certificateData),
      );

      console.log("🔐 Generated Certificate Hash:", certificateHash);

      // Call smart contract function
      const txHash = await callRegisterProject(
        signer, // signer dari BrowserProvider
        formData.ngoWallet,
        parseInt(formData.amount),
        formData.metadataUri,
        certificateHash,
      );

      // Success
      setSuccessMessage(`✓ Project registered successfully! TX: ${txHash}`);
      console.log("✓ Transaction successful:", txHash);

      // Reset form
      setFormData({
        amount: "",
        ngoWallet: "",
        metadataUri: "",
      });
    } catch (error: any) {
      const errorMsg = error?.message || "Unknown error occurred";
      console.error("❌ Error registering project:", error);
      setErrorMessage(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setPriceFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to convert price to Wei based on unit
  const convertToWei = (value: string, unit: string): string => {
    if (!value) return "0";
    try {
      switch (unit) {
        case "wei":
          return value; // Already in Wei
        case "gwei":
          return ethers.parseUnits(value, "gwei").toString();
        case "eth":
          return ethers.parseEther(value).toString();
        default:
          return "0";
      }
    } catch (error) {
      console.error("Error converting to Wei:", error);
      return "0";
    }
  };

  // Function to display price in Wei
  const getPriceInWei = (): string => {
    return convertToWei(priceFormData.priceValue, priceFormData.priceUnit);
  };

  const handleSetPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceErrorMessage("");
    setPriceSuccessMessage("");
    setIsPriceLoading(true);

    try {
      // Validate form
      if (!priceFormData.projectId || !priceFormData.priceValue) {
        throw new Error("Project ID dan Price harus diisi");
      }

      if (!account?.address) {
        throw new Error("Wallet tidak terdeteksi");
      }

      console.log("💰 Setting token price with data:", priceFormData);

      // Get signer
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("MetaMask/Panna wallet not detected");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      console.log("✓ Signer obtained from connected wallet");

      // Convert to Wei based on selected unit
      const priceInWei = convertToWei(
        priceFormData.priceValue,
        priceFormData.priceUnit,
      );
      console.log(
        `💰 Converting ${priceFormData.priceValue} ${priceFormData.priceUnit.toUpperCase()} to Wei:`,
        priceInWei,
      );

      // Call smart contract function
      const txHash = await callSetTokenPrice(
        signer,
        parseInt(priceFormData.projectId),
        priceInWei,
      );

      // Success
      setPriceSuccessMessage(`✓ Token price set successfully! TX: ${txHash}`);
      console.log("✓ Transaction successful:", txHash);

      // Reset form
      setPriceFormData({
        projectId: "",
        priceValue: "",
        priceUnit: "eth",
      });
    } catch (error: any) {
      const errorMsg = error?.message || "Unknown error occurred";
      console.error("❌ Error setting token price:", error);
      setPriceErrorMessage(`Error: ${errorMsg}`);
    } finally {
      setIsPriceLoading(false);
    }
  };

  return (
    <div className="container mx-auto pb-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-foreground pb-2">
        Dashboard Proyek{" "}
        <span className="text-carbon-medium text-xl">(VERIFICATOR)</span>
      </h1>
      <p className="text-sm text-foreground/80 mb-8 font-space">
        Address: {account?.address?.slice(0, 10)}...
        {account?.address?.slice(-8)} (Role: Verificator)
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="col-span-2 border-2 border-foreground bg-carbon-medium/30">
          <CardHeader>
            <CardTitle className="text-xl uppercase font-bold text-foreground flex items-center gap-2">
              <Zap className="size-6 text-carbon-primary" /> Registrasi Proyek
              Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded-sm flex items-gap-2">
                <CheckCircle className="size-5 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-sm flex items-gap-2">
                <AlertCircle className="size-5 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleMint} className="space-y-6">
              {/* Project Registration Fields */}
              <div className="space-y-4 p-4 border border-foreground/50 bg-carbon-light/50">
                <Label htmlFor="amount" className="uppercase font-semibold">
                  CO2 Amount (Ton) - Token Supply
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  className="bg-foreground border-foreground"
                  value={formData.amount}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />

                <Label htmlFor="ngoWallet" className="uppercase font-semibold">
                  NGO/Project Owner Wallet Address
                </Label>
                <Input
                  id="ngoWallet"
                  placeholder="0x..."
                  className="bg-foreground border-foreground"
                  value={formData.ngoWallet}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Metadata */}
              <div className="space-y-4 p-4 border border-foreground/50 bg-carbon-light/50">
                <Label
                  htmlFor="metadataUri"
                  className="uppercase font-semibold flex items-center gap-2"
                >
                  <Upload className="size-4" /> Metadata URI (IPFS Placeholder)
                </Label>
                <Input
                  id="metadataUri"
                  placeholder="ipfs://QmTest123... (placeholder sementara)"
                  className="bg-foreground border-foreground"
                  value={formData.metadataUri}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-foreground/60 italic">
                  Masukkan IPFS hash placeholder untuk sementara. Nanti akan
                  diganti dengan real IPFS hash saat integrasi selesai.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-carbon-primary text-carbon-medium hover:bg-carbon-primary/90 uppercase font-extrabold tracking-widest border-2 border-foreground hover:border-carbon-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "⏳ Processing..." : "📝 Register Project"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-2 border-foreground">
          <CardHeader>
            <CardTitle className="uppercase font-bold flex items-center gap-2">
              <ShieldCheck className="size-5" /> Status Verifikator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Anda memiliki peran **VERIFIER_ROLE** di kontrak Core.
            </p>
            <Separator className="bg-foreground/50" />
            <p className="text-sm">**Aksi On-Chain:**</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>`registerProject` (Mint ERC-1155 Token + NFT Proyek)</li>
              <li>`setTokenPrice` (Tetapkan Harga Jual)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* SET TOKEN PRICE SECTION */}
      <div className="mt-12 grid lg:grid-cols-3 gap-8">
        <Card className="col-span-2 border-2 border-foreground bg-carbon-medium/30">
          <CardHeader>
            <CardTitle className="text-xl uppercase font-bold text-foreground flex items-center gap-2">
              <Tag className="size-6 text-carbon-primary" /> Tetapkan Harga
              Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Success Message */}
            {priceSuccessMessage && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded-sm flex items-gap-2">
                <CheckCircle className="size-5 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-600">{priceSuccessMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {priceErrorMessage && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-sm flex items-gap-2">
                <AlertCircle className="size-5 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600">{priceErrorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSetPrice} className="space-y-6">
              {/* Project ID & Price */}
              <div className="space-y-4 p-4 border border-foreground/50 bg-carbon-light/50">
                <Label htmlFor="projectId" className="uppercase font-semibold">
                  Project ID
                </Label>
                <Input
                  id="projectId"
                  type="number"
                  placeholder="1"
                  className="bg-foreground border-foreground"
                  value={priceFormData.projectId}
                  onChange={handlePriceInputChange}
                  disabled={isPriceLoading}
                />

                <Label className="uppercase font-semibold">
                  Harga per Token
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="priceValue"
                    type="number"
                    placeholder="0.001"
                    step="0.000001"
                    className="bg-foreground border-foreground flex-1"
                    value={priceFormData.priceValue}
                    onChange={handlePriceInputChange}
                    disabled={isPriceLoading}
                  />
                  <select
                    id="priceUnit"
                    value={priceFormData.priceUnit}
                    onChange={handlePriceInputChange}
                    disabled={isPriceLoading}
                    className="bg-foreground border-2 border-foreground px-3 py-2 rounded-sm text-carbon-medium uppercase font-semibold cursor-pointer"
                  >
                    <option value="wei">Wei</option>
                    <option value="gwei">Gwei</option>
                    <option value="eth">ETH</option>
                  </select>
                </div>

                {/* Price Preview */}
                {priceFormData.priceValue && (
                  <div className="mt-3 p-3 bg-carbon-primary/20 border border-carbon-primary rounded-sm">
                    <p className="text-xs text-foreground/70 mb-1">
                      Preview Harga dalam Wei:
                    </p>
                    <p className="text-sm font-mono text-carbon-primary font-bold break-all">
                      {getPriceInWei()}
                    </p>
                  </div>
                )}

                <p className="text-xs text-foreground/60 italic mt-2">
                  Conversion Reference: 1 ETH = 10^18 Wei, 1 Gwei = 10^9 Wei
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPriceLoading}
                className="w-full bg-carbon-primary text-carbon-medium hover:bg-carbon-primary/90 uppercase font-extrabold tracking-widest border-2 border-foreground hover:border-carbon-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPriceLoading ? "⏳ Processing..." : "💰 Set Token Price"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-2 border-foreground">
          <CardHeader>
            <CardTitle className="uppercase font-bold flex items-center gap-2">
              <DollarSign className="size-5" /> Price Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-carbon-primary">
                Conversion Reference:
              </p>
              <p className="text-xs mt-1 font-mono">
                0.001 ETH = 1000000000000000 Wei
              </p>
              <p className="text-xs font-mono">
                0.0001 ETH = 100000000000000 Wei
              </p>
              <p className="text-xs font-mono">
                0.00001 ETH = 10000000000000 Wei
              </p>
            </div>
            <Separator className="bg-foreground/50" />
            <div>
              <p className="font-semibold">Langkah:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mt-1 ml-2">
                <li>Input Project ID (dari registerProject)</li>
                <li>Input harga dalam ETH</li>
                <li>Submit transaction</li>
                <li>Confirm di MetaMask</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
