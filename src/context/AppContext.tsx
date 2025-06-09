'use client';
import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Certificate, UniversityIssuer, DemoCertificate } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock Data
const MOCK_ISSUERS_KEY = 'veriCred_mockIssuers';
const MOCK_CERTIFICATES_KEY = 'veriCred_mockCertificates';

const initialDemoCertificate: DemoCertificate = {
  id: 'demo-cert-001',
  studentName: 'Jane Doe',
  degreeName: 'Master of Blockchain Technology',
  department: 'Future Studies',
  issueDate: '2024-05-15',
  issuerName: 'Crypto University',
  certificateImage: 'https://placehold.co/600x400.png',
  verificationLink: '#',
  suggestedSkills: ['Smart Contract Development', 'Decentralized Finance (DeFi)', 'Cryptography', 'Tokenomics']
};


interface AppState {
  issuers: UniversityIssuer[];
  certificates: Certificate[];
  demoCertificate: DemoCertificate;
  registerIssuer: (name: string, walletAddress: string) => void;
  issueCertificate: (certificateData: Omit<Certificate, 'id' | 'issuerName' | 'verificationLink'>) => void;
  getCertificatesByStudent: (walletAddress: string) => Certificate[];
  getCertificatesByIssuer: (walletAddress:string) => Certificate[];
  getCertificateById: (id: string) => Certificate | DemoCertificate | undefined;
  isIssuerRegistered: (walletAddress: string) => boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [issuers, setIssuers] = useState<UniversityIssuer[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load issuers from localStorage
    const storedIssuers = localStorage.getItem(MOCK_ISSUERS_KEY);
    if (storedIssuers) {
      setIssuers(JSON.parse(storedIssuers));
    }

    // Load certificates from localStorage
    const storedCertificates = localStorage.getItem(MOCK_CERTIFICATES_KEY);
    if (storedCertificates) {
      setCertificates(JSON.parse(storedCertificates));
    }
  }, []);

  const persistIssuers = (updatedIssuers: UniversityIssuer[]) => {
    setIssuers(updatedIssuers);
    localStorage.setItem(MOCK_ISSUERS_KEY, JSON.stringify(updatedIssuers));
  };

  const persistCertificates = (updatedCertificates: Certificate[]) => {
    setCertificates(updatedCertificates);
    localStorage.setItem(MOCK_CERTIFICATES_KEY, JSON.stringify(updatedCertificates));
  };

  const registerIssuer = (name: string, walletAddress: string) => {
    if(issuers.find(issuer => issuer.walletAddress.toLowerCase() === walletAddress.toLowerCase())) {
      toast({ title: "Already Registered", description: "This wallet address is already registered as an issuer.", variant: "default" });
      const updatedIssuers = issuers.map(issuer => issuer.walletAddress.toLowerCase() === walletAddress.toLowerCase() ? {...issuer, isRegistered: true, name: name} : issuer);
      persistIssuers(updatedIssuers);
      return;
    }
    const newIssuer: UniversityIssuer = { name, walletAddress, isRegistered: true };
    persistIssuers([...issuers, newIssuer]);
    toast({ title: "Issuer Registered", description: `${name} (${walletAddress.substring(0,6)}...) is now a registered issuer.` });
  };

  const issueCertificate = (certData: Omit<Certificate, 'id' | 'issuerName' | 'verificationLink'>) => {
    const issuer = issuers.find(i => i.walletAddress.toLowerCase() === certData.issuerWalletAddress.toLowerCase());
    if (!issuer || !issuer.isRegistered) {
      toast({ title: "Issuance Failed", description: "Issuer not registered or not found.", variant: "destructive" });
      return;
    }

    const newCertificate: Certificate = {
      ...certData,
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      issuerName: issuer.name,
      verificationLink: `/verify?tokenId=cert-${Date.now()}`, // Mock link
    };
    persistCertificates([...certificates, newCertificate]);
    toast({ title: "Certificate Issued", description: `Certificate for ${certData.studentName} has been issued.` });
  };

  const getCertificatesByStudent = (walletAddress: string) => {
    return certificates.filter(cert => cert.studentWalletAddress.toLowerCase() === walletAddress.toLowerCase());
  };

  const getCertificatesByIssuer = (walletAddress: string) => {
    return certificates.filter(cert => cert.issuerWalletAddress.toLowerCase() === walletAddress.toLowerCase());
  };
  
  const getCertificateById = (id: string) => {
    if (id === initialDemoCertificate.id) return initialDemoCertificate;
    return certificates.find(cert => cert.id === id);
  };

  const isIssuerRegistered = (walletAddress: string) => {
    return issuers.some(issuer => issuer.walletAddress.toLowerCase() === walletAddress.toLowerCase() && issuer.isRegistered);
  };


  return (
    <AppContext.Provider value={{ 
      issuers, 
      certificates, 
      demoCertificate: initialDemoCertificate,
      registerIssuer, 
      issueCertificate, 
      getCertificatesByStudent,
      getCertificatesByIssuer,
      getCertificateById,
      isIssuerRegistered
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
