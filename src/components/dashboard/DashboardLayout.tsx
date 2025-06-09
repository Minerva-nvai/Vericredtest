import type { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { Footer } from '@/components/layout/Footer';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader title={title} />
      <main className="flex-grow container py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
