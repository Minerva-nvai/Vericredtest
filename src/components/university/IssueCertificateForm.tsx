'use client';
import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // For suggested skills if needed as text
import { useWallet } from '@/context/WalletContext';
import { useAppContext } from '@/context/AppContext';
import { SkillSuggester } from './SkillSuggester';
import { PlusCircle, Send, Loader2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const issueCertificateSchema = z.object({
  studentWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address.'),
  studentName: z.string().min(2, 'Student name is required.'),
  degreeName: z.string().min(5, 'Degree name is required.'),
  department: z.string().min(3, 'Department is required.'),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Issue date must be YYYY-MM-DD.'),
  // certificateImage: z.string().url().optional().or(z.literal('')), // Optional image URL
  suggestedSkills: z.array(z.string()).optional(),
});

type IssueCertificateFormValues = z.infer<typeof issueCertificateSchema>;

export function IssueCertificateForm() {
  const { account: issuerWalletAddress } = useWallet();
  const { issueCertificate: issueCertContextFunc } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<IssueCertificateFormValues>({
    resolver: zodResolver(issueCertificateSchema),
    defaultValues: {
      suggestedSkills: [],
      issueDate: new Date().toISOString().split('T')[0], // Default to today
    }
  });

  const degreeNameValue = watch('degreeName');
  const currentSkills = watch('suggestedSkills') || [];

  const handleSkillsUpdate = (skills: string[]) => {
    setValue('suggestedSkills', skills, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<IssueCertificateFormValues> = async (data) => {
    if (!issuerWalletAddress) {
      toast({ title: "Error", description: "Issuer wallet not connected.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      issueCertContextFunc({
        ...data,
        issuerWalletAddress,
        certificateImage: `https://placehold.co/600x400.png?text=${encodeURIComponent(data.degreeName)}`, // Placeholder image
      });
      // Reset form or provide success feedback
      toast({ title: "Success", description: "Certificate issued successfully!" });
      setValue('studentWalletAddress', '');
      setValue('studentName', '');
      setValue('degreeName', '');
      setValue('department', '');
      setValue('suggestedSkills', []);

    } catch (error) {
      console.error("Issuance error:", error);
      toast({ title: "Error", description: "Failed to issue certificate.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <PlusCircle className="h-6 w-6 text-primary" />
          Issue New Certificate
        </CardTitle>
        <CardDescription>
          Fill in the student and degree details to mint a new soulbound NFT certificate.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="studentWalletAddress">Student Wallet Address</Label>
              <Input id="studentWalletAddress" placeholder="0x..." {...register('studentWalletAddress')} className={errors.studentWalletAddress ? 'border-destructive' : ''}/>
              {errors.studentWalletAddress && <p className="text-sm text-destructive">{errors.studentWalletAddress.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Full Name</Label>
              <Input id="studentName" placeholder="E.g., John Doe" {...register('studentName')} className={errors.studentName ? 'border-destructive' : ''}/>
              {errors.studentName && <p className="text-sm text-destructive">{errors.studentName.message}</p>}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="degreeName">Degree Name</Label>
              <Input id="degreeName" placeholder="E.g., Bachelor of Science in Computer Science" {...register('degreeName')} className={errors.degreeName ? 'border-destructive' : ''}/>
              {errors.degreeName && <p className="text-sm text-destructive">{errors.degreeName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="E.g., Computer Science" {...register('department')} className={errors.department ? 'border-destructive' : ''}/>
              {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" {...register('issueDate')} className={errors.issueDate ? 'border-destructive' : ''}/>
            {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>AI Suggested Skills</Label>
            <SkillSuggester 
              degreeName={degreeNameValue} 
              onSkillsSuggested={handleSkillsUpdate}
              currentSkills={currentSkills}
            />
             {currentSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 p-2 border rounded-md bg-secondary/50">
                {currentSkills.map(skill => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
            {errors.suggestedSkills && <p className="text-sm text-destructive">{errors.suggestedSkills.message}</p>}
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
             {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Mint Certificate
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
