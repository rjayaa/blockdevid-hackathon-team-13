"use client";

import React, { useState, useRef, useEffect } from "react";
import { useActiveAccount } from "panna-sdk";
import { LoginButton } from "panna-sdk";
import { useActiveWallet, useDisconnect } from "thirdweb/react";
import Link from "next/link";

function getNetworkNameNavbar(chainId: number | null): string {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 11155111:
      return "Ethereum Sepolia";
    case 4202:
      return "Lisk Sepolia (CORRECT)";
    case 1135:
      return "Lisk Mainnet";
    default:
      return `Unknown (${chainId})`;
  }
}

// Admin address - harus sama dengan address yang punya VERIFIER_ROLE di smart contract
const VERIFICATOR_ADDRESS =
  "0x14C7F1d75e8B74618D77E6eE5A830EeE7D7FB64F".toLowerCase();

const Navbar = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userAddress = account?.address?.toLowerCase() || "";
  const isAdmin = userAddress === VERIFICATOR_ADDRESS;

  // Debug: Log account info and network
  useEffect(() => {
    if (account?.address) {
      console.log("📍 Navbar - Connected Address:", account.address);
      console.log("🔐 Expected Admin Address:", VERIFICATOR_ADDRESS);
      console.log("✓ Is Admin?", isAdmin);

      // Detect current network
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const currentChainId = (window as any).ethereum.chainId;
        const chainIdNum = currentChainId ? parseInt(currentChainId, 16) : null;
        console.log("🌐 Current Network Chain ID:", chainIdNum);
        console.log("🌐 Current Network Name:", getNetworkNameNavbar(chainIdNum));

        if (chainIdNum !== 4202) {
          console.warn(
            "⚠️ WARNING: Connected to wrong network! Expected Lisk Sepolia (4202), got:",
            getNetworkNameNavbar(chainIdNum)
          );
        } else {
          console.log("✓ Connected to correct network: Lisk Sepolia");
        }
      }
    }
  }, [account?.address, isAdmin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center fixed top-5 px-8 w-full z-50">
      <Link
        href="/"
        className="text-lg tracking-wider px-4 py-2 bg-foreground text-carbon-medium rounded-sm hover:bg-carbon-primary hover:text-carbon-light transition-colors duration-300"
      >
        PORCE
      </Link>

      <nav className="flex space-x-6 text-sm uppercase items-center font-space">
        {/* Navigation Links */}
        {account && (
          <>
            <Link
              href="/dashboard"
              className="hover:text-carbon-primary transition-colors duration-200 border-b border-transparent hover:border-carbon-primary pb-0.5"
            >
              Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="hover:text-carbon-primary transition-colors duration-200 border-b border-transparent hover:border-carbon-primary pb-0.5"
            >
              Marketplace
            </Link>
          </>
        )}

        {/* Admin Link (RBAC Simulation) */}
        {isAdmin && (
          <Link
            href="/admin"
            className="text-destructive font-bold hover:text-destructive/80 transition-colors duration-200 border-b-2 border-destructive pb-0.5"
          >
            Admin Portal
          </Link>
        )}

        {!account ? (
          <div className="panna-login-button-wrapper">
            <style>{`
                        .panna-login-button-wrapper button {
                            background-color: #043915 !important;
                            color: #B0CE88 !important;
                            border: 2px solid #043915 !important;
                            padding: 4px 8px !important;
                            border-radius: 4px !important;
                            text-transform: uppercase !important;
                            font-size: 14px !important;
                            font-weight: 500 !important;
                            letter-spacing: 0.05em !important;
                            transition: all 0.3s ease !important;
                            min-width: 100px !important;
                            min-height: 32px !important;
                        }
                        .panna-login-button-wrapper button:hover {
                            background-color: #B0CE88 !important;
                            color: #043915 !important;
                            border-color: #043915 !important;
                        }
                    `}</style>
            <LoginButton />
          </div>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-sm px-4 py-2 text-foreground rounded-sm border-2 border-foreground uppercase tracking-wider font-medium cursor-pointer transition-opacity hover:opacity-80"
            >
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-foreground border-2 border-carbon-medium rounded-sm shadow-lg z-50">
                <button
                  onClick={() => {
                    if (wallet) {
                      disconnect(wallet);
                      setIsDropdownOpen(false);
                    }
                  }}
                  className="w-full text-left px-6 py-3 text-sm text-carbon-medium hover:bg-carbon-medium hover:text-carbon-primary uppercase tracking-wider font-medium transition-colors foregroundspace-nowrap"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
