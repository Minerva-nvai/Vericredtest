'use client';
import type { ReactNode } from 'react';
import { WalletProvider } from './WalletContext';
import { AppProvider } from './AppContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </WalletProvider>
  );
}
