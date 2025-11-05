'use client';

import { PannaProvider } from 'panna-sdk';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PannaProviderComponent({ children }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PANNA_CLIENT_ID;
  const partnerId = process.env.NEXT_PUBLIC_PANNA_PARTNER_ID;

  if (!clientId || !partnerId) {
    console.error(
      'Missing Panna SDK credentials. Please set NEXT_PUBLIC_PANNA_CLIENT_ID and NEXT_PUBLIC_PANNA_PARTNER_ID in .env.local'
    );
  }

  return (
    <PannaProvider
      clientId={clientId || ''}
      partnerId={partnerId || ''}
    >
      {children}
    </PannaProvider>
  );
}
