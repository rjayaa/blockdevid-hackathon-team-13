import { ethers } from 'ethers';
import { CORE_ABI, CORE_CONTRACT_ADDRESS } from '@/lib/contractConfig';

const RPC_URL = 'https://rpc.sepolia-api.lisk.com';

/**
 * Check if user has VERIFIER_ROLE in CarbonFiCore contract
 */
export async function checkVerifierRole(userAddress: string): Promise<boolean> {
  try {
    console.log('========== 📡 CHECKING VERIFIER_ROLE ==========');
    console.log('   User Address:', userAddress);
    console.log('   User Address (lowercase):', userAddress.toLowerCase());
    console.log('   Contract Address:', CORE_CONTRACT_ADDRESS);
    console.log('   Contract Address (lowercase):', CORE_CONTRACT_ADDRESS.toLowerCase());
    console.log('   RPC URL:', RPC_URL);

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log('   ✓ Provider created');

    // Validate ABI
    console.log('   📋 ABI details:');
    console.log('      - ABI is array:', Array.isArray(CORE_ABI));
    console.log('      - ABI length:', CORE_ABI?.length);
    const hasRoleFunc = CORE_ABI?.find((item: any) => item.name === 'hasRole');
    console.log('      - hasRole function found:', !!hasRoleFunc);
    if (hasRoleFunc) {
      console.log('      - hasRole function signature:', JSON.stringify(hasRoleFunc));
    }

    const contract = new ethers.Contract(
      CORE_CONTRACT_ADDRESS,
      CORE_ABI,
      provider
    );
    console.log('   ✓ Contract instance created');

    // Generate VERIFIER_ROLE hash
    const VERIFIER_ROLE = ethers.id('VERIFIER_ROLE');
    console.log('   🔐 VERIFIER_ROLE hash:', VERIFIER_ROLE);
    console.log('   🔐 Expected hash (from CarbonFiCore.sol):', '0x0ce23c3e399818cfee81a7ab0880f714e53d7672b08df0fa62f2843416e1ea09');

    // Check if user has role
    console.log('   🔍 Calling contract.hasRole()...');
    console.log('   Parameters:');
    console.log('      - role:', VERIFIER_ROLE);
    console.log('      - account:', userAddress);

    const hasRole = await contract.hasRole(VERIFIER_ROLE, userAddress);

    console.log('   ✓ hasRole result:', hasRole);
    console.log('   ✓ Type of hasRole:', typeof hasRole);
    console.log('   ✓ Boolean value:', Boolean(hasRole));

    if (!hasRole) {
      console.warn('   ⚠️ User does NOT have VERIFIER_ROLE');
    } else {
      console.log('   ✅ User HAS VERIFIER_ROLE');
    }

    console.log('========== ✓ CHECK COMPLETE ==========');
    return hasRole;
  } catch (error) {
    console.error('========== ❌ ERROR CHECKING VERIFIER_ROLE ==========');
    console.error('   Error:', error);
    console.error('   Error message:', (error as any)?.message);
    console.error('   Error code:', (error as any)?.code);
    console.error('   Full error object:', JSON.stringify(error, null, 2));
    console.error('========== ❌ ERROR END ==========');
    return false;
  }
}
