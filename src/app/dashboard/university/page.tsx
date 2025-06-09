'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RegisterIssuerForm } from '@/components/university/RegisterIssuerForm'; // To be created
import { IssueCertificateForm } from '@/components/university/IssueCertificateForm'; // To be created
import { IssuedCertificatesList } from '@/components/university/IssuedCertificatesList'; // To be created
import { useWallet } from '@/context/WalletContext';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UniversityDashboardPage() {
  const { account } = useWallet();
  const { isIssuerRegistered, getCertificatesByIssuer, issuers }
 = useAppContext();

  if (!account) {
    return (
      <DashboardLayout title="University Dashboard">
        <Alert variant="default" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to access the university dashboard.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  
  const currentIssuer = issuers.find(i => i.walletAddress.toLowerCase() === account.toLowerCase());

  return (
    <DashboardLayout title="University Dashboard">
      <div className="space-y-8">
        {!isIssuerRegistered(account) || !currentIssuer?.name ? (
          <RegisterIssuerForm />
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                    Welcome, {currentIssuer.name}!
                </CardTitle>
              <CardDescription>Your wallet ({account.substring(0,6)}...{account.substring(account.length - 4)}) is registered as an issuer.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {isIssuerRegistered(account) && currentIssuer?.name && (
          <>
            <IssueCertificateForm />
            <IssuedCertificatesList certificates={getCertificatesByIssuer(account)} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
