// src/app/(main)/admin/page.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Upload, ShieldCheck, Zap } from 'lucide-react';

const DUMMY_ADMIN_ADDRESS = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; // Verificator Address

export default function AdminDashboard() {
  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Dummy Action: Project Registered, Metadata Uploaded to Pinata (Simulation)');
  };

  return (
    <div className="container mx-auto pb-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-foreground pb-2">
        Dashboard Proyek <span className="text-carbon-medium text-xl">(VERIFICATOR)</span>
      </h1>
      <p className="text-sm text-foreground/80 mb-8 font-space">
        Address: {DUMMY_ADMIN_ADDRESS} (Role: Verificator)
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="col-span-2 border-2 border-foreground bg-carbon-medium/30">
          <CardHeader>
            <CardTitle className="text-xl uppercase font-bold text-foreground flex items-center gap-2">
                <Zap className="size-6 text-carbon-primary" /> Registrasi Proyek Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMint} className="space-y-6">
              {/* Project Details */}
              <div className="space-y-4 p-4 border border-foreground/50 bg-carbon-light/50">
                <Label htmlFor="name" className="uppercase font-semibold">Nama Proyek</Label>
                <Input id="name" placeholder="Mangrove Restoration Delta" className="bg-foreground border-foreground" />

                <Label htmlFor="location" className="uppercase font-semibold">Lokasi (GPS/Region)</Label>
                <Input id="location" placeholder="Kalimantan Barat, Indonesia" className="bg-foreground border-foreground" />
                
                <Label htmlFor="amount" className="uppercase font-semibold">CO2 Amount (Ton) - Token Supply</Label>
                <Input id="amount" type="number" placeholder="5000" className="bg-foreground border-foreground" />
              </div>

              {/* Price and Upload */}
              <div className="space-y-4 p-4 border border-foreground/50 bg-carbon-light/50">
                <Label htmlFor="price" className="uppercase font-semibold flex items-center gap-2">
                    <DollarSign className="size-4" /> Harga / Ton (ETH)
                </Label>
                <Input id="price" type="number" placeholder="0.001" step="0.0001" className="bg-foreground border-foreground" />

                <Label htmlFor="file" className="uppercase font-semibold flex items-center gap-2">
                    <Upload className="size-4" /> Dokumen Verifikasi (IPFS Upload)
                </Label>
                <Input id="file" type="file" className="bg-foreground border-foreground file:text-carbon-primary" />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-carbon-primary text-carbon-medium hover:bg-carbon-primary/90 uppercase font-extrabold tracking-widest border-2 border-foreground hover:border-carbon-primary"
              >
                Mint Token &amp; Certificate (Call SC)
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-2 border-foreground">
            <CardHeader>
                <CardTitle className="uppercase font-bold flex items-center gap-2">
                    <ShieldCheck className="size-5" /> Status Verifikator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm">Anda memiliki peran **VERIFIER_ROLE** di kontrak Core.</p>
                <Separator className="bg-foreground/50"/>
                <p className="text-sm">**Aksi On-Chain:**</p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>`registerProject` (Mint ERC-1155 Token + NFT Proyek)</li>
                    <li>`setTokenPrice` (Tetapkan Harga Jual)</li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}