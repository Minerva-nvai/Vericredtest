import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, HelpCircle, Info, Rocket, ShieldCheck, Workflow, LockKeyhole, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <MainLayout>
      <section className="py-16 md:py-24 text-center">
        <div className="container">
          <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            VeriCred: Web3 Verified Credentials
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Securely issue, manage, and verify academic certificates as soulbound NFTs on the blockchain. Empowering students and simplifying verification for employers.
          </p>
          <div className="space-x-4">
            <Link href="/dashboard/university" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Rocket className="mr-2 h-5 w-5" /> For Universities
              </Button>
            </Link>
            <Link href="/dashboard/student" passHref>
              <Button size="lg" variant="outline">
                For Students <Info className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Soulbound NFTs for Credentials?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKeyhole className="h-6 w-6 text-accent" /> Unforgeable & Secure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Certificates are cryptographically secured on the blockchain, making them tamper-proof and easily verifiable.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-accent" /> Student Ownership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Students truly own their credentials in their crypto wallets, giving them full control and portability.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-accent" /> Instant Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Employers and third parties can instantly verify credentials directly on-chain, reducing fraud and administrative overhead.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Workflow className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">1. University Registers</h3>
              <p className="text-muted-foreground">Institutions connect their wallet and register as authorized issuers on VeriCred.</p>
            </div>
            <div className="flex flex-col items-center">
              <Rocket className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. Issue Certificate</h3>
              <p className="text-muted-foreground">Admins mint soulbound NFT certificates for students, embedding verifiable data.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">3. Student Verifies & Shares</h3>
              <p className="text-muted-foreground">Students access their certificates in their wallet and share public verification links.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">View a Demo Certificate</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            See how a VeriCred certificate looks and how its details are displayed for public verification.
          </p>
          <Link href="/verify?tokenId=demo-cert-001" passHref>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View Demo Certificate
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
