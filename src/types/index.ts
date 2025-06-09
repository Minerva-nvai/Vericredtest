export interface Certificate {
  id: string; // Could be a mock token ID or unique identifier
  studentWalletAddress: string;
  studentName: string;
  degreeName: string;
  department: string;
  issueDate: string; // YYYY-MM-DD
  issuerWalletAddress: string; // University wallet address
  issuerName: string; // University Name
  certificateImage?: string; // URL to placeholder, IPFS image, or a data URI
  verificationLink?: string; // Link to mock "blockchain explorer"
  suggestedSkills?: string[];
}

export interface UniversityIssuer {
  walletAddress: string;
  name: string; // University Name
  isRegistered: boolean;
}

export interface DemoCertificate extends Omit<Certificate, 'studentWalletAddress' | 'issuerWalletAddress'> {
   // Demo certificates might not have specific student/issuer wallets for general viewing
}
