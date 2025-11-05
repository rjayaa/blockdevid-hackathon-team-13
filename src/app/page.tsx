'use client';

import WalletConnectButton from '@/components/wallet-connect-button';
import { usePanna } from 'panna-sdk';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';

export default function Home() {
  const { wallet } = usePanna();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not connected
    if (!wallet) {
      router.push('/login');
    }
  }, [wallet, router]);

  if (!wallet) {
    return null; // Prevent flash of content
  }

  const walletAddress = wallet?.address || 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BlockDevID</h1>
            <p className="text-sm text-gray-600">Web3 Integration Dashboard</p>
          </div>
          <WalletConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600">Your wallet is connected</p>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-blue-900 font-semibold mb-2">Wallet Address</p>
                <p className="font-mono text-sm bg-white p-3 rounded border border-blue-200 break-all">
                  {walletAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-900 font-semibold mb-2">Network</p>
                <p className="font-mono text-sm bg-white p-3 rounded border border-blue-200">
                  Lisk Sepolia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-2xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connected</h3>
            <p className="text-gray-600 text-sm">Your wallet is successfully connected to the application.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-2xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600 text-sm">All interactions are protected by smart contracts and blockchain security.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-2xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast</h3>
            <p className="text-gray-600 text-sm">Transactions are processed quickly on the Lisk Sepolia network.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-sm">
            BlockDevID © 2024. Web3 Integration powered by Panna SDK
          </p>
        </div>
      </footer>
    </div>
  );
}
