import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton'; // To be created
import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-semibold text-primary">VeriCred</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard/student">
            <Button variant="ghost">Student Dashboard</Button>
          </Link>
          <Link href="/dashboard/university">
            <Button variant="ghost">University Dashboard</Button>
          </Link>
          <ConnectWalletButton />
        </nav>
      </div>
    </header>
  );
}
