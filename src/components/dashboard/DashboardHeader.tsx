'use client';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
           <Link href="/" passHref>
            <Button variant="ghost" size="icon" aria-label="Go to homepage">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  );
}
