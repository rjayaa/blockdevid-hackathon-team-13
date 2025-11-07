import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/ui/Navbar";
// import WalletConnectButton from '@/components/wallet-connect-button';
// import { usePanna } from 'panna-sdk';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Wallet } from 'lucide-react';

export default function Home() {
  // const { wallet } = usePanna();
  // const router = useRouter();

  // useEffect(() => {
  //   // Redirect to login if user is not connected
  //   if (!wallet) {
  //     router.push('/login');
  //   }
  // }, [wallet, router]);

  // if (!wallet) {
  //   return null; // Prevent flash of content
  // }

  // const walletAddress = wallet?.address || 'N/A';
  
  return <HeroSection />;
}
