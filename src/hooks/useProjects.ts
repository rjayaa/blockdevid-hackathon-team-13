import { useState, useEffect } from 'react';
import { callGetAllProjects } from '@/lib/web3Actions';

export interface Project {
  projectId: number;
  owner: string;
  priceInWei: string;
  metadataUri: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('📡 Fetching all projects from blockchain...');

        const data = await callGetAllProjects();

        console.log('✅ Projects fetched:', data);
        setProjects(data);
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to fetch projects';
        console.error('❌ Error fetching projects:', errorMsg);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
  };
}
