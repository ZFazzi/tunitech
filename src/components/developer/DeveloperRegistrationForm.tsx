
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
import { Separator } from '@/components/ui/separator';
import { SkillSelector } from './SkillSelector';
import { IndustrySelector } from './IndustrySelector';
import { toast } from 'sonner';
import { CheckCircle, Copy, User, Briefcase, Star, Link as LinkIcon, Settings } from 'lucide-react';

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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredCredentials, setRegisteredCredentials] = useState<{email: string, password: string} | null>(null);
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} kopierat till urklipp`);
  };

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

        setRegisteredCredentials({ email: data.email, password: data.password });
        setRegistrationSuccess(true);
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
      
      // If user was just created, show success message instead of navigating
      if (!user && !registrationSuccess) {
        setRegistrationSuccess(true);
        toast.info('Verifiera din e-post för att få full åtkomst till ditt konto.');
      } else {
        navigate('/developer-dashboard');
      }
    } catch (error: any) {
      toast.error('Kunde inte skapa profil: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen after account creation
  if (registrationSuccess && registeredCredentials) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Utvecklarkonto skapat!</CardTitle>
            <CardDescription>
              Ditt utvecklarkonto har skapats. Här är dina inloggningsuppgifter:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">E-postadress</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={registeredCredentials.email} 
                    readOnly 
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(registeredCredentials.email, 'E-postadress')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Lösenord</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={registeredCredentials.password} 
                    readOnly 
                    className="bg-white"
                    type="text"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(registeredCredentials.password, 'Lösenord')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                📧 Kontrollera din e-post och klicka på verifieringslänken
              </p>
              <p className="text-xs text-gray-500">
                Efter verifiering kan du logga in och komma åt din utvecklardashboard
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Gå till inloggning
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
            {user ? 'Skapa din utvecklarprofil' : 'Registrera dig som utvecklare'}
          </CardTitle>
          <CardDescription>
            {user 
              ? 'Fyll i dina uppgifter för att komma igång som utvecklare'
              : 'Skapa ditt konto och utvecklarprofil i ett steg'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Account Information - only show if not logged in */}
            {!user && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Skapa konto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-postadress *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        placeholder="din@epost.se"
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
                        placeholder="Minst 6 tecken"
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
                <Separator />
              </>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personliga uppgifter
              </h3>
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
                    <Label htmlFor="email_readonly">E-postadress</Label>
                    <Input
                      id="email_readonly"
                      value={user.email || ''}
                      readOnly
                      className="mt-1 bg-gray-100"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="070-123 45 67"
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
              </div>
            </div>

            {/* Professional Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professionell erfarenhet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem value="junior">Junior (0-2 år)</SelectItem>
                      <SelectItem value="medior">Medior (3-5 år)</SelectItem>
                      <SelectItem value="senior">Senior (6+ år)</SelectItem>
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

              <div>
                <Label htmlFor="cv_summary">Professionell sammanfattning *</Label>
                <Textarea
                  id="cv_summary"
                  {...form.register('cv_summary')}
                  placeholder="Beskriv din bakgrund, expertis och vad som gör dig unik som utvecklare..."
                  className="mt-1 h-32"
                />
                {form.formState.errors.cv_summary && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.cv_summary.message}
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Tekniska färdigheter
              </h3>
              <SkillSelector
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
              />
            </div>

            {/* Industry Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Branschexperientet
              </h3>
              <IndustrySelector
                selectedIndustries={selectedIndustries}
                onIndustriesChange={setSelectedIndustries}
              />
            </div>

            {/* Employment Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Anställningspreferenser
              </h3>
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
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ytterligare information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="md:col-span-2">
                  <Label htmlFor="certifications">Certifieringar</Label>
                  <Input
                    id="certifications"
                    {...form.register('certifications')}
                    placeholder="t.ex. AWS Certified, React Developer (separera med komma)"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Professionella länkar
              </h3>
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
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (user ? 'Skapar profil...' : 'Registrerar och skapar profil...') 
                  : (user ? 'Skapa utvecklarprofil' : 'Registrera dig och skapa profil')
                }
              </Button>
            </div>

            {!user && (
              <>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Har du redan ett konto?{' '}
                    <Button variant="link" onClick={() => navigate('/auth')} className="p-0">
                      Logga in här
                    </Button>
                  </p>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
