'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { suggestSkills } from '@/ai/flows/suggest-skills'; // Assuming this path
import { Lightbulb, Loader2, Tag, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SkillSuggesterProps {
  degreeName: string;
  onSkillsSuggested: (skills: string[]) => void;
  currentSkills: string[];
}

export function SkillSuggester({ degreeName, onSkillsSuggested, currentSkills }: SkillSuggesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSuggestSkills = async () => {
    if (!degreeName) {
      toast({ title: 'Missing Degree Name', description: 'Please enter a degree name to suggest skills.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await suggestSkills({ degreeName });
      setSuggestedSkills(result.skills);
      // Automatically add new skills to the parent form if they are not already present
      const newSkillsToAdd = result.skills.filter(skill => !currentSkills.includes(skill));
      if (newSkillsToAdd.length > 0) {
        onSkillsSuggested([...currentSkills, ...newSkillsToAdd]);
      }
       toast({ title: 'Skills Suggested', description: `${result.skills.length} skills found for ${degreeName}.`, variant: 'default' });
    } catch (error) {
      console.error('Error suggesting skills:', error);
      toast({ title: 'Error', description: 'Could not suggest skills at this time.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    const updatedSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
    onSkillsSuggested(updatedSkills);
  };


  return (
    <div className="space-y-3">
      <Button type="button" onClick={handleSuggestSkills} disabled={isLoading || !degreeName} variant="outline">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="mr-2 h-4 w-4" />
        )}
        Suggest Skills with AI
      </Button>
      
      {suggestedSkills.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">AI Suggested Skills (click to add/remove):</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <Badge
                key={skill}
                variant={currentSkills.includes(skill) ? 'default' : 'secondary'}
                onClick={() => toggleSkill(skill)}
                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                {currentSkills.includes(skill) && <CheckCircle className="h-3 w-3" />}
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
