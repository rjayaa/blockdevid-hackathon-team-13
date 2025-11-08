// src/app/(main)/dashboard/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DUMMY_CERTIFICATES, DUMMY_USER_TOKENS, Project, DUMMY_PROJECTS, Certificate } from '@/lib/types';
import { ArrowRight, Globe, Lock, Leaf, X, Loader2 } from 'lucide-react';
import { UserAsset } from '@/lib/types';
import Link from 'next/link';
import { useActiveAccount } from 'panna-sdk';
import { useRouter } from 'next/navigation';


const DUMMY_USER_ADDRESS = '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'; // NGO A or Company B
// Helper to find project details (simulates IPFS lookup)
const getProjectDetails = (tokenId: number): Project | undefined => {
    return DUMMY_PROJECTS.find(p => p.projectId === tokenId);
}

// Asset Card Component
const AssetCard = ({ asset }: { asset: UserAsset }) => {
    const router = useRouter()
    const project = getProjectDetails(asset.tokenId);

    if (!project) return null;

    return (
        <Card className="border-2 border-foreground hover:shadow-2xl transition-all bg-carbon-medium/70">
            <CardHeader>
                <CardTitle className="uppercase text-lg font-bold tracking-wider">{project.name}</CardTitle>
                <CardDescription className="text-sm text-foreground/80 font-space">{project.location}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-extrabold text-carbon-primary">{asset.balance.toLocaleString()} TONS</p>
                <p className="text-xs text-foreground/70 mt-1">{project.type}</p>
            </CardContent>
            {/* <CardFooter className="flex justify-between pt-4">
                <div></div>
                <Button
                    variant="outline"
                    className="border-2 border-foreground bg-transparent hover:bg-carbon-medium uppercase text-xs font-bold"
                    onClick={() => { router.push("/retire") }}
                >
                    Retire Tokens
                </Button>
            </CardFooter> */}
        </Card>
    )
}

// Certificate NFT Card Component
const CertificateCard = ({ cert }: { cert: Certificate }) => {
    const isRetired = cert.type === 'Pensiun';
    const Icon = isRetired ? Lock : Leaf;
    const certTypeStyle = isRetired ? 'bg-destructive text-foreground border-destructive' : 'bg-carbon-primary text-carbon-medium border-carbon-primary';

    return (
        <Card className="border-2 border-foreground bg-carbon-medium/70 hover:shadow-xl transition-all">
            <CardHeader className="p-4 border-b-2 border-carbon-primary">
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                    <Icon className={`size-5 p-0.5 rounded-sm ${certTypeStyle}`} />
                    {cert.type === 'Pensiun' ? 'Sertifikat Penebusan' : 'Sertifikat Proyek'}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <p className="text-sm font-semibold truncate">{cert.projectName}</p>
                <p className="text-xl font-bold">{cert.co2Amount.toLocaleString()} TONS</p>
            </CardContent>
            {/* <CardFooter className="p-4 pt-0">
                <Link href={`/certificate/${cert.certId}`} className="text-xs uppercase font-bold text-carbon-primary hover:text-foreground/80 flex items-center gap-1">
                    Lihat Bukti Audit <ArrowRight className="size-3" />
                </Link>
            </CardFooter> */}
        </Card>
    )
}


export default function UserDashboard() {
  const account = useActiveAccount();

  if (!account?.address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please connect your wallet to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="pb-12 px-8">
      <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-foreground pb-2">
        Dashboard Aset Saya
      </h1>
      <p className="text-sm text-foreground/80 mb-8 font-space">
        Wallet Address: {account.address.slice(0, 10)}...{account.address.slice(-8)}
      </p>

      {/* Token Credits (ERC-1155) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
            <Globe className="size-6" /> Token Kredit Karbon (ERC-1155)
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            {DUMMY_USER_TOKENS.map((asset) => (
                <AssetCard key={asset.tokenId} asset={asset} />
            ))}
        </div>
      </section>

      {/* Certificates (ERC-721/NFT) */}
      <section>
        <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
            <X className="size-6" /> Sertifikat Bukti (NFT)
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            {DUMMY_CERTIFICATES.map((cert) => (
                <CertificateCard key={cert.certId} cert={cert} />
            ))}
        </div>
      </section>
    </div>
  );
}