import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CORE_CONTRACT_ADDRESS, CORE_ABI, TOKEN_ABI, TOKEN_CONTRACT_ADDRESS } from '@/lib/contractConfig';

export interface UserPurchasedProject {
  projectId: number;
  owner: string;
  priceInWei: string;
  metadataUri: string;
  balance: string; // Token balance untuk project ini
}

export function useUserPurchasedProjects(userAddress: string | undefined) {
  const [projects, setProjects] = useState<UserPurchasedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserPurchasedProjects() {
      if (!userAddress) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('📡 Fetching user purchased projects for:', userAddress);

        // 1. Create read-only contract instance
        const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');
        const coreContract = new ethers.Contract(
          CORE_CONTRACT_ADDRESS,
          CORE_ABI,
          provider
        );
        const tokenContract = new ethers.Contract(
          TOKEN_CONTRACT_ADDRESS,
          TOKEN_ABI,
          provider
        );

        // 2. Call getProjectsByUserAddress() untuk dapat array project IDs
        console.log('🔍 Calling getProjectsByUserAddress with address:', userAddress);
        console.log('🔍 Core Contract Address:', CORE_CONTRACT_ADDRESS);
        const projectIds = await coreContract.getProjectsByUserAddress(userAddress);
        console.log('✅ User purchased project IDs:', projectIds);
        console.log('✅ Project IDs count:', projectIds.length);

        // 3. Fetch details untuk setiap project
        const userProjects: UserPurchasedProject[] = [];
        for (const projectId of projectIds) {
          try {
            // Get project details from contract
            const projectIdNum = Number(projectId);
            const project = await coreContract.projects(projectIdNum);

            // Get user's balance for this project
            const balance = await tokenContract.balanceOf(userAddress, projectIdNum);

            userProjects.push({
              projectId: projectIdNum,
              owner: project.owner,
              priceInWei: project.priceInWei.toString(),
              metadataUri: project.metadataUri,
              balance: balance.toString(),
            });

            console.log(`✅ Fetched details for project #${projectIdNum}`);
          } catch (err) {
            console.error(`Error fetching details for project #${projectId}:`, err);
          }
        }

        console.log('✅ All user purchased projects with details:', userProjects);
        setProjects(userProjects);
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to fetch purchased projects';
        console.error('❌ Error fetching user purchased projects:', errorMsg);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserPurchasedProjects();
  }, [userAddress]);

  return {
    projects,
    isLoading,
    error,
  };
}
