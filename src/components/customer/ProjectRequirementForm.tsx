
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectSkillSelector } from './ProjectSkillSelector';
import { ProjectIndustrySelector } from './ProjectIndustrySelector';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  project_description: z.string().min(10, 'Projektbeskrivning måste vara minst 10 tecken'),
  project_type: z.enum(['fixed_price', 'hourly_based']),
  experience_level: z.enum(['junior', 'medior', 'senior']),
  employment_type: z.enum(['hourly', 'part_time', 'full_time', 'other']),
  employment_type_other: z.string().optional(),
  start_date: z.string().min(1, 'Startdatum krävs'),
  project_duration: z.string().min(1, 'Projektlängd krävs'),
  industry_experience_required: z.boolean(),
  industry_type: z.string().optional(),
  has_budget: z.boolean(),
  budget_amount: z.string().optional(),
  technical_skills: z.string().min(5, 'Tekniska krav måste vara minst 5 tecken'),
  required_resources: z.string().optional(),
  security_requirements: z.string().optional(),
  project_risks: z.string().optional(),
  additional_comments: z.string().optional(),
});

// Types that match the child components
interface ProjectSelectedSkill {
  skillCategoryId: string;
  name: string;
  importanceLevel: number;
  minimumYears: number;
}

interface ProjectRequiredIndustry {
  industryCategoryId: string;
  name: string;
  required: boolean;
}

