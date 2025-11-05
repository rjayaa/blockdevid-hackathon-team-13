'use client';

import WalletConnectButton from '@/components/wallet-connect-button';
import { usePanna } from 'panna-sdk';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const { wallet } = usePanna();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if user is already connected
    if (wallet) {
      router.push('/');
    }
  }, [wallet, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-full">
            <Wallet size={32} className="text-blue-600" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
            <p className="text-gray-600">Connect your wallet to continue</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-blue-900 mb-3">How to connect:</h2>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Click the "Connect Wallet" button below</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>Select your wallet (MetaMask, WalletConnect, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Approve the connection on Lisk Sepolia network</span>
              </li>
            </ol>
          </div>

          {/* Connect Button */}
          <div className="flex flex-col gap-4">
            <WalletConnectButton />
            <p className="text-center text-sm text-gray-500">
              Make sure you're on the Lisk Sepolia network
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your wallet is secure. We never have access to your private keys.
          </p>
        </div>
      </div>
    </div>
  );
}
