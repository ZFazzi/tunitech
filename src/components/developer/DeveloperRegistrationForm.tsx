
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
    preferred_employment_types: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const skillsArray = formData.technical_skills.split(',').map(s => s.trim()).filter(s => s);
      const industryArray = formData.industry_experience.split(',').map(s => s.trim()).filter(s => s);
      const languagesArray = formData.languages.split(',').map(s => s.trim()).filter(s => s);
      const certificationsArray = formData.certifications.split(',').map(s => s.trim()).filter(s => s);

      const { error } = await supabase
        .from('developers')
        .insert([{
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          experience_level: formData.experience_level as any,
          years_of_experience: parseInt(formData.years_of_experience),
          technical_skills: skillsArray,
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
        }]);

      if (error) throw error;
      
      toast.success('Utvecklarprofil skapad! Din profil väntar på godkännande.');
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
          <CardDescription>Skapa din profil för att få matchningar med projekt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="technical_skills">Tekniska färdigheter *</Label>
              <Textarea
                id="technical_skills"
                value={formData.technical_skills}
                onChange={(e) => setFormData(prev => ({ ...prev, technical_skills: e.target.value }))}
                placeholder="t.ex. React, Node.js, Python, PostgreSQL (separera med komma)"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="industry_experience">Branschexpertis</Label>
              <Input
                id="industry_experience"
                value={formData.industry_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, industry_experience: e.target.value }))}
                placeholder="t.ex. Fintech, E-handel, Sjukvård (separera med komma)"
              />
            </div>

            <div>
              <Label htmlFor="cv_summary">CV-sammanfattning *</Label>
              <Textarea
                id="cv_summary"
                value={formData.cv_summary}
                onChange={(e) => setFormData(prev => ({ ...prev, cv_summary: e.target.value }))}
                placeholder="Beskriv din bakgrund och erfarenhet kort"
                rows={4}
                required
              />
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="location">Plats</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="t.ex. Tunis, Tunisien"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="languages">Språk</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                  placeholder="t.ex. Svenska, Engelska, Arabiska, Franska"
                />
              </div>
              <div>
                <Label htmlFor="certifications">Certifieringar</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                  placeholder="t.ex. AWS Certified, Google Cloud"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="education">Utbildning</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Beskriv din utbildningsbakgrund"
                rows={3}
              />
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
