"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePanna } from "panna-sdk";
import { checkVerifierRole } from "@/lib/contract-service";

export function useRoleBasedRedirect() {
  const { account } = usePanna();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<"verifier" | "user" | null>(null);

  useEffect(() => {
    async function checkAndRedirect() {
      // Wait a bit for wallet to fully load
      if (!account?.address) {
        console.log("⚠️ No wallet address found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔍 Checking VERIFIER_ROLE for:", account.address);
        const isVerifier = await checkVerifierRole(account.address);

        if (isVerifier) {
          console.log("✓ User IS VERIFIER - Redirecting to /admin");
          setUserRole("verifier");
          router.push("/(main)/admin");
        } else {
          console.log("✓ User is REGULAR USER - Redirecting to /dashboard");
          setUserRole("user");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("❌ Error checking role:", error);
        setUserRole("user");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      checkAndRedirect();
    }, 500); // Small delay to ensure wallet is ready

    return () => clearTimeout(timer);
  }, [account?.address, router]);

  return { isLoading, userRole };
}
