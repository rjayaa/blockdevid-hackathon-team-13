// src/app/(main)/certificate/[id]/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCheck, Link, DollarSign, ArrowRight } from 'lucide-react';
import { DUMMY_CERTIFICATES, Certificate } from '@/lib/types';
import LinkNext from 'next/link';
import { useParams } from 'next/navigation';

const getCertificate = (id: any): Certificate | undefined => {
    return DUMMY_CERTIFICATES.find(c => c.certId === id);
}

const CertificateDetailPage = () => {
    const {id} = useParams()
    const certificate = getCertificate(id) || DUMMY_CERTIFICATES[0];
    const isRetired = certificate.type === 'Pensiun';

    return (
        <div className="pb-12 px-8">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 border-b-4 border-foreground pb-2">
                Bukti Audit: {isRetired ? 'Sertifikat Penebusan' : 'Sertifikat Proyek'}
            </h1>
            <p className="text-sm text-foreground/80 mb-8 font-space">
                ID Sertifikat: {certificate.certId} | Project ID: {certificate.projectId}
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="col-span-2 border-2 border-foreground bg-carbon-primary/10">
                    <CardHeader className='flex-row items-center justify-between'>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <CheckCheck className={`size-6 ${isRetired ? 'text-destructive' : 'text-carbon-primary'}`} />
                            {certificate.co2Amount.toLocaleString()} TONS
                        </CardTitle>
                        <span className={`px-3 py-1 text-xs uppercase font-bold rounded-sm border border-carbon-primary ${isRetired ? 'bg-destructive text-foreground' : 'bg-carbon-medium text-foreground'}`}>
                            {certificate.type} NFT (ERC-721)
                        </span>
                    </CardHeader>
                    
                    <CardContent className=''>
                        <div className="space-y-4">
                            {/* Metadata Table */}
                            <div className='border border-foreground p-4 space-y-2 bg-carbon-medium'>
                                <DetailRow label="Nama Proyek" value={certificate.projectName} />
                                <DetailRow label={isRetired ? 'Ditebus Oleh' : 'Pemilik Proyek'} value={certificate.issuedTo} />
                                <DetailRow label={isRetired ? 'Tujuan' : 'Verifikator Awal'} value={isRetired ? 'Offset Emisi Tahun 2025' : certificate.verifier} />
                                <DetailRow label="Tanggal Dikeluarkan" value={certificate.date} />
                            </div>

                            {/* Verification Block */}
                            <h3 className='font-extrabold uppercase text-lg mt-6'>Bukti On-Chain</h3>
                            <div className='border-2 border-carbon-primary p-4 space-y-3 bg-carbon-medium'>
                                <DetailRow label="Transaction Hash" value={certificate.txHash} isHash />
                                <DetailRow label="Kontrak NFT" value="0xCFc...97f" isHash />
                                <LinkNext href="#" target="_blank" className="text-sm uppercase font-bold text-carbon-primary hover:text-foreground/80 flex items-center gap-2">
                                    Lihat Metadata Lengkap di IPFS <ArrowRight className="size-4" />
                                </LinkNext>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-2 border-foreground bg-carbon-primary text-carbon-medium">
                    <CardHeader>
                        <CardTitle className="uppercase font-bold flex items-center gap-2">
                            <Link className='size-5' /> Lacak
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                        <p className="text-sm">Status NFT ini adalah <b>permanen</b> dan tidak dapat diubah, menyediakan bukti audit yang tak terbantahkan.</p>
                        <Button 
                            variant="default" 
                            className="w-full bg-foreground border-2 border-carbon-medium text-carbon-medium hover:bg-carbon-medium hover:text-carbon-primary uppercase font-bold tracking-widest mt-4"
                            onClick={() => { alert('Opening Lisk Explorer...') }}
                        >
                            Verifikasi di Blockchain Explorer
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const DetailRow = ({ label, value, isHash = false }: { label: string, value: string, isHash?: boolean }) => (
    <div className='flex justify-between border-b border-carbon-dark py-1'>
        <span className='font-semibold text-sm'>{label}:</span>
        <span className={`text-sm ${isHash ? 'font-mono text-xs' : ''} max-w-[50%]`}>{isHash ? value.slice(0, 10) + '...' + value.slice(-8) : value}</span>
    </div>
);

export default CertificateDetailPage