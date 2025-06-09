'use client';
import type { Certificate } from '@/types';
import { CertificateCard } from '@/components/CertificateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Info } from 'lucide-react';

interface IssuedCertificatesListProps {
  certificates: Certificate[];
}

export function IssuedCertificatesList({ certificates }: IssuedCertificatesListProps) {
  if (certificates.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            No Certificates Issued Yet
          </CardTitle>
          <CardDescription>
            You haven't issued any certificates. Use the form above to mint new certificates.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Previously Issued Certificates
        </CardTitle>
        <CardDescription>
          A record of all certificates minted by your institution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} isShareable={true} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
