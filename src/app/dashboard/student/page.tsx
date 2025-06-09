'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CertificateCard } from '@/components/CertificateCard';
import { useWallet } from '@/context/WalletContext';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, User, FileText, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function StudentDashboardPage() {
  const { account } = useWallet();
  const { getCertificatesByStudent, certificates } = useAppContext(); // get all certs to check if any exist for this student

  if (!account) {
    return (
      <DashboardLayout title="Student Dashboard">
        <Alert variant="default" className="max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your certificates.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const studentCertificates = getCertificatesByStudent(account);

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://avatar.vercel.sh/${account}.png`} alt="User Avatar" />
                <AvatarFallback>{account.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              My Profile
            </CardTitle>
            <CardDescription>
              Wallet Address: <span className="font-medium text-foreground">{account}</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              My Certificates
            </CardTitle>
            <CardDescription>
              All academic certificates issued to your connected wallet address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentCertificates.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCertificates.map((cert) => (
                  <CertificateCard key={cert.id} certificate={cert} isShareable={true} />
                ))}
              </div>
            ) : (
              <Alert variant="default">
                 <Info className="h-4 w-4" />
                <AlertTitle>No Certificates Found</AlertTitle>
                <AlertDescription>
                  There are no certificates issued to this wallet address yet. If you are expecting a certificate, please check with your institution.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
