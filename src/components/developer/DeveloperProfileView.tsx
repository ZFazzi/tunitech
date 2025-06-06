
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Edit,
  Github,
  Linkedin,
  Globe,
  Languages,
  GraduationCap,
  Award
} from 'lucide-react';
import { DeveloperProfileEdit } from './DeveloperProfileEdit';

interface Developer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  experience_level: string;
  years_of_experience: number;
  hourly_rate: number | null;
  technical_skills: string[];
  industry_experience: string[] | null;
  languages: string[] | null;
  education: string | null;
  cv_summary: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  certifications: string[] | null;
  is_approved: boolean;
  available_for_work: boolean;
  profile_picture_url: string | null;
  preferred_employment_types: string[] | null;
}

export const DeveloperProfileView = () => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeveloperProfile();
  }, [user]);

  const fetchDeveloperProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No developer profile found
        navigate('/developer-onboarding');
        return;
      }

      if (error) throw error;
      setDeveloper(data);
    } catch (error: any) {
      toast.error('Kunde inte hämta utvecklarprofil');
    } finally {
      setLoading(false);
    }
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      'junior': 'Junior',
      'medior': 'Medior',
      'senior': 'Senior'
    };
    return labels[level] || level;
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'hourly': 'Timanställd',
      'part_time': 'Deltid',
      'full_time': 'Heltid',
      'other': 'Övrigt'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-white">Laddar profil...</div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Utvecklarprofil saknas</h1>
        <p className="text-gray-400 mb-6">Du måste skapa en utvecklarprofil först.</p>
        <Button onClick={() => navigate('/developer-onboarding')}>
          Skapa Utvecklarprofil
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <DeveloperProfileEdit 
        developer={developer} 
        onSave={() => {
          setIsEditing(false);
          fetchDeveloperProfile();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Avatar and Basic Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={developer.profile_picture_url || undefined} />
              <AvatarFallback className="text-lg">
                {developer.first_name[0]}{developer.last_name[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {developer.first_name} {developer.last_name}
                  </h1>
                  <p className="text-gray-600">{getExperienceLevelLabel(developer.experience_level)} Utvecklare</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="mt-2 sm:mt-0">
                  <Edit className="w-4 h-4 mr-2" />
                  Redigera Profil
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={developer.is_approved ? 'default' : 'secondary'}>
                  {developer.is_approved ? 'Godkänd' : 'Väntar på godkännande'}
                </Badge>
                <Badge variant={developer.available_for_work ? 'default' : 'secondary'}>
                  {developer.available_for_work ? 'Tillgänglig' : 'Ej tillgänglig'}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {developer.years_of_experience} års erfarenhet
                </Badge>
                {developer.hourly_rate && (
                  <Badge variant="outline">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {developer.hourly_rate} kr/tim
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Kontaktinformation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span>{developer.email}</span>
            </div>
            {developer.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{developer.phone}</span>
              </div>
            )}
            {developer.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{developer.location}</span>
              </div>
            )}
          </div>
          
          {/* Social Links */}
          {(developer.linkedin_url || developer.github_url || developer.portfolio_url) && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Länkar</h4>
              <div className="flex flex-wrap gap-2">
                {developer.linkedin_url && (
                  <a 
                    href={developer.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </a>
                )}
                {developer.github_url && (
                  <a 
                    href={developer.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <Github className="w-4 h-4 mr-1" />
                    GitHub
                  </a>
                )}
                {developer.portfolio_url && (
                  <a 
                    href={developer.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-green-600 hover:text-green-800"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills and Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Tekniska färdigheter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {developer.technical_skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anställningstyper</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {developer.preferred_employment_types?.map((type, index) => (
                <Badge key={index} variant="secondary">
                  {getEmploymentTypeLabel(type)}
                </Badge>
              )) || <span className="text-gray-500">Inte specificerat</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {developer.industry_experience && developer.industry_experience.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Branschexperienhet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {developer.industry_experience.map((industry, index) => (
                  <Badge key={index} variant="outline">
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {developer.languages && developer.languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                Språk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {developer.languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {developer.education && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Utbildning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{developer.education}</p>
            </CardContent>
          </Card>
        )}

        {developer.certifications && developer.certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certifieringar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {developer.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CV Summary */}
      {developer.cv_summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sammanfattning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 whitespace-pre-wrap">{developer.cv_summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
