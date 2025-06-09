'use client';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { LogIn, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ConnectWalletButton() {
  const { account, connectWallet, disconnectWallet, error, isLoading } = useWallet();

  if (isLoading) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (error) {
     return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="destructive">
            <AlertCircle className="mr-2 h-4 w-4" /> Error
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-destructive-foreground bg-destructive">{error}</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
     )
  }
  
  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://avatar.vercel.sh/${account}.png`} alt="User Avatar" />
              <AvatarFallback>{account.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Connected Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-xs">
            {account}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet} variant="default">
      <LogIn className="mr-2 h-4 w-4" /> Connect Wallet
    </Button>
  );
}
