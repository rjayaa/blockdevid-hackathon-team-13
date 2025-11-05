'use client';

import { LoginButton, liskSepolia } from 'panna-sdk';

export default function WalletConnectButton() {
  return (
    <LoginButton chain={liskSepolia} />
  );
}
