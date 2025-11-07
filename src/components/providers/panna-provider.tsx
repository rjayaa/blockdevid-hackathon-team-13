'use client';

import { PannaProvider } from 'panna-sdk';
import { ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

export default function PannaProviderComponent({ children }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PANNA_CLIENT_ID;
  const partnerId = process.env.NEXT_PUBLIC_PANNA_PARTNER_ID;
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '4202'; // Lisk Sepolia

  useEffect(() => {
    console.log('🔗 Panna Provider initialized');
    console.log('   Expected Chain ID: 4202 (Lisk Sepolia)');
    console.log('   Configured Chain ID:', parseInt(chainId));

    // Detect current MetaMask network
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const currentChainId = (window as any).ethereum.chainId;
      console.log('   Current MetaMask Network Chain ID:', currentChainId);
      console.log('   Current MetaMask Network Hex:', currentChainId ? parseInt(currentChainId, 16) : 'unknown');

      // Show network name
      const chainIdNum = currentChainId ? parseInt(currentChainId, 16) : null;
      const networkName = getNetworkName(chainIdNum);
      console.log('   Current Network Name:', networkName);

      // Check if on correct network
      if (chainIdNum !== 4202) {
        console.warn('   ⚠️ WRONG NETWORK! Expected Lisk Sepolia (4202), got:', networkName);
      } else {
        console.log('   ✓ Correct network: Lisk Sepolia');
      }
    }
  }, [chainId]);

  if (!clientId || !partnerId) {
    console.error(
      'Missing Panna SDK credentials. Please set NEXT_PUBLIC_PANNA_CLIENT_ID and NEXT_PUBLIC_PANNA_PARTNER_ID in .env.local'
    );
  }

  return (
    <PannaProvider
      clientId={clientId || ''}
      partnerId={partnerId || ''}
      chainId={parseInt(chainId)} // Set default to Lisk Sepolia (4202)
    >
      {children}
    </PannaProvider>
  );
}

function getNetworkName(chainId: number | null): string {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 11155111:
      return 'Ethereum Sepolia';
    case 4202:
      return 'Lisk Sepolia (CORRECT)';
    case 1135:
      return 'Lisk Mainnet';
    default:
      return `Unknown (${chainId})`;
  }
}
