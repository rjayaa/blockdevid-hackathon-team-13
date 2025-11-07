// src/app/(main)/marketplace/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DUMMY_PROJECTS, Project } from '@/lib/types';
import { ShoppingCart, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ethers } from 'ethers';

// Component untuk Blockchain Project Data
const BlockchainProjectCard = ({
  projectId,
  owner,
  priceInWei,
  metadataUri
}: {
  projectId: number;
  owner: string;
  priceInWei: string;
  metadataUri: string;
}) => {
    const handleBuy = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        alert(`[TODO] Buying ${amount} TONS from Project #${projectId} (Call SC buyTokens)`);
    };

    // Convert priceInWei to ETH
    const priceInEth = ethers.formatEther(priceInWei);
    const isForSale = BigInt(priceInWei) > 0n;

    return (
        <Card className="border-2 border-foreground hover:shadow-xl transition-all bg-carbon-medium/70">
            <CardHeader>
                <CardTitle className="uppercase text-lg font-bold">Project #{projectId}</CardTitle>
                <CardDescription className="text-xs text-foreground/60 font-mono truncate">
                    Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <p className="text-xs text-foreground/70 mb-1">Metadata URI:</p>
                    <p className="text-xs font-mono truncate text-carbon-primary">{metadataUri}</p>
                </div>
                <p className="text-sm font-semibold flex items-center gap-1">
                    <DollarSign className="size-4" /> {priceInEth} ETH per Token
                </p>
                <p className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full w-fit ${isForSale ? 'bg-green-600 text-foreground' : 'bg-red-600 text-foreground'}`}>
                    {isForSale ? 'For Sale' : 'Not For Sale'}
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                {isForSale && (
                    <form onSubmit={handleBuy} className="flex flex-col space-y-2 w-full">
                        <Input
                            name="amount"
                            type="number"
                            placeholder="Jumlah Beli"
                            defaultValue={100}
                            min={1}
                            className="bg-carbon-medium border-foreground"
                        />
                        <Button
                            type="submit"
                            className="w-full bg-foreground text-carbon-medium hover:bg-foreground/80 uppercase font-bold tracking-widest"
                        >
                            Beli Token
                            <ShoppingCart className="size-4" />
                        </Button>
                    </form>
                )}
            </CardFooter>
        </Card>
    )
}

// Component untuk Dummy Project Data (backward compatible)
const MarketplaceCard = ({ project }: { project: Project }) => {
    const handleBuy = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        alert(`Dummy Action: Buying ${amount} TONS of ${project.name} (Call SC buyTokens)`);
    };

    return (
        <Card className="border-2 border-foreground hover:shadow-xl transition-all bg-carbon-medium/70">
            <CardHeader>
                <CardTitle className="uppercase text-lg font-bold">{project.name}</CardTitle>
                <CardDescription className="text-sm text-foreground/80 font-space">{project.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-2xl font-extrabold text-carbon-primary">{project.co2Amount.toLocaleString()} TONS</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                    <DollarSign className="size-4" /> {project.pricePerTon} ETH per Ton
                </p>
                <p className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full w-fit ${project.type === 'Mangrove' ? 'bg-blue-400 text-foreground' : 'bg-green-400 text-foreground'}`}>
                    {project.type}
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                <form onSubmit={handleBuy} className="flex flex-col space-y-2 w-full">
                    <Input
                        name="amount"
                        type="number"
                        placeholder="Jumlah Beli (Ton)"
                        defaultValue={100}
                        min={1}
                        className="bg-carbon-medium border-foreground"
                    />
                    <Button
                        type="submit"
                        disabled={!project.isForSale}
                        className="w-full bg-foreground text-carbon-medium hover:bg-foreground/80 uppercase font-bold tracking-widest"
                    >
                        {project.isForSale ? `Beli Token (Call SC)` : 'Sold Out'}
                        <ShoppingCart className="size-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}

export default function MarketplacePage() {
    // Fetch blockchain projects
    const { projects: blockchainProjects, isLoading, error } = useProjects();
    const dummyProjects = DUMMY_PROJECTS.filter(p => p.isForSale);

    return (
        <div className=" pb-12 px-4 md:px-8">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-foreground pb-2">
                Marketplace CarbonFi
            </h1>
            <p className="text-sm text-foreground/80 mb-8 font-space">
                Browse, verifikasi, dan beli kredit karbon yang tersedia dari proyek-proyek Indonesia.
            </p>

            {/* BLOCKCHAIN PROJECTS SECTION */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-2xl font-bold tracking-widest uppercase">Proyek Blockchain</h2>
                    {isLoading && <Loader2 className="size-5 animate-spin text-carbon-primary" />}
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-600 rounded-sm mb-6">
                        <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="text-red-600 font-semibold">Error Fetching Projects</p>
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader2 className="size-8 animate-spin text-carbon-primary mx-auto mb-2" />
                            <p className="text-foreground/60">Fetching projects dari blockchain...</p>
                        </div>
                    </div>
                ) : blockchainProjects.length === 0 ? (
                    <div className="text-center py-8 text-foreground/60">
                        <p>Tidak ada proyek yang terdaftar di blockchain</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blockchainProjects.map((project) => (
                            <BlockchainProjectCard
                                key={project.projectId}
                                projectId={project.projectId}
                                owner={project.owner}
                                priceInWei={project.priceInWei}
                                metadataUri={project.metadataUri}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* DUMMY PROJECTS SECTION (for reference) */}
            <section>
                <h2 className="text-2xl font-bold tracking-widest uppercase mb-6">Proyek Demo (Dummy Data)</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dummyProjects.map((project) => (
                        <MarketplaceCard key={project.projectId} project={project} />
                    ))}
                </div>
            </section>
        </div>
    );
}