// src/app/(main)/marketplace/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DUMMY_PROJECTS, Project } from '@/lib/types';
import { ShoppingCart, DollarSign } from 'lucide-react';

const MarketplaceCard = ({ project }: { project: Project }) => {
    const handleBuy = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const amount = form.amount.value;
        alert(`Dummy Action: Buying ${amount} TONS of ${project.name} (Call SC buyTokens)`);
    };

    return (
        <Card className="border-2 border-foreground hover:shadow-xl transition-all bg-carbon-light/70">
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
                        className="bg-foreground border-foreground"
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
    const availableProjects = DUMMY_PROJECTS.filter(p => p.isForSale);

    return (
        <div className="container mx-auto pb-12 px-4 md:px-8">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-foreground pb-2">
                Marketplace CarbonFi
            </h1>
            <p className="text-sm text-foreground/80 mb-8 font-space">
                Browse, verifikasi, dan beli kredit karbon yang tersedia dari proyek-proyek Indonesia.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableProjects.map((project) => (
                    <MarketplaceCard key={project.projectId} project={project} />
                ))}
            </div>
        </div>
    );
}