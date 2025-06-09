'use client';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { useAppContext } from '@/context/AppContext';
import { Building, Check, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const registerIssuerSchema = z.object({
  universityName: z.string().min(3, 'University name must be at least 3 characters long.'),
});

type RegisterIssuerFormValues = z.infer<typeof registerIssuerSchema>;

export function RegisterIssuerForm() {
  const { account } = useWallet();
  const { registerIssuer } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterIssuerFormValues>({
    resolver: zodResolver(registerIssuerSchema),
  });

  const onSubmit: SubmitHandler<RegisterIssuerFormValues> = async (data) => {
    if (!account) {
      // This should ideally be handled by parent component, but good to double check
      alert('Please connect your wallet first.');
      return;
    }
    setIsLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      registerIssuer(data.universityName, account);
    } catch (error) {
      console.error("Registration error:", error);
      // Handle error (e.g., show toast)
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
     return (
      <Alert variant="destructive">
        <Building className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>
          Please connect your wallet to register as an issuer.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          Register as an Issuer
        </CardTitle>
        <CardDescription>
          Connect your university's wallet and provide its name to start issuing certificates. Your current connected wallet is: <strong className="text-foreground">{account.substring(0,6)}...{account.substring(account.length - 4)}</strong>.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="universityName">University Name</Label>
            <Input
              id="universityName"
              placeholder="E.g., Example University"
              {...register('universityName')}
              className={errors.universityName ? 'border-destructive' : ''}
            />
            {errors.universityName && <p className="text-sm text-destructive">{errors.universityName.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Register University
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
