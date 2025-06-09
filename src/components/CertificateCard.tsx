'use client';
import type { Certificate, DemoCertificate } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Award, Building, User, CalendarDays, ExternalLink, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface CertificateCardProps {
  certificate: Certificate | DemoCertificate;
  isShareable?: boolean;
}

export function CertificateCard({ certificate, isShareable = false }: CertificateCardProps) {
  const { toast } = useToast();

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/verify?tokenId=${certificate.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({ title: 'Link Copied!', description: 'Certificate verification link copied to clipboard.' });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({ title: 'Error', description: 'Failed to copy link.', variant: 'destructive' });
      });
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        {certificate.certificateImage && (
          <div className="relative aspect-video rounded-md overflow-hidden mb-4">
            <Image 
                src={certificate.certificateImage} 
                alt={certificate.degreeName} 
                layout="fill" 
                objectFit="cover"
                data-ai-hint="certificate document"
            />
          </div>
        )}
        <CardTitle className="text-xl flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" /> {certificate.degreeName}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <User className="h-4 w-4" /> Issued to: {certificate.studentName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        <p className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" /> <strong>Issuer:</strong> {certificate.issuerName}</p>
        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /> <strong>Issued on:</strong> {certificate.issueDate}</p>
        {'department' in certificate && certificate.department && (
          <p className="flex items-center gap-2"><Award className="h-4 w-4 text-muted-foreground" /> <strong>Department:</strong> {certificate.department}</p>
        )}
        {certificate.suggestedSkills && certificate.suggestedSkills.length > 0 && (
          <div className="pt-2">
            <strong className="flex items-center gap-2 mb-1"><Tags className="h-4 w-4 text-muted-foreground" /> Suggested Skills:</strong>
            <div className="flex flex-wrap gap-1">
              {certificate.suggestedSkills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <Link href={`/verify?tokenId=${certificate.id}`} passHref>
          <Button variant="outline" className="w-full sm:w-auto">
            <ExternalLink className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
        {isShareable && (
          <Button onClick={handleShare} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
