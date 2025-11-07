import { ethers } from 'ethers';
import { CORE_CONTRACT_ADDRESS, CORE_ABI } from '@/lib/contractConfig';

const RPC_URL = 'https://rpc.sepolia-api.lisk.com';

/**
 * Check if user has VERIFIER_ROLE in CarbonFiCore contract
 */
export async function checkVerifierRole(userAddress: string): Promise<boolean> {
  try {
    console.log('📡 Checking VERIFIER_ROLE on Lisk Sepolia');
    console.log('   Contract Address:', CORE_CONTRACT_ADDRESS);
    console.log('   User Address:', userAddress);
    console.log('   RPC:', RPC_URL);

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const contract = new ethers.Contract(
      CORE_CONTRACT_ADDRESS,
      CORE_ABI,
      provider
    );

    // Generate VERIFIER_ROLE hash
    const VERIFIER_ROLE = ethers.id('VERIFIER_ROLE');
    console.log('   VERIFIER_ROLE hash:', VERIFIER_ROLE);

    // Check if user has role
    const hasRole = await contract.hasRole(VERIFIER_ROLE, userAddress);
    console.log('   ✓ hasRole result:', hasRole);

    return hasRole;
  } catch (error) {
    console.error('❌ Error checking verifier role:', error);
    return false;
  }
}
