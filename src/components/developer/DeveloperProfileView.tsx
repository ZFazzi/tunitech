
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
  Award,
  Building,
  Eye,
  Heart,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp
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

interface ProjectMatch {
  id: string;
  match_score: number;
  status: string;
  customer_interested_at: string | null;
  developer_approved_at: string | null;
  project_requirement: {
    id: string;
    project_description: string;
    technical_skills: string;
    experience_level: string;
    employment_type: string;
    start_date: string;
    project_duration: string;
    created_at: string;
    customer: {
      company_name: string;
      contact_name: string;
    };
  };
}

interface AvailableProject {
  id: string;
  project_description: string;
  technical_skills: string;
  experience_level: string;
  employment_type: string;
  start_date: string;
  project_duration: string;
  created_at: string;
  customer: {
    company_name: string;
    contact_name: string;
  } | null;
}

export const DeveloperProfileView = () => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [matches, setMatches] = useState<ProjectMatch[]>([]);
  const [availableProjects, setAvailableProjects] = useState<AvailableProject[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'matches'>('profile');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchDeveloperProfile();
    }
  }, [user]);

  const fetchDeveloperProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching developer profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log('No developer profile found, redirecting to onboarding');
        navigate('/developer-onboarding');
        return;
      }

      if (error) {
        console.error('Error fetching developer:', error);
        throw error;
      }

      console.log('Developer profile found:', data);
      setDeveloper(data);
      
      // Hämta matchningar och tillgängliga projekt
      await Promise.all([
        fetchMatches(data.id),
        fetchAvailableProjects(data.id)
      ]);
      
    } catch (error: any) {
      console.error('Error in fetchDeveloperProfile:', error);
      toast.error('Kunde inte hämta utvecklarprofil');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (developerId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_matches')
        .select(`
          *,
          project_requirement:project_requirements (
            id,
            project_description,
            technical_skills,
            experience_level,
            employment_type,
            start_date,
            project_duration,
            created_at,
            customer:customers (
              company_name,
              contact_name
            )
          )
        `)
        .eq('developer_id', developerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchAvailableProjects = async (developerId: string) => {
    try {
      // Hämta alla aktiva projekt
      const { data: allProjects, error: projectError } = await supabase
        .from('project_requirements')
        .select(`
          *,
          customer:customers (
            company_name,
            contact_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (projectError) throw projectError;

      // Hämta befintliga matchningar för denna utvecklare
      const { data: existingMatches, error: matchError } = await supabase
        .from('project_matches')
        .select('project_requirement_id')
        .eq('developer_id', developerId);

      if (matchError) throw matchError;

      // Filtrera bort projekt som utvecklaren redan har matchningar för
      const existingProjectIds = new Set(existingMatches?.map(match => match.project_requirement_id) || []);
      const available = allProjects?.filter(project => !existingProjectIds.has(project.id)) || [];
      
      setAvailableProjects(available);
    } catch (error: any) {
      console.error('Error fetching available projects:', error);
    }
  };

  const calculateMatchScore = (project: AvailableProject, developer: Developer): number => {
    let score = 0;
    
    // Erfarenhetsnivå matchning (40%)
    if (project.experience_level === developer.experience_level) {
      score += 40;
    } else if (project.experience_level === 'junior' && ['medior', 'senior'].includes(developer.experience_level)) {
      score += 35;
    } else if (project.experience_level === 'medior' && developer.experience_level === 'senior') {
      score += 25;
    }
    
    // Tekniska färdigheter matchning (60%)
    const projectSkills = project.technical_skills.toLowerCase().split(/[,\s]+/).filter(s => s.length > 0);
    const developerSkills = developer.technical_skills.map(s => s.toLowerCase());
    
    let skillMatches = 0;
    projectSkills.forEach(skill => {
      if (developerSkills.some(devSkill => devSkill.includes(skill) || skill.includes(devSkill))) {
        skillMatches++;
      }
    });
    
    if (projectSkills.length > 0) {
      score += Math.round((skillMatches / projectSkills.length) * 60);
    }
    
    return Math.min(score, 100);
  };

  const expressInterest = async (projectId: string) => {
    if (!developer) return;

    try {
      const { error } = await supabase
        .from('project_matches')
        .insert({
          project_requirement_id: projectId,
          developer_id: developer.id,
          match_score: 0,
          developer_approved_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Intresse anmält!');
      
      // Uppdatera listor
      await Promise.all([
        fetchMatches(developer.id),
        fetchAvailableProjects(developer.id)
      ]);
      
    } catch (error: any) {
      toast.error('Kunde inte anmäla intresse');
    }
  };

  const approveMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('project_matches')
        .update({ developer_approved_at: new Date().toISOString() })
        .eq('id', matchId);

      if (error) throw error;

      toast.success('Projekt godkänt!');
      if (developer) {
        await fetchMatches(developer.id);
      }
    } catch (error: any) {
      toast.error('Kunde inte godkänna projekt');
    }
  };

  const rejectMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('project_matches')
        .update({ status: 'rejected' })
        .eq('id', matchId);

      if (error) throw error;

      toast.success('Projekt avböjt');
      if (developer) {
        await fetchMatches(developer.id);
      }
    } catch (error: any) {
      toast.error('Kunde inte avböja projekt');
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

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
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
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Utvecklarprofil saknas</h1>
            <p className="text-gray-600 mb-6">Du måste skapa en utvecklarprofil först.</p>
            <Button onClick={() => navigate('/developer-onboarding')}>
              Skapa Utvecklarprofil
            </Button>
          </CardContent>
        </Card>
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

  // Separera matchningar
  const customerInterestedMatches = matches.filter(m => m.customer_interested_at && !m.developer_approved_at && m.status !== 'rejected');
  const confirmedMatches = matches.filter(m => m.customer_interested_at && m.developer_approved_at && m.status !== 'rejected');
  const pendingMatches = matches.filter(m => m.developer_approved_at && !m.customer_interested_at && m.status !== 'rejected');

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
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
              
              <div className="flex flex-wrap gap-2">
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

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Min Profil
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tillgängliga Projekt ({availableProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'matches'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mina Matchningar ({matches.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Kontaktinformation */}
          <Card>
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
              
              {/* Sociala länkar */}
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

          {/* Färdigheter och erfarenhet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>

          {/* CV-sammanfattning */}
          {developer.cv_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Sammanfattning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{developer.cv_summary}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <Card>
          <CardHeader>
            <CardTitle>Tillgängliga Projekt</CardTitle>
            <CardDescription>
              Bläddra bland aktiva projekt och anmäl ditt intresse
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableProjects.length > 0 ? (
              <div className="space-y-4">
                {availableProjects.map((project) => {
                  const matchScore = calculateMatchScore(project, developer);
                  const isExpanded = expandedProjects.has(project.id);
                  
                  return (
                    <Card key={project.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold">
                                {project.customer?.company_name || 'Projekt'}
                              </h3>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="font-semibold text-green-600">
                                    {matchScore}% matchning
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleProjectExpansion(project.id)}
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-2">
                              {isExpanded ? project.project_description : 
                               `${project.project_description.substring(0, 150)}${project.project_description.length > 150 ? '...' : ''}`}
                            </p>
                            
                            {isExpanded && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                                <div>
                                  <h4 className="font-semibold mb-1">Erfarenhetsnivå:</h4>
                                  <p className="text-gray-600">{getExperienceLevelLabel(project.experience_level)}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-1">Startdatum:</h4>
                                  <p className="text-gray-600">
                                    {new Date(project.start_date).toLocaleDateString('sv-SE')}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-1">Varaktighet:</h4>
                                  <p className="text-gray-600">{project.project_duration}</p>
                                </div>
                              </div>
                            )}
                            
                            {!isExpanded && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline">{getExperienceLevelLabel(project.experience_level)}</Badge>
                                <Badge variant="outline">{project.project_duration}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Publicerat: {new Date(project.created_at).toLocaleDateString('sv-SE')}
                          </div>
                          <Button onClick={() => expressInterest(project.id)}>
                            <Heart className="w-4 h-4 mr-2" />
                            Anmäl Intresse
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Inga tillgängliga projekt för tillfället.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-6">
          {/* Kunder som har anmält intresse */}
          {customerInterestedMatches.length > 0 && (
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center text-pink-600">
                  <Heart className="w-5 h-5 mr-2" />
                  Kundintresse ({customerInterestedMatches.length})
                </CardTitle>
                <CardDescription>
                  Kunder som har anmält intresse för dina tjänster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerInterestedMatches.map((match) => (
                    <Card key={match.id} className="bg-pink-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">
                            {match.project_requirement?.customer?.company_name || 'Projekt'}
                          </h4>
                          <Badge className="bg-pink-500">
                            Kunden intresserad!
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {match.project_requirement?.project_description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => approveMatch(match.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Godkänn
                          </Button>
                          <Button 
                            onClick={() => rejectMatch(match.id)}
                            variant="outline"
                            className="border-red-500 text-red-500"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Avböj
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bekräftade matchningar */}
          {confirmedMatches.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Bekräftade Matchningar ({confirmedMatches.length})
                </CardTitle>
                <CardDescription>
                  Projektmatchningar där båda parter har godkänt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {confirmedMatches.map((match) => (
                    <Card key={match.id} className="bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">
                            {match.project_requirement?.customer?.company_name || 'Projekt'}
                          </h4>
                          <Badge className="bg-green-500">
                            Matchning bekräftad!
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          Kontakt: {match.project_requirement?.customer?.contact_name}
                        </p>
                        <p className="text-gray-600">
                          {match.project_requirement?.project_description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Väntande matchningar */}
          {pendingMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Väntande Svar ({pendingMatches.length})</CardTitle>
                <CardDescription>
                  Projekt där du har anmält intresse och väntar på kundens svar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingMatches.map((match) => (
                    <Card key={match.id} className="bg-yellow-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">
                            {match.project_requirement?.customer?.company_name || 'Projekt'}
                          </h4>
                          <Badge variant="outline">
                            Väntar på kund
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          {match.project_requirement?.project_description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {matches.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Inga matchningar ännu.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Anmäl intresse för projekt under fliken "Tillgängliga Projekt"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
