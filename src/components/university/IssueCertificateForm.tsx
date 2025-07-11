'use client';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { useAppContext } from '@/context/AppContext';
import { SkillSuggester } from './SkillSuggester';
import { PlusCircle, Send, Loader2, Tag, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const issueCertificateSchema = z.object({
  studentWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address.'),
  studentName: z.string().min(2, 'Student name is required.'),
  degreeName: z.string().min(5, 'Degree name is required.'),
  department: z.string().min(3, 'Department is required.'),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Issue date must be YYYY-MM-DD.'),
  certificateImageFile: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
    .refine(files => files?.length > 0, "Certificate image is required.")
    .refine(files => files?.[0]?.type.startsWith("image/"), "File must be an image type (e.g., PNG, JPG, WEBP).")
    .transform(files => files?.[0]), // Get the single File object
  suggestedSkills: z.array(z.string()).optional(),
});

type IssueCertificateFormValues = z.infer<typeof issueCertificateSchema>;

export function IssueCertificateForm() {
  const { account: issuerWalletAddress } = useWallet();
  const { issueCertificate: issueCertContextFunc } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    reset, 
    formState: { errors } 
  } = useForm<IssueCertificateFormValues>({
    resolver: zodResolver(issueCertificateSchema),
    defaultValues: {
      suggestedSkills: [],
      issueDate: new Date().toISOString().split('T')[0], // Default to today
    }
  });

  const degreeNameValue = watch('degreeName');
  const currentSkills = watch('suggestedSkills') || [];
  const certificateImageFileWatch = watch('certificateImageFile');

  useEffect(() => {
    if (certificateImageFileWatch && certificateImageFileWatch instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(certificateImageFileWatch);
    } else if (typeof certificateImageFileWatch === 'object' && certificateImageFileWatch === null) { // Handle reset
      setImagePreview(null);
    }
  }, [certificateImageFileWatch]);


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
      let certificateImageUrl = '';
      if (data.certificateImageFile) {
        certificateImageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(data.certificateImageFile);
        });
      } else {
        // Fallback if somehow certificateImageFile is not present despite schema, though schema makes it required
        certificateImageUrl = `https://placehold.co/600x400.png?text=${encodeURIComponent(data.degreeName)}`;
      }
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1500));

      issueCertContextFunc({
        studentWalletAddress: data.studentWalletAddress,
        studentName: data.studentName,
        degreeName: data.degreeName,
        department: data.department,
        issueDate: data.issueDate,
        suggestedSkills: data.suggestedSkills,
        issuerWalletAddress,
        certificateImage: certificateImageUrl,
      });
      
      toast({ title: "Success", description: "Certificate issued successfully!" });
      reset(); // Reset the entire form including the file input
      setImagePreview(null); // Explicitly clear image preview

    } catch (error) {
      console.error("Issuance error:", error);
      toast({ title: "Error", description: "Failed to issue certificate. Could not process image.", variant: "destructive" });
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
          Fill in the student and degree details, and upload a certificate image to mint a new soulbound NFT certificate.
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" type="date" {...register('issueDate')} className={errors.issueDate ? 'border-destructive' : ''}/>
              {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificateImageFile">Certificate Image</Label>
              <div className="flex items-center gap-2 p-2 border border-input rounded-md focus-within:ring-2 focus-within:ring-ring">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
                <Input 
                  id="certificateImageFile" 
                  type="file" 
                  accept="image/*" 
                  {...register('certificateImageFile')} 
                  className={`h-auto p-0 border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${errors.certificateImageFile ? 'ring-2 ring-destructive' : ''}`}
                />
              </div>
              {errors.certificateImageFile && <p className="text-sm text-destructive">{errors.certificateImageFile.message}</p>}
            </div>
          </div>

          {imagePreview && (
            <div className="space-y-2">
              <Label>Image Preview:</Label>
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-md overflow-hidden border shadow-sm">
                <Image src={imagePreview} alt="Certificate Preview" layout="fill" objectFit="contain" />
              </div>
            </div>
          )}
          
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
