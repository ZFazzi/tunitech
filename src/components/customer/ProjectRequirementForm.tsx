
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
import { useNavigate } from 'react-router-dom';

const projectSchema = z.object({
  project_title: z.string().min(1, 'Projekttitel krävs'),
  project_description: z.string().min(10, 'Projektbeskrivning måste vara minst 10 tecken'),
  project_type: z.enum(['web_development', 'mobile_development', 'consulting', 'other']),
  timeline: z.enum(['1_month', '2_3_months', '4_6_months', 'more_than_6_months']),
  budget_range: z.enum(['under_50k', '50k_100k', '100k_250k', '250k_500k', 'over_500k']),
  required_experience_level: z.enum(['junior', 'medior', 'senior', 'mixed']),
  team_size: z.enum(['1', '2_3', '4_5', 'more_than_5']),
  location_preference: z.enum(['remote', 'on_site', 'hybrid']),
  start_date: z.enum(['asap', '1_month', '2_3_months', 'flexible']),
  additional_requirements: z.string().optional(),
  is_ongoing: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface RequiredSkill {
  skillCategoryId: string;
  name: string;
  importanceLevel: number;
  minimumYears: number;
}

interface RequiredIndustry {
  industryCategoryId: string;
  name: string;
  minimumYears: number;
}

export const ProjectRequirementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([]);
  const [requiredIndustries, setRequiredIndustries] = useState<RequiredIndustry[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_ongoing: false,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast.error('Du måste vara inloggad');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get customer data
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError) {
        toast.error('Kunde inte hitta kundprofil');
        return;
      }

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          customer_id: customer.id,
          ...data,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert required skills
      if (requiredSkills.length > 0) {
        const skillsToInsert = requiredSkills.map(skill => ({
          project_id: project.id,
          skill_category_id: skill.skillCategoryId,
          importance_level: skill.importanceLevel,
          minimum_years_experience: skill.minimumYears,
        }));

        const { error: skillsError } = await supabase
          .from('project_skills')
          .insert(skillsToInsert);

        if (skillsError) throw skillsError;
      }

      // Insert required industries
      if (requiredIndustries.length > 0) {
        const industriesToInsert = requiredIndustries.map(industry => ({
          project_id: project.id,
          industry_category_id: industry.industryCategoryId,
          minimum_years_experience: industry.minimumYears,
        }));

        const { error: industriesError } = await supabase
          .from('project_industries')
          .insert(industriesToInsert);

        if (industriesError) throw industriesError;
      }

      toast.success('Projekt skapat!');
      navigate('/customer-dashboard');
    } catch (error: any) {
      toast.error('Kunde inte skapa projekt: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProjectTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'web_development': 'Webbutveckling',
      'mobile_development': 'Mobilutveckling',
      'consulting': 'Konsultation',
      'other': 'Övrigt'
    };
    return labels[type] || type;
  };

  const getTimelineLabel = (timeline: string) => {
    const labels: { [key: string]: string } = {
      '1_month': '1 månad',
      '2_3_months': '2-3 månader',
      '4_6_months': '4-6 månader',
      'more_than_6_months': 'Mer än 6 månader'
    };
    return labels[timeline] || timeline;
  };

  const getBudgetLabel = (budget: string) => {
    const labels: { [key: string]: string } = {
      'under_50k': 'Under 50k SEK',
      '50k_100k': '50k-100k SEK',
      '100k_250k': '100k-250k SEK',
      '250k_500k': '250k-500k SEK',
      'over_500k': 'Över 500k SEK'
    };
    return labels[budget] || budget;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      'junior': 'Junior',
      'medior': 'Medior',
      'senior': 'Senior',
      'mixed': 'Blandad'
    };
    return labels[level] || level;
  };

  const getTeamSizeLabel = (size: string) => {
    const labels: { [key: string]: string } = {
      '1': '1 utvecklare',
      '2_3': '2-3 utvecklare',
      '4_5': '4-5 utvecklare',
      'more_than_5': 'Mer än 5 utvecklare'
    };
    return labels[size] || size;
  };

  const getLocationLabel = (location: string) => {
    const labels: { [key: string]: string } = {
      'remote': 'Distans',
      'on_site': 'På plats',
      'hybrid': 'Hybrid'
    };
    return labels[location] || location;
  };

  const getStartDateLabel = (date: string) => {
    const labels: { [key: string]: string } = {
      'asap': 'Så snart som möjligt',
      '1_month': 'Inom 1 månad',
      '2_3_months': 'Inom 2-3 månader',
      'flexible': 'Flexibelt'
    };
    return labels[date] || date;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Skapa Nytt Projekt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Project Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="project_title">Projekttitel *</Label>
                <Input
                  id="project_title"
                  {...form.register('project_title')}
                  className="mt-1"
                />
                {form.formState.errors.project_title && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.project_title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="project_description">Projektbeskrivning *</Label>
                <Textarea
                  id="project_description"
                  {...form.register('project_description')}
                  placeholder="Beskriv ditt projekt i detalj..."
                  className="mt-1 h-32"
                />
                {form.formState.errors.project_description && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.project_description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="project_type">Projekttyp *</Label>
                <Select
                  value={form.watch('project_type')}
                  onValueChange={(value) => form.setValue('project_type', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj projekttyp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web_development">Webbutveckling</SelectItem>
                    <SelectItem value="mobile_development">Mobilutveckling</SelectItem>
                    <SelectItem value="consulting">Konsultation</SelectItem>
                    <SelectItem value="other">Övrigt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Tidsram *</Label>
                <Select
                  value={form.watch('timeline')}
                  onValueChange={(value) => form.setValue('timeline', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj tidsram" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_month">1 månad</SelectItem>
                    <SelectItem value="2_3_months">2-3 månader</SelectItem>
                    <SelectItem value="4_6_months">4-6 månader</SelectItem>
                    <SelectItem value="more_than_6_months">Mer än 6 månader</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget_range">Budgetram *</Label>
                <Select
                  value={form.watch('budget_range')}
                  onValueChange={(value) => form.setValue('budget_range', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj budgetram" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_50k">Under 50k SEK</SelectItem>
                    <SelectItem value="50k_100k">50k-100k SEK</SelectItem>
                    <SelectItem value="100k_250k">100k-250k SEK</SelectItem>
                    <SelectItem value="250k_500k">250k-500k SEK</SelectItem>
                    <SelectItem value="over_500k">Över 500k SEK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="required_experience_level">Önskad erfarenhetsnivå *</Label>
                <Select
                  value={form.watch('required_experience_level')}
                  onValueChange={(value) => form.setValue('required_experience_level', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj erfarenhetsnivå" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="medior">Medior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="mixed">Blandad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="team_size">Teamstorlek *</Label>
                <Select
                  value={form.watch('team_size')}
                  onValueChange={(value) => form.setValue('team_size', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj teamstorlek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 utvecklare</SelectItem>
                    <SelectItem value="2_3">2-3 utvecklare</SelectItem>
                    <SelectItem value="4_5">4-5 utvecklare</SelectItem>
                    <SelectItem value="more_than_5">Mer än 5 utvecklare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location_preference">Platsönskemål *</Label>
                <Select
                  value={form.watch('location_preference')}
                  onValueChange={(value) => form.setValue('location_preference', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj platsönskemål" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Distans</SelectItem>
                    <SelectItem value="on_site">På plats</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start_date">Startdatum *</Label>
                <Select
                  value={form.watch('start_date')}
                  onValueChange={(value) => form.setValue('start_date', value as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Välj startdatum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">Så snart som möjligt</SelectItem>
                    <SelectItem value="1_month">Inom 1 månad</SelectItem>
                    <SelectItem value="2_3_months">Inom 2-3 månader</SelectItem>
                    <SelectItem value="flexible">Flexibelt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <Label className="text-lg font-semibold">Färdighetskrav</Label>
              <ProjectSkillSelector
                selectedSkills={requiredSkills}
                onSkillsChange={setRequiredSkills}
              />
            </div>

            {/* Industry Experience Section */}
            <div>
              <Label className="text-lg font-semibold">Branschexpertis</Label>
              <ProjectIndustrySelector
                selectedIndustries={requiredIndustries}
                onIndustriesChange={setRequiredIndustries}
              />
            </div>

            {/* Additional Requirements */}
            <div>
              <Label htmlFor="additional_requirements">Ytterligare krav</Label>
              <Textarea
                id="additional_requirements"
                {...form.register('additional_requirements')}
                placeholder="Beskriv eventuella ytterligare krav eller önskemål..."
                className="mt-1"
              />
            </div>

            {/* Ongoing Project */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_ongoing"
                checked={form.watch('is_ongoing')}
                onCheckedChange={(checked) => form.setValue('is_ongoing', !!checked)}
              />
              <Label htmlFor="is_ongoing">
                Detta är ett pågående projekt
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Skapar projekt...' : 'Skapa Projekt'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
