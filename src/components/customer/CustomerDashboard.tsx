import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Calendar, Building, Users, Bell, Edit, MapPin, Languages, Award, DollarSign, User, Eye, UserPlus, Briefcase } from 'lucide-react';

interface Customer {
  id: string;
  company_name: string;
  contact_name: string;
}

interface ProjectRequirement {
  id: string;
  project_description: string;
  technical_skills: string;
  experience_level: string;
  employment_type: string;
  start_date: string;
  project_duration: string;
  created_at: string;
}

interface ProjectMatch {
  id: string;
  match_score: number;
  status: string;
  customer_interested_at: string | null;
  developer_approved_at: string | null;
  developer: {
    id: string;
    first_name: string;
    last_name: string;
    experience_level: string;
    technical_skills: string[];
    years_of_experience: number;
    industry_experience: string[];
    cv_summary: string;
    hourly_rate: number;
    location: string;
    languages: string[];
    certifications: string[];
    education: string;
    profile_picture_url: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
  };
}

interface TeamMember {
  id: string;
  hired_at: string;
  status: string;
  role_in_team: string | null;
  developer: {
    id: string;
    first_name: string;
    last_name: string;
    experience_level: string;
    technical_skills: string[];
    years_of_experience: number;
    profile_picture_url: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    hourly_rate: number;
    location: string;
  };
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export const CustomerDashboard = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<ProjectRequirement[]>([]);
  const [matches, setMatches] = useState<ProjectMatch[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerData();
  }, [user]);

  const fetchCustomerData = async () => {
    if (!user) return;

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (customerError && customerError.code === 'PGRST116') {
        navigate('/customer-onboarding');
        return;
      }

      if (customerError) throw customerError;
      setCustomer(customerData);

      await Promise.all([
        fetchProjects(customerData.id),
        fetchTeamMembers(customerData.id),
        fetchNotifications()
      ]);
    } catch (error: any) {
      toast.error('Kunde inte hämta kunddata');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_requirements')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);

      if (data && data.length > 0) {
        setSelectedProject(data[0].id);
        fetchMatches(data[0].id);
      }
    } catch (error: any) {
      toast.error('Kunde inte hämta projekt');
    }
  };

  const fetchTeamMembers = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_developer_teams')
        .select(`
          *,
          developer:developers (
            id,
            first_name,
            last_name,
            experience_level,
            technical_skills,
            years_of_experience,
            profile_picture_url,
            linkedin_url,
            github_url,
            portfolio_url,
            hourly_rate,
            location
          )
        `)
        .eq('customer_id', customerId)
        .eq('status', 'active')
        .order('hired_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error: any) {
      toast.error('Kunde inte hämta teammedlemmar');
    }
  };

  const fetchMatches = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_matches')
        .select(`
          *,
          developer:developers (
            id,
            first_name,
            last_name,
            experience_level,
            technical_skills,
            years_of_experience,
            industry_experience,
            cv_summary,
            hourly_rate,
            location,
            languages,
            certifications,
            education,
            profile_picture_url,
            linkedin_url,
            github_url,
            portfolio_url
          )
        `)
        .eq('project_requirement_id', projectId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast.error('Kunde inte hämta matchningar');
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Kunde inte hämta notifikationer:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read_at: new Date().toISOString() }
          : notif
      ));
    } catch (error: any) {
      console.error('Kunde inte markera notifikation som läst:', error);
    }
  };

  const showInterest = async (matchId: string) => {
    console.log('showInterest called with matchId:', matchId);
    
    try {
      // Log the current user and customer
      console.log('Current user:', user?.id);
      console.log('Current customer:', customer?.id);
      
      const { data, error } = await supabase
        .from('project_matches')
        .update({ 
          customer_interested_at: new Date().toISOString(),
          status: 'customer_interested'
        })
        .eq('id', matchId)
        .select(); // Add select to get the updated data back

      console.log('Supabase update result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Update the local state
      setMatches(prev => {
        const updated = prev.map(match => 
          match.id === matchId 
            ? { 
                ...match, 
                customer_interested_at: new Date().toISOString(),
                status: 'customer_interested'
              }
            : match
        );
        console.log('Updated matches:', updated);
        return updated;
      });

      toast.success('Intresse anmält! Utvecklaren kommer att få en notifikation.');
    } catch (error: any) {
      console.error('Error in showInterest:', error);
      toast.error(`Kunde inte anmäla intresse: ${error.message}`);
    }
  };

  const hireDeveloper = async (matchId: string, developerId: string) => {
    if (!customer) return;

    try {
      const { error } = await supabase
        .from('customer_developer_teams')
        .insert({
          customer_id: customer.id,
          developer_id: developerId,
          project_match_id: matchId,
          status: 'active'
        });

      if (error) throw error;

      // Uppdatera match status
      await supabase
        .from('project_matches')
        .update({ status: 'hired' })
        .eq('id', matchId);

      await fetchTeamMembers(customer.id);
      if (selectedProject) {
        await fetchMatches(selectedProject);
      }

      toast.success('Utvecklaren har anställts och lagts till i ditt team!');
    } catch (error: any) {
      toast.error('Kunde inte anställa utvecklaren');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tunitech-mint';
    if (score >= 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getMatchStatus = (match: ProjectMatch) => {
    if (match.status === 'hired') {
      return { label: 'Anställd', color: 'bg-tunitech-mint' };
    }
    if (match.developer_approved_at && match.customer_interested_at) {
      return { label: 'Matchad - Kan anställas', color: 'bg-tunitech-blue' };
    }
    if (match.customer_interested_at) {
      return { label: 'Intresse anmält', color: 'bg-secondary' };
    }
    return { label: 'Väntande', color: 'bg-muted' };
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      'junior': 'Junior',
      'medior': 'Medior',
      'senior': 'Senior'
    };
    return labels[level] || level;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-foreground">Laddar...</div>;
  }

  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Kundprofil saknas</h1>
        <p className="text-muted-foreground mb-6">Du måste skapa en kundprofil först.</p>
        <Button onClick={() => navigate('/customer-onboarding')}>
          Skapa Kundprofil
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Välkommen, {customer.contact_name}!
          </h1>
          <p className="text-muted-foreground">{customer.company_name}</p>
        </div>
        <Button onClick={() => navigate('/project-requirement')}>
          <Plus className="w-4 h-4 mr-2" />
          Ny Kravspecifikation
        </Button>
      </div>

      {/* Notifikationer */}
      {notifications.length > 0 && (
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-card-foreground">
              <Bell className="w-5 h-5 mr-2" />
              Notifikationer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read_at ? 'bg-muted/50 border-border' : 'bg-accent/50 border-accent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">{notification.title}</h4>
                      <p className="text-muted-foreground text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                    {!notification.read_at && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Markera som läst
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Utvecklarteam */}
      {teamMembers.length > 0 && (
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-card-foreground">
              <Users className="w-5 h-5 mr-2" />
              Ditt Utvecklarteam
            </CardTitle>
            <CardDescription>Utvecklare som är anställda av ditt företag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.developer.profile_picture_url} />
                      <AvatarFallback>
                        {member.developer.first_name[0]}{member.developer.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground truncate">
                        {member.developer.first_name} {member.developer.last_name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {getExperienceLevelLabel(member.developer.experience_level)} Utvecklare
                      </p>
                      {member.role_in_team && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.role_in_team}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {member.developer.years_of_experience} år
                        </Badge>
                        {member.developer.hourly_rate && (
                          <Badge variant="outline" className="text-xs">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {member.developer.hourly_rate} SEK/tim
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Anställd: {new Date(member.hired_at).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projektlista */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Mina Projekt</CardTitle>
            <CardDescription>Klicka på ett projekt för att se eller redigera kravspecifikationen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProject === project.id 
                        ? 'border-primary bg-accent' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedProject(project.id);
                      fetchMatches(project.id);
                    }}
                  >
                    <h4 className="font-semibold text-card-foreground mb-1">
                      {project.project_description.substring(0, 60)}...
                    </h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(project.created_at).toLocaleDateString('sv-SE')}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project-specification/${project.id}`);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Visa/Redigera kravspec
                  </Button>
                </div>
              ))}
              
              {projects.length === 0 && (
                <div className="text-center py-6">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Inga projekt än</p>
                  <Button onClick={() => navigate('/project-requirement')}>
                    Skapa första projektet
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Matchningar */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-card-foreground">
                <Users className="w-5 h-5 mr-2" />
                Utvecklarmatchningar
              </CardTitle>
              <CardDescription>
                {selectedProject ? 'Anonyma utvecklarprofiler som matchar ditt valda projekt' : 'Välj ett projekt för att se matchningar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProject ? (
                <div className="space-y-6">
                  {matches.map((match) => {
                    const status = getMatchStatus(match);
                    const developer = match.developer;
                    const isHired = match.status === 'hired';
                    const canHire = match.customer_interested_at && match.developer_approved_at && !isHired;
                    
                    console.log('Rendering match:', {
                      id: match.id,
                      status: match.status,
                      customer_interested_at: match.customer_interested_at,
                      developer_approved_at: match.developer_approved_at,
                      isHired,
                      canHire
                    });
                    
                    return (
                      <div key={match.id} className="border border-border rounded-lg p-6 bg-card">
                        {/* Developer Header - Show real info if hired, otherwise anonymous */}
                        <div className="flex items-start gap-4 mb-6">
                          {isHired ? (
                            <>
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={developer.profile_picture_url} />
                                <AvatarFallback>
                                  {developer.first_name[0]}{developer.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h3 className="text-xl font-bold text-card-foreground">
                                      {developer.first_name} {developer.last_name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {getExperienceLevelLabel(developer.experience_level)} Utvecklare
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center mb-1">
                                      <Star className={`w-5 h-5 mr-1 ${getScoreColor(match.match_score)}`} />
                                      <span className={`text-xl font-bold ${getScoreColor(match.match_score)}`}>
                                        {match.match_score}%
                                      </span>
                                    </div>
                                    <Badge className={status.color + ' text-foreground'}>
                                      {status.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h3 className="text-xl font-bold text-card-foreground">
                                      Anonym Utvecklare #{match.id.substring(0, 8)}
                                    </h3>
                                    <p className="text-muted-foreground">
                                      {getExperienceLevelLabel(developer.experience_level)} Utvecklare
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center mb-1">
                                      <Star className={`w-5 h-5 mr-1 ${getScoreColor(match.match_score)}`} />
                                      <span className={`text-xl font-bold ${getScoreColor(match.match_score)}`}>
                                        {match.match_score}%
                                      </span>
                                    </div>
                                    <Badge className={status.color + ' text-foreground'}>
                                      {status.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">
                            <User className="w-3 h-3 mr-1" />
                            {developer.years_of_experience} års erfarenhet
                          </Badge>
                          {developer.hourly_rate && (
                            <Badge variant="outline">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {developer.hourly_rate} SEK/tim
                            </Badge>
                          )}
                          {developer.location && (
                            <Badge variant="outline">
                              <MapPin className="w-3 h-3 mr-1" />
                              {developer.location}
                            </Badge>
                          )}
                        </div>

                        {/* Developer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* CV Summary */}
                          {developer.cv_summary && (
                            <div className="md:col-span-2">
                              <h4 className="font-semibold text-card-foreground mb-2">Professionell sammanfattning:</h4>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {developer.cv_summary}
                              </p>
                            </div>
                          )}
                          
                          {/* Technical Skills */}
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-2">Tekniska färdigheter:</h4>
                            <div className="flex flex-wrap gap-1">
                              {developer.technical_skills?.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Industry Experience */}
                          {developer.industry_experience && developer.industry_experience.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-card-foreground mb-2">Branschexpertis:</h4>
                              <div className="flex flex-wrap gap-1">
                                {developer.industry_experience.map((exp, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Languages */}
                          {developer.languages && developer.languages.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-card-foreground mb-2 flex items-center">
                                <Languages className="w-4 h-4 mr-1" />
                                Språk:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {developer.languages.map((language, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {language}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Certifications */}
                          {developer.certifications && developer.certifications.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-card-foreground mb-2 flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                Certifieringar:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {developer.certifications.map((cert, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Education */}
                          {developer.education && (
                            <div className="md:col-span-2">
                              <h4 className="font-semibold text-card-foreground mb-2">Utbildning:</h4>
                              <p className="text-muted-foreground text-sm">{developer.education}</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {!match.customer_interested_at && !isHired && (
                          <div className="bg-accent/20 border border-accent rounded-lg p-4 mb-4">
                            <div className="flex items-start space-x-3">
                              <Eye className="w-5 h-5 text-accent-foreground mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-accent-foreground mb-1">Intresserad av denna utvecklare?</h4>
                                <p className="text-accent-foreground/80 text-sm mb-3">
                                  Genom att anmäla intresse kommer utvecklaren att få en notifikation och kan välja att godkänna projektet. 
                                  Först när båda parter har visat intresse kommer ni kunna se varandras kontaktuppgifter.
                                </p>
                                <Button 
                                  onClick={() => {
                                    console.log('Button clicked for match:', match.id);
                                    showInterest(match.id);
                                  }}
                                  className="w-full bg-tunitech-blue hover:bg-tunitech-blue/90 text-foreground"
                                  size="lg"
                                  disabled={match.customer_interested_at !== null}
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Anmäl intresse för denna utvecklare
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {match.customer_interested_at && !match.developer_approved_at && !isHired && (
                          <div className="bg-secondary/20 border border-secondary rounded-lg p-4">
                            <h4 className="font-semibold text-secondary-foreground mb-2">⏳ Väntar på utvecklarens svar</h4>
                            <p className="text-secondary-foreground/80 text-sm">
                              Du har anmält intresse för denna utvecklare. Vi väntar nu på att utvecklaren ska godkänna projektet.
                            </p>
                          </div>
                        )}

                        {canHire && (
                          <div className="bg-tunitech-mint/20 border border-tunitech-mint rounded-lg p-4">
                            <h4 className="font-semibold text-foreground mb-2">🎉 Matchning bekräftad!</h4>
                            <p className="text-muted-foreground text-sm mb-3">
                              Både du och utvecklaren har visat intresse. Nu kan du anställa utvecklaren för ditt team.
                            </p>
                            <div className="flex gap-3">
                              <Button 
                                onClick={() => hireDeveloper(match.id, developer.id)}
                                className="flex-1 bg-tunitech-mint hover:bg-tunitech-mint/90 text-foreground"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Anställ utvecklare
                              </Button>
                              <Button variant="outline" className="flex-1">
                                Schemalägg möte först
                              </Button>
                            </div>
                          </div>
                        )}

                        {isHired && (
                          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                            <h4 className="font-semibold text-foreground mb-2">✅ Utvecklaren är anställd</h4>
                            <p className="text-muted-foreground text-sm">
                              Denna utvecklare är nu en del av ditt team och finns listad ovan under "Ditt Utvecklarteam".
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {matches.length === 0 && (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        Inga matchningar än
                      </h3>
                      <p className="text-muted-foreground">
                        Vi söker kontinuerligt efter utvecklare som matchar ditt projekt.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Välj ett projekt från listan till vänster för att se matchningar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
