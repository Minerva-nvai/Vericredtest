'use client';
import type { ReactNode } from 'react';
import { WalletProvider } from './WalletContext';
import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
