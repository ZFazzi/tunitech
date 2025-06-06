
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const DeveloperRegistrationForm = () => {
  const [step, setStep] = useState(1); // 1 for account creation, 2 for profile
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    experience_level: '',
    years_of_experience: '',
    technical_skills: '',
    industry_experience: '',
    cv_summary: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    hourly_rate: '',
    location: '',
    languages: '',
    certifications: '',
    education: '',
    preferred_employment_types: [] as string[],
    programming_languages: '',
    frameworks: '',
    databases: '',
    tools_and_methods: ''
  });
  const [loading, setLoading] = useState(false);
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, skip to step 2
  React.useEffect(() => {
    if (user) {
      setStep(2);
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleAccountCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authData.password !== authData.confirmPassword) {
      toast.error('Lösenorden matchar inte');
      return;
    }

    if (authData.password.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken');
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/developer-onboarding`;
      const { error } = await signUp(authData.email, authData.password, { 
        user_type: 'developer',
        emailRedirectTo: redirectUrl
      });
      
      if (error) throw error;
      
      // Set email in profile form and move to next step
      setFormData(prev => ({ ...prev, email: authData.email }));
      setStep(2);
      
      toast.success('Konto skapat! Fyll nu i din utvecklarprofil.');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('User already registered')) {
        toast.error('En användare med denna e-postadress finns redan. Försök logga in istället.');
      } else {
        toast.error(error.message || 'Något gick fel vid registrering');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Du måste vara inloggad för att skapa en profil');
      return;
    }
    
    setLoading(true);

    try {
      // Combine all technical skills into one array
      const programmingLanguages = formData.programming_languages.split(',').map(s => s.trim()).filter(s => s);
      const frameworks = formData.frameworks.split(',').map(s => s.trim()).filter(s => s);
      const databases = formData.databases.split(',').map(s => s.trim()).filter(s => s);
      const toolsAndMethods = formData.tools_and_methods.split(',').map(s => s.trim()).filter(s => s);
      
      const allTechnicalSkills = [...programmingLanguages, ...frameworks, ...databases, ...toolsAndMethods];
      
      const industryArray = formData.industry_experience.split(',').map(s => s.trim()).filter(s => s);
      const languagesArray = formData.languages.split(',').map(s => s.trim()).filter(s => s);
      const certificationsArray = formData.certifications.split(',').map(s => s.trim()).filter(s => s);

      const { data: insertedDeveloper, error } = await supabase
        .from('developers')
        .insert([{
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          experience_level: formData.experience_level as any,
          years_of_experience: parseInt(formData.years_of_experience),
          technical_skills: allTechnicalSkills,
          industry_experience: industryArray,
          cv_summary: formData.cv_summary,
          portfolio_url: formData.portfolio_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          location: formData.location,
          languages: languagesArray,
          certifications: certificationsArray,
          education: formData.education,
          preferred_employment_types: formData.preferred_employment_types as any,
          available_for_work: true,
          is_approved: false
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Generate AI title after successful profile creation
      try {
        const { data, error: titleError } = await supabase.functions.invoke('generate-developer-title', {
          body: {
            developerId: insertedDeveloper.id,
            cvSummary: formData.cv_summary,
            technicalSkills: allTechnicalSkills,
            experienceLevel: formData.experience_level
          }
        });

        if (titleError) {
          console.error('Error generating AI title:', titleError);
          // Don't fail the whole process if AI title generation fails
        } else {
          console.log('AI title generated:', data?.title);
        }
      } catch (titleError) {
        console.error('Failed to generate AI title:', titleError);
        // Continue with success even if AI title generation fails
      }
      
      toast.success('Utvecklarprofil skapad! Din profil väntar på godkännande och AI har genererat en passande rubrik för dig.');
      navigate('/developer-dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  const handleEmploymentTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferred_employment_types: checked 
        ? [...prev.preferred_employment_types, type]
        : prev.preferred_employment_types.filter(t => t !== type)
    }));
  };

  if (step === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto p-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Skapa utvecklarkonto</CardTitle>
            <CardDescription>Först behöver du skapa ett konto för att sedan fylla i din utvecklarprofil</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccountCreation} className="space-y-4">
              <div>
                <Label htmlFor="email">E-postadress *</Label>
                <Input
                  id="email"
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Lösenord *</Label>
                <Input
                  id="password"
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Bekräfta lösenord *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={authData.confirmPassword}
                  onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Skapar konto...' : 'Skapa konto och fortsätt'}
              </Button>
              <div className="text-center text-sm text-gray-600">
                Har du redan ett konto?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => navigate('/auth')}
                >
                  Logga in här
                </Button>
              </div>
            </form>
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
          <CardTitle>Utvecklarprofil</CardTitle>
          <CardDescription>Skapa din profil baserat på ditt CV för att få matchningar med projekt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-8">
            {/* Personliga uppgifter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Personliga uppgifter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Förnamn *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Efternamn *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Plats *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="t.ex. Sousse, Tunisien"
                  required
                />
              </div>
            </div>

            {/* Profil/Sammanfattning */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Profil</h3>
              <div>
                <Label htmlFor="cv_summary">Profil/CV-sammanfattning *</Label>
                <Textarea
                  id="cv_summary"
                  value={formData.cv_summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, cv_summary: e.target.value }))}
                  placeholder="Beskriv din bakgrund, specialisering och vad som gör dig unik som utvecklare..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Erfarenhet */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Erfarenhet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Erfarenhetsnivå *</Label>
                  <Select 
                    value={formData.experience_level} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj erfarenhetsnivå" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (1-3 år)</SelectItem>
                      <SelectItem value="medior">Medior (3-5 år)</SelectItem>
                      <SelectItem value="senior">Senior (5+ år)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="years_of_experience">År av erfarenhet *</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    value={formData.years_of_experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="industry_experience">Branschexpertis</Label>
                <Input
                  id="industry_experience"
                  value={formData.industry_experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry_experience: e.target.value }))}
                  placeholder="t.ex. Fintech, Banktjänster, E-handel, Sjukvård"
                />
              </div>
            </div>

            {/* Kompetenser */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Kompetenser</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="programming_languages">Programmeringsspråk *</Label>
                  <Input
                    id="programming_languages"
                    value={formData.programming_languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, programming_languages: e.target.value }))}
                    placeholder="t.ex. Java, JavaScript, TypeScript, Python"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="frameworks">Ramverk och bibliotek *</Label>
                  <Input
                    id="frameworks"
                    value={formData.frameworks}
                    onChange={(e) => setFormData(prev => ({ ...prev, frameworks: e.target.value }))}
                    placeholder="t.ex. Spring Boot, React, Angular, Node.js"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="databases">Databaser</Label>
                  <Input
                    id="databases"
                    value={formData.databases}
                    onChange={(e) => setFormData(prev => ({ ...prev, databases: e.target.value }))}
                    placeholder="t.ex. PostgreSQL, MySQL, MongoDB"
                  />
                </div>
                <div>
                  <Label htmlFor="tools_and_methods">Verktyg och metoder</Label>
                  <Input
                    id="tools_and_methods"
                    value={formData.tools_and_methods}
                    onChange={(e) => setFormData(prev => ({ ...prev, tools_and_methods: e.target.value }))}
                    placeholder="t.ex. Git, Docker, Jenkins, Scrum, UML"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Utbildning</h3>
              <div>
                <Label htmlFor="education">Utbildningsbakgrund</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="t.ex. Ingenjörsutbildning i datavetenskap, ESPRIT | 2020-2023 | Ariana, Tunisien"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Språkkunskaper</h3>
              <div>
                <Label htmlFor="languages">Språk</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                  placeholder="t.ex. Svenska, Engelska, Arabiska, Franska"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Portfolio och länkar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="portfolio_url">Portfolio URL</Label>
                  <Input
                    id="portfolio_url"
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Anställningsform och timpris</h3>
              <div>
                <Label>Föredragen anställningsform</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {[
                    { value: 'hourly', label: 'Timanställd' },
                    { value: 'part_time', label: 'Deltid' },
                    { value: 'full_time', label: 'Heltid' },
                    { value: 'other', label: 'Övrigt' }
                  ].map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={formData.preferred_employment_types.includes(type.value)}
                        onCheckedChange={(checked) => handleEmploymentTypeChange(type.value, Boolean(checked))}
                      />
                      <Label htmlFor={type.value}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="hourly_rate">Timpris (SEK)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  min="0"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                  placeholder="t.ex. 850"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Certifieringar</h3>
              <div>
                <Label htmlFor="certifications">Certifieringar</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                  placeholder="t.ex. AWS Certified, Google Cloud, Oracle Certified"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sparar profil...' : 'Skapa utvecklarprofil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
