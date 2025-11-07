import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { callGetAllProjects } from '@/lib/web3Actions';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from '@/lib/contractConfig';

export interface UserProject {
  projectId: number;
  owner: string;
  priceInWei: string;
  metadataUri: string;
  balance: string; // Token balance in the project
}

export function useUserTokenBalances(userAddress: string | undefined) {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserTokenBalances() {
      if (!userAddress) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('📡 Fetching user token balances for:', userAddress);

        // 1. Fetch all projects
        const allProjects = await callGetAllProjects();
        console.log('✅ All projects fetched:', allProjects);

        // 2. Create read-only contract instance for token
        const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');
        const tokenContract = new ethers.Contract(
          TOKEN_CONTRACT_ADDRESS,
          TOKEN_ABI,
          provider
        );

        // 3. Fetch balance for each project
        const userProjectsWithBalance: UserProject[] = [];
        for (const project of allProjects) {
          try {
            const balance = await tokenContract.balanceOf(userAddress, project.projectId);
            const balanceStr = balance.toString();
            console.log(`Balance for project #${project.projectId}: ${balanceStr}`);

            // Only include projects where user has tokens > 0
            if (BigInt(balanceStr) > 0n) {
              userProjectsWithBalance.push({
                ...project,
                balance: balanceStr,
              });
            }
          } catch (err) {
            console.error(`Error fetching balance for project #${project.projectId}:`, err);
          }
        }

        console.log('✅ User projects with balances:', userProjectsWithBalance);
        setProjects(userProjectsWithBalance);
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to fetch token balances';
        console.error('❌ Error fetching user token balances:', errorMsg);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserTokenBalances();
  }, [userAddress]);

  return {
    projects,
    isLoading,
    error,
  };
}
