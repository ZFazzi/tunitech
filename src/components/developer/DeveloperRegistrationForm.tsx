
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkillSelector } from './SkillSelector';
import { IndustrySelector } from './IndustrySelector';
import { toast } from 'sonner';

const registrationSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(6, 'Lösenord måste vara minst 6 tecken'),
  first_name: z.string().min(1, 'Förnamn krävs'),
  last_name: z.string().min(1, 'Efternamn krävs'),
  phone: z.string().optional(),
  experience_level: z.enum(['junior', 'medior', 'senior']),
  years_of_experience: z.number().min(0, 'Års erfarenhet måste vara 0 eller mer'),
  cv_summary: z.string().min(10, 'CV-sammanfattning måste vara minst 10 tecken'),
  portfolio_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  github_url: z.string().optional(),
  location: z.string().optional(),
  hourly_rate: z.string().optional(),
  available_for_work: z.boolean(),
  languages: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
  preferred_employment_types: z.array(z.enum(['hourly', 'part_time', 'full_time', 'other'])).optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface SelectedSkill {
  skillCategoryId: string;
  name: string;
  proficiencyLevel: number;
  yearsExperience: number;
}

interface SelectedIndustry {
  industryCategoryId: string;
  name: string;
  yearsExperience: number;
}

export const DeveloperRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<SelectedIndustry[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      experience_level: 'junior',
      years_of_experience: 0,
      cv_summary: '',
      portfolio_url: '',
      linkedin_url: '',
      github_url: '',
      location: '',
      hourly_rate: '',
      available_for_work: true,
      languages: '',
      education: '',
      certifications: '',
      preferred_employment_types: [],
    },
  });

  const employmentTypes = [
    { value: 'hourly' as const, label: 'Timanställd' },
    { value: 'part_time' as const, label: 'Deltid' },
    { value: 'full_time' as const, label: 'Heltid' },
    { value: 'other' as const, label: 'Övrigt' }
  ];

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      let currentUser = user;

      // If user is not logged in, create account first
      if (!currentUser) {
        const redirectUrl = `${window.location.origin}/auth`;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { user_type: 'developer' },
            emailRedirectTo: redirectUrl
          }
        });

        if (authError) {
          if (authError.message?.includes('User already registered')) {
            toast.error('En användare med denna e-postadress finns redan. Försök logga in istället.');
            navigate('/auth');
            return;
          }
          throw authError;
        }

        currentUser = authData.user;
        
        if (!currentUser) {
          throw new Error('Kunde inte skapa användarkonto');
        }

        toast.success('Konto skapat! Kontrollera din e-post för verifiering.');
      }

      // Create technical skills summary for backward compatibility
      const technicalSkillsSummary = selectedSkills.map(skill => skill.name);

      const developerData = {
        user_id: currentUser.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || null,
        experience_level: data.experience_level,
        years_of_experience: data.years_of_experience,
        cv_summary: data.cv_summary,
        portfolio_url: data.portfolio_url || null,
        linkedin_url: data.linkedin_url || null,
        github_url: data.github_url || null,
        location: data.location || null,
        hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
        available_for_work: data.available_for_work,
        languages: data.languages ? data.languages.split(',').map(s => s.trim()).filter(s => s) : null,
        education: data.education || null,
        certifications: data.certifications ? data.certifications.split(',').map(s => s.trim()).filter(s => s) : null,
        preferred_employment_types: data.preferred_employment_types as ('hourly' | 'part_time' | 'full_time' | 'other')[],
        technical_skills: technicalSkillsSummary,
        is_approved: false,
      };

      const { data: developer, error } = await supabase
        .from('developers')
        .insert([developerData])
        .select()
        .single();

      if (error) throw error;

      // Insert skills
      if (selectedSkills.length > 0) {
        const skillsToInsert = selectedSkills.map(skill => ({
          developer_id: developer.id,
          skill_category_id: skill.skillCategoryId,
          proficiency_level: skill.proficiencyLevel,
          years_experience: skill.yearsExperience
        }));

        await supabase
          .from('developer_skills')
          .insert(skillsToInsert);
      }

      // Insert industries
      if (selectedIndustries.length > 0) {
        const industriesToInsert = selectedIndustries.map(industry => ({
          developer_id: developer.id,
          industry_category_id: industry.industryCategoryId,
          years_experience: industry.yearsExperience
        }));

        await supabase
          .from('developer_industries')
          .insert(industriesToInsert);
      }

      toast.success('Profil skapad! Din ansökan kommer att granskas.');
      
      // If user was just created, show message about email verification
      if (!user) {
        toast.info('Verifiera din e-post för att få full åtkomst till ditt konto.');
      }
      
      navigate('/developer-dashboard');
    } catch (error: any) {
      toast.error('Kunde inte skapa profil: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {user ? 'Skapa Utvecklarprofil' : 'Registrera dig som Utvecklare'}
          </CardTitle>
          <CardDescription>
            {user 
              ? 'Fyll i dina uppgifter för att komma igång som utvecklare'
              : 'Skapa ditt konto och utvecklarprofil i ett steg'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information - only show if not logged in */}
            {!user && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold">Kontoinformation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">E-post *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="mt-1"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Lösenord *</Label>
                    <Input
                      id="password"
                      type="password"
                      {...form.register('password')}
                      className="mt-1"
                    />
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Grundläggande information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Förnamn *</Label>
                  <Input
                    id="first_name"
                    {...form.register('first_name')}
                    className="mt-1"
                  />
                  {form.formState.errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="last_name">Efternamn *</Label>
                  <Input
                    id="last_name"
                    {...form.register('last_name')}
                    className="mt-1"
                  />
                  {form.formState.errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.last_name.message}
                    </p>
                  )}
                </div>

                {/* Show email field if user is logged in (read-only) */}
                {user && (
                  <div>
                    <Label htmlFor="email_readonly">E-post</Label>
                    <Input
                      id="email_readonly"
                      value={user.email || ''}
                      readOnly
                      className="mt-1 bg-gray-100"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Plats</Label>
                  <Input
                    id="location"
                    {...form.register('location')}
                    placeholder="t.ex. Stockholm, Sverige"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experience_level">Erfarenhetsnivå *</Label>
                  <Select
                    value={form.watch('experience_level')}
                    onValueChange={(value) => form.setValue('experience_level', value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Välj erfarenhetsnivå" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="medior">Medior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="years_of_experience">År av erfarenhet *</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    value={form.watch('years_of_experience')}
                    onChange={(e) => form.setValue('years_of_experience', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                  {form.formState.errors.years_of_experience && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.years_of_experience.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hourly_rate">Timarvode (kr)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    min="0"
                    {...form.register('hourly_rate')}
                    placeholder="t.ex. 800"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <Label className="text-lg font-semibold">Tekniska färdigheter</Label>
              <SkillSelector
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
              />
            </div>

            {/* Industry Experience Section */}
            <div>
              <Label className="text-lg font-semibold">Branschexperientet</Label>
              <IndustrySelector
                selectedIndustries={selectedIndustries}
                onIndustriesChange={setSelectedIndustries}
              />
            </div>

            {/* Employment Preferences */}
            <div>
              <Label>Föredragna anställningstyper</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {employmentTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={form.watch('preferred_employment_types')?.includes(type.value)}
                      onCheckedChange={(checked) => {
                        const current = form.watch('preferred_employment_types') || [];
                        if (checked) {
                          form.setValue('preferred_employment_types', [...current, type.value]);
                        } else {
                          form.setValue('preferred_employment_types', 
                            current.filter(t => t !== type.value)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={type.value} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <Label htmlFor="education">Utbildning</Label>
              <Textarea
                id="education"
                {...form.register('education')}
                placeholder="Beskriv din utbildning..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="languages">Språk</Label>
              <Input
                id="languages"
                {...form.register('languages')}
                placeholder="t.ex. Svenska, Engelska (separera med komma)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="certifications">Certifieringar</Label>
              <Input
                id="certifications"
                {...form.register('certifications')}
                placeholder="t.ex. AWS Certified, React Developer (separera med komma)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cv_summary">CV Sammanfattning *</Label>
              <Textarea
                id="cv_summary"
                {...form.register('cv_summary')}
                placeholder="Beskriv din bakgrund och erfarenhet..."
                className="mt-1 h-32"
              />
              {form.formState.errors.cv_summary && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.cv_summary.message}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  {...form.register('linkedin_url')}
                  placeholder="https://linkedin.com/in/..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  {...form.register('github_url')}
                  placeholder="https://github.com/..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="portfolio_url">Portfolio URL</Label>
                <Input
                  id="portfolio_url"
                  {...form.register('portfolio_url')}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available_for_work"
                checked={form.watch('available_for_work')}
                onCheckedChange={(checked) => form.setValue('available_for_work', !!checked)}
              />
              <Label htmlFor="available_for_work">
                Tillgänglig för nya uppdrag
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (user ? 'Skapar profil...' : 'Registrerar och skapar profil...') 
                : (user ? 'Skapa Profil' : 'Registrera dig och Skapa Profil')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
