// src/app/(main)/retire/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Flame,
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { DUMMY_PROJECTS, DUMMY_USER_TOKENS, Project } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useActiveAccount } from "panna-sdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { callRetireTokens } from "@/lib/web3Actions";
import { ethers } from "ethers";
import Link from "next/link";

const getProjectDetails = (tokenId: number): Project | undefined => {
  return DUMMY_PROJECTS.find((p) => p.projectId === tokenId);
};

export default function RetirementPage() {
  const account = useActiveAccount();
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    projectId: "",
    amount: "",
    retirementUri: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if user connected
  useEffect(() => {
    if (!account?.address) {
      console.log("⚠️ No account address found");
    }
  }, [account?.address]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRetire = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.projectId || !formData.amount || !formData.retirementUri) {
        throw new Error("Semua field harus diisi");
      }

      if (!account?.address) {
        throw new Error(
          "Wallet tidak terdeteksi. Pastikan sudah connect dengan Panna SDK",
        );
      }

      console.log("🔥 Retiring tokens with data:", formData);

      // Get signer dari connected wallet
      if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("MetaMask/Panna wallet not detected");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      console.log("✓ Signer obtained from connected wallet");

      // Call smart contract function
      const txHash = await callRetireTokens(
        signer,
        parseInt(formData.projectId),
        parseInt(formData.amount),
        formData.retirementUri,
      );

      // Success
      setSuccessMessage(`✓ Tokens retired successfully! TX: ${txHash}`);
      console.log("✓ Transaction successful:", txHash);

      // Reset form
      setFormData({
        projectId: "",
        amount: "",
        retirementUri: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      const errorMsg = error?.message || "Unknown error occurred";
      console.error("❌ Error retiring tokens:", error);
      setErrorMessage(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account?.address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">⚠️ Wallet Not Connected</p>
          <p className="text-sm text-carbon-primary">
            Please connect your wallet first
          </p>
        </div>
      </div>
    );
  }

  const tokenToRetire = DUMMY_USER_TOKENS[0];
  const projectDetails = getProjectDetails(tokenToRetire.tokenId);

  return (
    <div className="pb-12 px-4 md:px-8">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-carbon-primary hover:text-carbon-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-primary pb-2">
        Retire Tokens{" "}
        <span className="text-carbon-medium text-xl">(BURN & NFT PROOF)</span>
      </h1>
      <p className="text-sm text-carbon-primary/80 mb-8 font-space">
        Bakar token karbon Anda dan dapatkan Sertifikat Pensiun (NFT) sebagai
        bukti audit.
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="col-span-2 border-2 border-carbon-primary bg-carbon-medium/30">
          <CardHeader>
            <CardTitle className="text-xl uppercase font-bold text-carbon-primary flex items-center gap-2">
              <Flame className="size-6 text-primary" /> Retire Tokens Form
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

            <form onSubmit={handleRetire} className="space-y-6">
              {/* Project ID */}
              <div className="space-y-4 p-4 border border-carbon-primary/50 bg-carbon-light/50">
                <Label htmlFor="projectId" className="uppercase font-semibold">
                  Project ID
                </Label>
                <Input
                  id="projectId"
                  type="number"
                  placeholder="1"
                  className="bg-carbon-primary border-carbon-primary text-carbon-light"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Amount */}
              <div className="space-y-4 p-4 border border-carbon-primary/50 bg-carbon-light/50">
                <Label htmlFor="amount" className="uppercase font-semibold">
                  Jumlah Token yang Di-Retire (Burn)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  className="bg-carbon-primary border-carbon-primary text-carbon-light"
                  value={formData.amount}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-carbon-primary italic">
                  ⚠️ Token akan dibakar (burned) dan tidak bisa dikembalikan
                </p>
              </div>

              {/* Retirement URI */}
              <div className="space-y-4 p-4 border border-carbon-primary/50 bg-carbon-light/50">
                <Label
                  htmlFor="retirementUri"
                  className="uppercase font-semibold flex items-center gap-2"
                >
                  <Upload className="size-4" /> Retirement Proof URI (IPFS)
                </Label>
                <Textarea
                  id="retirementUri"
                  placeholder="ipfs://QmProof123... (link ke dokumen pensiun/audit)"
                  className="bg-carbon-primary border-carbon-primary text-carbon-light"
                  value={formData.retirementUri}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-carbon-primary italic">
                  Link ke dokumen pensiun di IPFS (sertifikat, audit report,
                  dll)
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-carbon-primary text-carbon-light hover:bg-carbon-primary/90 uppercase font-semibold tracking-widest border-2 border-carbon-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Retire & Burn Tokens"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-2 border-carbon-primary bg-carbon-light/50">
          <CardHeader>
            <CardTitle className="uppercase font-bold flex items-center gap-2">
              <Flame className="size-5 text-primary" /> Retire Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-primary">⚠️ Warning:</p>
              <p className="text-xs mt-1">
                Token yang di-retire AKAN DIBAKAR dan tidak bisa dikembalikan!
              </p>
            </div>
            <Separator className="bg-carbon-primary/50" />
            <div>
              <p className="font-semibold">Proses Retire:</p>
              <ol className="list-decimal list-inside text-xs space-y-1 mt-1 ml-2">
                <li>Input Project ID dan jumlah</li>
                <li>Input link ke dokumen bukti</li>
                <li>Submit transaction</li>
                <li>Confirm di MetaMask</li>
                <li>Tokens dibakar (burned)</li>
                <li>Dapatkan Sertifikat Pensiun (NFT)</li>
              </ol>
            </div>
            <Separator className="bg-carbon-primary/50" />
            <div>
              <p className="font-semibold">Output:</p>
              <p className="text-xs mt-1">
                ✓ Tokens dibakar dari wallet
                <br />
                ✓ NFT Sertifikat Pensiun di-mint
                <br />✓ TX Hash disimpan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
