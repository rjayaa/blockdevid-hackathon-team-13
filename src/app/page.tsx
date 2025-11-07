'use client';

import HeroSection from "@/components/landing/HeroSection";
import { usePanna } from 'panna-sdk';
import { useRoleBasedRedirect } from '@/hooks/useRoleBasedRedirect';

export default function Home() {
  const { account } = usePanna();
  const { isLoading } = useRoleBasedRedirect();

  // Debug: Log connected address
  if (account?.address) {
    console.log('✓ Wallet Connected - Address:', account.address);
  }

  // If wallet connected, hook will handle redirect
  if (account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{isLoading ? 'Checking your role...' : 'Redirecting...'}</p>
      </div>
    );
  }

  // Show landing page if not connected
  return <HeroSection />;
}