export const ProjectRequirementForm = () => {
  const [selectedSkills, setSelectedSkills] = useState<ProjectSelectedSkill[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<ProjectRequiredIndustry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_description: '',
      project_type: 'fixed_price',
      experience_level: 'medior',
      employment_type: 'full_time',
      employment_type_other: '',
      start_date: '',
      project_duration: '',
      industry_experience_required: false,
      industry_type: '',
      has_budget: false,
      budget_amount: '',
      technical_skills: '',
      required_resources: '',
      security_requirements: '',
      project_risks: '',
      additional_comments: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('Du måste vara inloggad för att skapa ett projektkrav');
      return;
    }

    try {
      setSubmitting(true);

      // Hämta customer_id från user_id
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        toast.error('Kunde inte hitta kundprofil');
        return;
      }

      // Skapa projektkrav
      const { data: projectReq, error: projectError } = await supabase
        .from('project_requirements')
        .insert([{
          customer_id: customerData.id,
          project_description: values.project_description,
          project_type: values.project_type,
          experience_level: values.experience_level,
          employment_type: values.employment_type,
          employment_type_other: values.employment_type_other,
          start_date: values.start_date,
          project_duration: values.project_duration,
          industry_experience_required: values.industry_experience_required,
          industry_type: values.industry_type,
          has_budget: values.has_budget,
          budget_amount: values.budget_amount,
          technical_skills: values.technical_skills,
          required_resources: values.required_resources,
          security_requirements: values.security_requirements,
          project_risks: values.project_risks,
          additional_comments: values.additional_comments,
        }])
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project requirement:', projectError);
        toast.error('Kunde inte skapa projektkrav');
        return;
      }

      // Lägg till valda färdigheter
      if (selectedSkills.length > 0) {
        const skillInserts = selectedSkills.map(skill => ({
          project_requirement_id: projectReq.id,
          skill_category_id: skill.skillCategoryId,
          importance_level: skill.importanceLevel,
          minimum_years: skill.minimumYears,
        }));

        const { error: skillsError } = await supabase
          .from('project_required_skills')
          .insert(skillInserts);

        if (skillsError) {
          console.error('Error adding skills:', skillsError);
          toast.error('Kunde inte lägga till färdigheter');
          return;
        }
      }

      // Lägg till valda branscher
      if (selectedIndustries.length > 0) {
        const industryInserts = selectedIndustries.map(industry => ({
          project_requirement_id: projectReq.id,
          industry_category_id: industry.industryCategoryId,
          required: industry.required,
        }));

        const { error: industriesError } = await supabase
          .from('project_industry_requirements')
          .insert(industryInserts);

        if (industriesError) {
          console.error('Error adding industries:', industriesError);
          toast.error('Kunde inte lägga till branscher');
          return;
        }
      }

      // Generera matchningar
      try {
        const { error: matchError } = await supabase.rpc('generate_project_matches', {
          req_id: projectReq.id
        });

        if (matchError) {
          console.error('Error generating matches:', matchError);
        }
      } catch (error) {
        console.error('Error calling generate_project_matches:', error);
      }

      toast.success('Projektkrav skapat! Matchningar genereras...');
      navigate('/customer-dashboard');

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Ett oväntat fel uppstod');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkillsChange = (skills: ProjectSelectedSkill[]) => {
    setSelectedSkills(skills);
  };

  const handleIndustriesChange = (industries: ProjectRequiredIndustry[]) => {
    setSelectedIndustries(industries);
  };

  const watchEmploymentType = form.watch('employment_type');
  const watchHasBudget = form.watch('has_budget');
  const watchIndustryRequired = form.watch('industry_experience_required');

  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Skapa Projektkrav</CardTitle>
            <CardDescription className="text-gray-300">
              Beskriv ditt projekt och de krav du har på utvecklare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Projektbeskrivning */}
                <FormField
                  control={form.control}
                  name="project_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Projektbeskrivning</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv ditt projekt i detalj..."
                          className="bg-gray-700 border-gray-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="project_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Projekttyp</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Välj projekttyp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fixed_price">Fast pris</SelectItem>
                            <SelectItem value="hourly_based">Timbaserat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Erfarenhetsnivå</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Välj erfarenhetsnivå" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="medior">Medior</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="employment_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Anställningstyp</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Välj anställningstyp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Timanställd</SelectItem>
                          <SelectItem value="part_time">Deltid</SelectItem>
                          <SelectItem value="full_time">Heltid</SelectItem>
                          <SelectItem value="other">Övrigt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchEmploymentType === 'other' && (
                  <FormField
                    control={form.control}
                    name="employment_type_other"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Specificera anställningstyp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Beskriv anställningstypen..."
                            className="bg-gray-700 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Startdatum</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-gray-700 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="project_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Projektlängd</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="t.ex. 3 månader, 1 år"
                            className="bg-gray-700 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="technical_skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Tekniska krav</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv tekniska färdigheter och verktyg som krävs..."
                          className="bg-gray-700 border-gray-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ProjectSkillSelector
                  onSkillsChange={handleSkillsChange}
                />

                <FormField
                  control={form.control}
                  name="industry_experience_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">
                          Branschexpertis krävs
                        </FormLabel>
                        <FormDescription className="text-gray-400">
                          Kryssa i om utvecklaren behöver specifik branschexpertis
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {watchIndustryRequired && (
                  <FormField
                    control={form.control}
                    name="industry_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Bransch</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="t.ex. Fintech, E-handel, Sjukvård"
                            className="bg-gray-700 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <ProjectIndustrySelector
                  onIndustriesChange={handleIndustriesChange}
                />

                <FormField
                  control={form.control}
                  name="has_budget"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">
                          Jag har en fastställd budget
                        </FormLabel>
                        <FormDescription className="text-gray-400">
                          Kryssa i om du vill ange budget
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {watchHasBudget && (
                  <FormField
                    control={form.control}
                    name="budget_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Budget</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="t.ex. 500 000 SEK"
                            className="bg-gray-700 border-gray-600 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Övriga fält */}
                <FormField
                  control={form.control}
                  name="required_resources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Resurser som tillhandahålls</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv vilka resurser, verktyg eller system som tillhandahålls..."
                          className="bg-gray-700 border-gray-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security_requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Säkerhetskrav</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv eventuella säkerhetskrav eller certifieringar..."
                          className="bg-gray-700 border-gray-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="project_risks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Projektrisker</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Beskriv eventuella risker eller utmaningar..."
                          className="bg-gray-700 border-gray-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additional_comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Ytterligare kommentarer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Övrig information eller speciella önskemål..."
                          className="bg-gray-700 border-gray-600 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-tunitech-primary hover:bg-tunitech-primary/90"
                  disabled={submitting}
                >
                  {submitting ? 'Skapar projektkrav...' : 'Skapa Projektkrav'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
