// src/app/(main)/retire/page.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Zap, FireExtinguisher } from 'lucide-react';
import { DUMMY_PROJECTS, DUMMY_USER_TOKENS, Project } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const getProjectDetails = (tokenId: number): Project | undefined => {
    return DUMMY_PROJECTS.find(p => p.projectId === tokenId);
}

export default function RetirementPage() {
    const handleRetire = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Dummy Action: Tokens Burned and Certificate Pensiun Minted (Call SC retireTokens)');
    };

    const tokenToRetire = DUMMY_USER_TOKENS[0]; 
    const projectDetails = getProjectDetails(tokenToRetire.tokenId);

    return (
        <div className="pb-12 px-4 md:px-8">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-carbon-primary pb-2 text-carbon-primary">
                Klaim Offset &amp; Pensiun Token
            </h1>
            <p className="text-sm text-foreground/80 mb-8 font-space">
                Proses ini akanmembakarToken Kredit Karbon Anda dan mencetakSertifikat Penebusan NFTsebagai bukti audit.
            </p>

            <div className="">
                <Card className="col-span-2 border-2 border-carbon-primary bg-carbon-primary/10">
                    <CardHeader>
                        <CardTitle className="text-xl uppercase font-bold text-carbon-primary flex items-center gap-2">
                            <Zap className="size-6" /> Formulir Pensiun Token
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRetire} className="grid grid-cols-12 gap-2">
                            
                            {/* Token Selection & Amount */}
                            <div className="space-y-4 p-4 border border-carbon-primary/50 rounded-sm bg-foreground text-carbon-medium col-span-6">
                                <h3 className='font-extrabold text-lg uppercase'>Token Dipilih</h3>
                                <p className='text-sm'>{projectDetails?.name}(Token ID: {tokenToRetire.tokenId})</p>
                                <p className='text-sm'>Saldo Anda:{tokenToRetire.balance.toLocaleString()} TONS</p>
                                <Separator className='bg-carbon-medium/50'/>
                                <Label htmlFor="amount" className="uppercase font-semibold text-carbon-medium">Jumlah yang Dibakar (TONS)</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="Contoh: 400" 
                                    min={1} 
                                    max={tokenToRetire.balance} 
                                    className="bg-carbon-medium border-carbon-medium text-carbon-primary" 
                                />
                            </div>

                            {/* Retirement Details */}
                            <div className="m-0 p-4 border border-carbon-primary/50 bg-foreground rounded-sm text-carbon-medium col-span-6">
                                <Label htmlFor="purpose" className="uppercase font-semibold">Tujuan Pensiun (Untuk Audit)</Label>
                                <Input id="purpose" placeholder="Offset Emisi Tahunan 2025" className="bg-carbon-medium border-foreground text-carbon-primary" />
                                
                                <Label htmlFor="notes" className="uppercase font-semibold">Keterangan Tambahan (IPFS URI)</Label>
                                <Textarea id="notes" placeholder="Tautan ke laporan audit internal atau dokumen klaim ESG." className="bg-carbon-medium border-foreground text-carbon-primary" />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-carbon-primary text-carbon-medium hover:bg-carbon-primary/90 uppercase font-semibold tracking-widest border-2 border-foreground hover:border-carbon-primary col-span-12"
                            >
                                Bakar {400} Token &amp; Mint Sertifikat NFT
                                <FireExtinguisher className="size-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}