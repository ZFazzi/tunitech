import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectSkillSelector } from './ProjectSkillSelector';
import { ProjectIndustrySelector } from './ProjectIndustrySelector';
import { toast } from 'sonner';

const projectSchema = z.object({
  project_description: z.string().min(10, 'Projektbeskrivning måste vara minst 10 tecken'),
  project_type: z.enum(['web_development', 'mobile_development', 'consulting', 'other']),
  experience_level: z.enum(['junior', 'medior', 'senior']),
  employment_type: z.enum(['hourly', 'part_time', 'full_time', 'other']),
  employment_type_other: z.string().optional(),
  start_date: z.enum(['asap', '1_month', '2_3_months', 'flexible']),
  project_duration: z.string().optional(),
  has_budget: z.boolean(),
  budget_amount: z.string().optional(),
  industry_experience_required: z.boolean(),
  industry_type: z.string().optional(),
  technical_skills: z.string().min(1, 'Tekniska färdigheter krävs'),
  required_resources: z.string().optional(),
  security_requirements: z.string().optional(),
  project_risks: z.string().optional(),
  additional_comments: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface SelectedSkill {
  skillCategoryId: string;
  name: string;
  importanceLevel: number;
  minimumYears: number;
}

interface SelectedIndustry {
  industryCategoryId: string;
  name: string;
  required: boolean;
}

export const ProjectRequirementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<SelectedIndustry[]>([]);
  const { user } = useAuth();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      has_budget: false,
      industry_experience_required: false,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast.error('Du måste vara inloggad');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get customer ID
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError || !customer) {
        toast.error('Kunde inte hitta kundprofil');
        return;
      }

      // Create project requirement
      const { data: projectReq, error: projectError } = await supabase
        .from('project_requirements')
        .insert({
          ...data,
          customer_id: customer.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert selected skills
      if (selectedSkills.length > 0) {
        const skillsToInsert = selectedSkills.map(skill => ({
          project_requirement_id: projectReq.id,
          skill_category_id: skill.skillCategoryId,
          importance_level: skill.importanceLevel,
          minimum_years: skill.minimumYears
        }));

        await supabase
          .from('project_required_skills')
          .insert(skillsToInsert);
      }

      // Insert selected industries
      if (selectedIndustries.length > 0) {
        const industriesToInsert = selectedIndustries.map(industry => ({
          project_requirement_id: projectReq.id,
          industry_category_id: industry.industryCategoryId,
          required: industry.required
        }));

        await supabase
          .from('project_industry_requirements')
          .insert(industriesToInsert);
      }

      toast.success('Projektkrav skapat!');
      form.reset();
      setSelectedSkills([]);
      setSelectedIndustries([]);
    } catch (error: any) {
      toast.error('Kunde inte skapa projektkrav: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Skapa Projektkrav</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="project_description">Projektbeskrivning *</Label>
              <Textarea
                id="project_description"
                {...form.register('project_description')}
                placeholder="Beskriv ditt projekt i detalj..."
                className="mt-1"
              />
              {form.formState.errors.project_description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.project_description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="project_type">Projekttyp *</Label>
              <Select
                onValueChange={(value) => form.setValue('project_type', value as any)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Välj en projekttyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web_development">Webbutveckling</SelectItem>
                  <SelectItem value="mobile_development">Mobilutveckling</SelectItem>
                  <SelectItem value="consulting">Konsulting</SelectItem>
                  <SelectItem value="other">Annat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience_level">Erfarenhetsnivå *</Label>
              <Select
                onValueChange={(value) => form.setValue('experience_level', value as any)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Välj en erfarenhetsnivå" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="medior">Medior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employment_type">Anställningstyp *</Label>
              <Select
                onValueChange={(value) => form.setValue('employment_type', value as any)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Välj en anställningstyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Timanställning</SelectItem>
                  <SelectItem value="part_time">Deltid</SelectItem>
                  <SelectItem value="full_time">Heltid</SelectItem>
                  <SelectItem value="other">Annat</SelectItem>
                </SelectContent>
              </Select>
              {form.watch('employment_type') === 'other' && (
                <Input
                  id="employment_type_other"
                  {...form.register('employment_type_other')}
                  placeholder="Beskriv annan anställningstyp"
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <Label htmlFor="start_date">Startdatum *</Label>
              <Select
                onValueChange={(value) => form.setValue('start_date', value as any)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Välj ett startdatum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">Snarast</SelectItem>
                  <SelectItem value="1_month">Inom 1 månad</SelectItem>
                  <SelectItem value="2_3_months">Inom 2-3 månader</SelectItem>
                  <SelectItem value="flexible">Flexibelt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project_duration">Projektets varaktighet</Label>
              <Input
                id="project_duration"
                {...form.register('project_duration')}
                placeholder="t.ex. 3 månader"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_budget"
                {...form.register('has_budget')}
              />
              <Label htmlFor="has_budget">Har projektet en budget?</Label>
            </div>

            {form.watch('has_budget') && (
              <div>
                <Label htmlFor="budget_amount">Budgetbelopp</Label>
                <Input
                  id="budget_amount"
                  {...form.register('budget_amount')}
                  placeholder="Ange budgetbelopp"
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="industry_experience_required"
                {...form.register('industry_experience_required')}
              />
              <Label htmlFor="industry_experience_required">Krävs branscherfarenhet?</Label>
            </div>

            {form.watch('industry_experience_required') && (
              <div>
                <Label htmlFor="industry_type">Branschtyp</Label>
                <Input
                  id="industry_type"
                  {...form.register('industry_type')}
                  placeholder="Ange branschtyp"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="technical_skills">Tekniska färdigheter *</Label>
              <Input
                id="technical_skills"
                {...form.register('technical_skills')}
                placeholder="Ange tekniska färdigheter"
                className="mt-1"
              />
              {form.formState.errors.technical_skills && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.technical_skills.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="required_resources">Krävda resurser</Label>
              <Input
                id="required_resources"
                {...form.register('required_resources')}
                placeholder="Ange krävda resurser"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="security_requirements">Säkerhetskrav</Label>
              <Input
                id="security_requirements"
                {...form.register('security_requirements')}
                placeholder="Ange säkerhetskrav"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="project_risks">Projektrisker</Label>
              <Input
                id="project_risks"
                {...form.register('project_risks')}
                placeholder="Ange projektrisker"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="additional_comments">Ytterligare kommentarer</Label>
              <Textarea
                id="additional_comments"
                {...form.register('additional_comments')}
                placeholder="Ytterligare kommentarer..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-lg font-semibold">Tekniska färdigheter</Label>
              <ProjectSkillSelector
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
              />
            </div>

            <div>
              <Label className="text-lg font-semibold">Branschkrav</Label>
              <ProjectIndustrySelector
                selectedIndustries={selectedIndustries}
                onIndustriesChange={setSelectedIndustries}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Rensa
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Skapar...' : 'Skapa Projektkrav'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
