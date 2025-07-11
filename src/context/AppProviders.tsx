'use client';
import type { ReactNode } from 'react';
import { WalletProvider } from './WalletContext';
import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <WalletProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
