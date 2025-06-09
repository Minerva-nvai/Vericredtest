'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { CertificateCard } from '@/components/CertificateCard';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function CertificateViewerContent() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');
  const { getCertificateById, demoCertificate } = useAppContext();

  if (!tokenId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error: Missing Token ID</AlertTitle>
        <AlertDescription>
          No certificate token ID provided in the URL. Please use a valid verification link.
          <div className="mt-4">
            <Link href={`/verify?tokenId=${demoCertificate.id}`} passHref>
                <Button variant="outline">View Demo Certificate</Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  const certificate = getCertificateById(tokenId);

  if (!certificate) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Certificate Not Found</AlertTitle>
        <AlertDescription>
          The certificate with ID "{tokenId}" could not be found. It may be invalid or not yet issued.
           <div className="mt-4">
            <Link href={`/verify?tokenId=${demoCertificate.id}`} passHref>
                <Button variant="outline">View Demo Certificate Instead</Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-3xl flex items-center gap-3">
            <ShieldCheck className="h-8 w-8" />
            Verified Credential
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            This certificate's authenticity is recorded (simulated on VeriCred platform).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <CertificateCard certificate={certificate} isShareable={true}/>
        </CardContent>
        <CardFooter className="bg-secondary p-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                This is a VeriCred verified certificate. Details are displayed as recorded.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function VerifyCertificatePage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-4 text-lg">Loading certificate...</p></div>}>
        <CertificateViewerContent />
      </Suspense>
    </MainLayout>
  );
}

