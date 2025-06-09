'use client';
import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

interface WalletState {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
  isLoading: boolean;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      }

      setIsLoading(true);
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const acc = accounts[0];
        setAccount(acc);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to check wallet connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        setError("MetaMask not detected. Please install MetaMask.");
        return;
      }
      setIsLoading(true);
      setError(null);
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    // In a real DApp, you might need more logic here, e.g. for WalletConnect
  };
  
  useEffect(() => {
    const { ethereum } = window as any;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [account]);


  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, error, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
