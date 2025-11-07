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
        <div className="container mx-auto pb-12 px-4 md:px-8">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-destructive pb-2 text-destructive">
                Klaim Offset &amp; Pensiun Token
            </h1>
            <p className="text-sm text-foreground/80 mb-8 font-space">
                Proses ini akan **membakar** Token Kredit Karbon Anda dan mencetak **Sertifikat Penebusan NFT** sebagai bukti audit.
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="col-span-2 border-2 border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-xl uppercase font-bold text-destructive flex items-center gap-2">
                            <Zap className="size-6" /> Formulir Pensiun Token
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRetire} className="space-y-6">
                            
                            {/* Token Selection & Amount */}
                            <div className="space-y-4 p-4 border border-destructive/50 bg-foreground">
                                <h3 className='font-extrabold text-lg uppercase'>Token Dipilih</h3>
                                <p className='text-sm'>**{projectDetails?.name}** (Token ID: {tokenToRetire.tokenId})</p>
                                <p className='text-sm'>Saldo Anda: **{tokenToRetire.balance.toLocaleString()} TONS**</p>
                                <Separator className='bg-foreground/50'/>
                                <Label htmlFor="amount" className="uppercase font-semibold text-foreground">Jumlah yang Dibakar (TONS)</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    placeholder="Contoh: 400" 
                                    min={1} 
                                    max={tokenToRetire.balance} 
                                    className="bg-foreground border-foreground" 
                                />
                            </div>

                            {/* Retirement Details */}
                            <div className="space-y-4 p-4 border border-destructive/50 bg-foreground">
                                <Label htmlFor="purpose" className="uppercase font-semibold">Tujuan Pensiun (Untuk Audit)</Label>
                                <Input id="purpose" placeholder="Offset Emisi Tahunan 2025" className="bg-foreground border-foreground" />
                                
                                <Label htmlFor="notes" className="uppercase font-semibold">Keterangan Tambahan (IPFS URI)</Label>
                                <Textarea id="notes" placeholder="Tautan ke laporan audit internal atau dokumen klaim ESG." className="bg-foreground border-foreground" />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-destructive text-foreground hover:bg-destructive/90 uppercase font-extrabold tracking-widest border-2 border-foreground hover:border-destructive"
                            >
                                Bakar {400} Token &amp; Mint Sertifikat NFT
                                <FireExtinguisher className="size-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-2 border-foreground bg-carbon-medium/50">
                    <CardHeader>
                        <CardTitle className="uppercase font-bold text-foreground">
                            Detail Proses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 font-space text-sm">
                        <p>**Fungsi SC:** `retireTokens(projectId, amount, retirementUri)`</p>
                        <p>**Aksi 1:** Memanggil `tokenContract.burn()` untuk mengurangi saldo ERC-1155 Anda secara permanen.</p>
                        <p>**Aksi 2:** Memanggil `proofContract.safeMint()` untuk mencetak NFT bukti audit (ERC-721) ke *wallet* Anda.</p>
                        <p>**Gas:** Transaksi ini **Gasless** (disponsori oleh Panna SDK).</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}