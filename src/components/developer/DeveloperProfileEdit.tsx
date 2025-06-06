
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().min(1, 'Förnamn krävs'),
  last_name: z.string().min(1, 'Efternamn krävs'),
  email: z.string().email('Ogiltig e-postadress'),
  phone: z.string().optional(),
  location: z.string().optional(),
  experience_level: z.enum(['junior', 'medior', 'senior']),
  years_of_experience: z.number().min(0, 'Års erfarenhet måste vara 0 eller mer'),
  hourly_rate: z.number().optional(),
  technical_skills: z.string().min(1, 'Tekniska färdigheter krävs'),
  industry_experience: z.string().optional(),
  languages: z.string().optional(),
  education: z.string().optional(),
  cv_summary: z.string().optional(),
  linkedin_url: z.string().optional(),
  github_url: z.string().optional(),
  portfolio_url: z.string().optional(),
  certifications: z.string().optional(),
  available_for_work: z.boolean(),
  preferred_employment_types: z.array(z.enum(['hourly', 'part_time', 'full_time', 'other'])).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface DeveloperProfileEditProps {
  developer: any;
  onSave: () => void;
  onCancel: () => void;
}

export const DeveloperProfileEdit: React.FC<DeveloperProfileEditProps> = ({
  developer,
  onSave,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(developer.profile_picture_url);
  const { user } = useAuth();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: developer.first_name || '',
      last_name: developer.last_name || '',
      email: developer.email || '',
      phone: developer.phone || '',
      location: developer.location || '',
      experience_level: developer.experience_level,
      years_of_experience: developer.years_of_experience || 0,
      hourly_rate: developer.hourly_rate || undefined,
      technical_skills: developer.technical_skills?.join(', ') || '',
      industry_experience: developer.industry_experience?.join(', ') || '',
      languages: developer.languages?.join(', ') || '',
      education: developer.education || '',
      cv_summary: developer.cv_summary || '',
      linkedin_url: developer.linkedin_url || '',
      github_url: developer.github_url || '',
      portfolio_url: developer.portfolio_url || '',
      certifications: developer.certifications?.join(', ') || '',
      available_for_work: developer.available_for_work || false,
      preferred_employment_types: developer.preferred_employment_types || [],
    },
  });

  const employmentTypes = [
    { value: 'hourly' as const, label: 'Timanställd' },
    { value: 'part_time' as const, label: 'Deltid' },
    { value: 'full_time' as const, label: 'Heltid' },
    { value: 'other' as const, label: 'Övrigt' }
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfilePictureUrl(publicUrl);
      toast.success('Profilbild uppladdad!');
    } catch (error: any) {
      toast.error('Kunde inte ladda upp bild: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        ...data,
        technical_skills: data.technical_skills.split(',').map(s => s.trim()).filter(s => s),
        industry_experience: data.industry_experience ? 
          data.industry_experience.split(',').map(s => s.trim()).filter(s => s) : null,
        languages: data.languages ? 
          data.languages.split(',').map(s => s.trim()).filter(s => s) : null,
        certifications: data.certifications ? 
          data.certifications.split(',').map(s => s.trim()).filter(s => s) : null,
        profile_picture_url: profilePictureUrl,
        preferred_employment_types: data.preferred_employment_types as ('hourly' | 'part_time' | 'full_time' | 'other')[],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('developers')
        .update(updateData)
        .eq('id', developer.id);

      if (error) throw error;

      toast.success('Profil uppdaterad!');
      onSave();
    } catch (error: any) {
      toast.error('Kunde inte uppdatera profil: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Redigera Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profilePictureUrl || undefined} />
                <AvatarFallback className="text-lg">
                  {developer.first_name[0]}{developer.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <div className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Laddar upp...' : 'Ladda upp bild'}</span>
                  </div>
                </Label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG eller GIF. Max 5MB.
                </p>
              </div>
            </div>

            {/* Basic Information */}
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
                  {...form.register('years_of_experience', { valueAsNumber: true })}
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
                  {...form.register('hourly_rate', { valueAsNumber: true })}
                  placeholder="t.ex. 800"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Skills and Experience */}
            <div>
              <Label htmlFor="technical_skills">Tekniska färdigheter *</Label>
              <Textarea
                id="technical_skills"
                {...form.register('technical_skills')}
                placeholder="t.ex. React, TypeScript, Node.js, Python (separera med komma)"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separera färdigheter med komma
              </p>
              {form.formState.errors.technical_skills && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.technical_skills.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="industry_experience">Branschexperientet</Label>
              <Textarea
                id="industry_experience"
                {...form.register('industry_experience')}
                placeholder="t.ex. Fintech, E-handel, Sjukvård (separera med komma)"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separera branscher med komma
              </p>
            </div>

            <div>
              <Label htmlFor="languages">Språk</Label>
              <Input
                id="languages"
                {...form.register('languages')}
                placeholder="t.ex. Svenska, Engelska, Tyska (separera med komma)"
                className="mt-1"
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
              <Label htmlFor="certifications">Certifieringar</Label>
              <Input
                id="certifications"
                {...form.register('certifications')}
                placeholder="t.ex. AWS Certified, React Developer (separera med komma)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cv_summary">CV Sammanfattning</Label>
              <Textarea
                id="cv_summary"
                {...form.register('cv_summary')}
                placeholder="Beskriv din bakgrund och erfarenhet..."
                className="mt-1 h-32"
              />
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Avbryt
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sparar...' : 'Spara Ändringar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
