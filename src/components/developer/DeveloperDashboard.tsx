import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Building, Users, Bell, Edit, MapPin, Languages, Award, DollarSign, User, Eye, CheckCircle, Clock, Heart, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Developer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  experience_level: string;
  years_of_experience: number;
  technical_skills: string[];
  industry_experience: string[];
  cv_summary: string;
  hourly_rate: number;
  location: string;
  languages: string[];
  certifications: string[];
  education: string;
  available_for_work: boolean;
  is_approved: boolean;
  profile_picture_url: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
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
    required_resources: string | null;
    security_requirements: string | null;
    project_risks: string | null;
    additional_comments: string | null;
    customer: {
      company_name: string;
      contact_name: string;
    };
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

export const DeveloperDashboard = () => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [matches, setMatches] = useState<ProjectMatch[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedAllProjects, setExpandedAllProjects] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const interestedProjectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDeveloperData();
  }, [user]);

  const fetchDeveloperData = async () => {
    if (!user) return;

    try {
      const { data: developerData, error: developerError } = await supabase
        .from('developers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (developerError && developerError.code === 'PGRST116') {
        navigate('/developer-onboarding');
        return;
      }

      if (developerError) throw developerError;
      setDeveloper(developerData);

      await Promise.all([
        fetchMatches(developerData.id),
        fetchNotifications(),
        fetchAllAvailableProjects(developerData.id)
      ]);
    } catch (error: any) {
      toast.error('Kunde inte hämta utvecklardata');
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
            required_resources,
            security_requirements,
            project_risks,
            additional_comments,
            customer:customers (
              company_name,
              contact_name
            )
          )
        `)
        .eq('developer_id', developerId)
        .order('customer_interested_at', { ascending: false, nullsFirst: false })
        .order('match_score', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast.error('Kunde inte hämta projektmatchningar');
    }
  };

  const fetchAllAvailableProjects = async (developerId: string) => {
    try {
      // Fetch all active projects that this developer hasn't already been matched with
      const { data, error } = await supabase
        .from('project_requirements')
        .select(`
          *,
          customer:customers (
            company_name,
            contact_name
          ),
          project_matches!left (
            id,
            developer_id,
            status
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out projects where this developer already has a match
      const availableProjects = (data || []).filter(project => {
        const existingMatch = project.project_matches?.find(
          (match: any) => match.developer_id === developerId
        );
        return !existingMatch;
      });

      setAllProjects(availableProjects);
    } catch (error: any) {
      toast.error('Kunde inte hämta tillgängliga projekt');
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

  const approveProject = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('project_matches')
        .update({ 
          developer_approved_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? { ...match, developer_approved_at: new Date().toISOString() }
          : match
      ));

      toast.success('Projekt godkänt! Kunden kommer att få en notifikation.');
    } catch (error: any) {
      toast.error('Kunde inte godkänna projektet');
    }
  };

  const rejectProject = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('project_matches')
        .update({ 
          status: 'rejected'
        })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(prev => prev.filter(match => match.id !== matchId));
      toast.success('Projekt avböjt.');
    } catch (error: any) {
      toast.error('Kunde inte avböja projektet');
    }
  };

  const expressInterest = async (projectId: string) => {
    if (!developer) return;

    try {
      // Create a project match with developer expressing interest
      const { error } = await supabase
        .from('project_matches')
        .insert({
          project_requirement_id: projectId,
          developer_id: developer.id,
          match_score: 0, // Will be calculated later if needed
          developer_approved_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Intresse anmält! Kunden kommer att få en notifikation.');
      
      // Refresh data
      await Promise.all([
        fetchMatches(developer.id),
        fetchAllAvailableProjects(developer.id)
      ]);
    } catch (error: any) {
      toast.error('Kunde inte anmäla intresse för projektet');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tunitech-mint';
    if (score >= 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getMatchStatus = (match: ProjectMatch) => {
    if (match.status === 'hired') {
      return { label: 'Anställd', color: 'bg-tunitech-mint', icon: CheckCircle };
    }
    if (match.developer_approved_at && match.customer_interested_at) {
      return { label: 'Matchad - Väntar på kund', color: 'bg-tunitech-blue', icon: CheckCircle };
    }
    if (match.customer_interested_at) {
      return { label: 'Kunden har anmält intresse!', color: 'bg-gradient-to-r from-pink-500 to-rose-500', icon: Heart };
    }
    if (match.developer_approved_at) {
      return { label: 'Godkänd av dig', color: 'bg-secondary', icon: CheckCircle };
    }
    return { label: 'Väntande', color: 'bg-muted', icon: Clock };
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      'junior': 'Junior',
      'medior': 'Medior',
      'senior': 'Senior'
    };
    return labels[level] || level;
  };

  const scrollToInterestedProjects = () => {
    console.log('Scroll function called');
    
    const element = document.getElementById('interested-projects');
    console.log('Element found:', element);
    
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const offsetTop = Math.max(0, absoluteElementTop - 150); // More padding and ensure it's not negative
      
      console.log('Scrolling to:', offsetTop);
      console.log('Current scroll position:', window.pageYOffset);
      console.log('Element position:', absoluteElementTop);
      
      // Add a visual highlight to make it clear where we're scrolling to
      element.style.transition = 'all 0.3s ease';
      element.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
      element.style.border = '2px solid rgba(236, 72, 153, 0.3)';
      element.style.borderRadius = '8px';
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Remove highlight after animation
      setTimeout(() => {
        element.style.backgroundColor = '';
        element.style.border = '';
        element.style.borderRadius = '';
      }, 2000);
    } else {
      console.log('Element with ID "interested-projects" not found');
    }
  };

  const toggleProjectExpansion = (matchId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matchId)) {
        newSet.delete(matchId);
      } else {
        newSet.add(matchId);
      }
      return newSet;
    });
  };

  const toggleAllProjectExpansion = (projectId: string) => {
    setExpandedAllProjects(prev => {
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
    return <div className="flex justify-center items-center h-64 text-foreground">Laddar...</div>;
  }

  if (!developer) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Utvecklarprofil saknas</h1>
        <p className="text-muted-foreground mb-6">Du måste skapa en utvecklarprofil först.</p>
        <Button onClick={() => navigate('/developer-onboarding')}>
          Skapa Utvecklarprofil
        </Button>
      </div>
    );
  }

  if (!developer.is_approved) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Profil under granskning</h1>
        <p className="text-muted-foreground mb-6">
          Din profil granskas för närvarande. Du kommer att få ett e-postmeddelande när den är godkänd.
        </p>
        <Button onClick={() => navigate('/developer-profile')}>
          Redigera profil
        </Button>
      </div>
    );
  }

  // Separate matches into interested and others
  const interestedMatches = matches.filter(match => match.customer_interested_at && !match.developer_approved_at && match.status !== 'rejected');
  const otherMatches = matches.filter(match => (!match.customer_interested_at || match.developer_approved_at) && match.status !== 'rejected');

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Välkommen, {developer.first_name}!
          </h1>
          <p className="text-muted-foreground">
            {getExperienceLevelLabel(developer.experience_level)} Utvecklare • {developer.years_of_experience} års erfarenhet
          </p>
        </div>
        <Button onClick={() => navigate('/developer-profile')}>
          <Edit className="w-4 h-4 mr-2" />
          Redigera Profil
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

      {/* Tillgängliga projekt för utvecklare att visa intresse för */}
      <Card className="mb-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
            Tillgängliga Projekt
          </CardTitle>
          <CardDescription>
            Bläddra bland alla aktiva projekt och anmäl ditt intresse
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allProjects.length > 0 ? (
            <div className="grid gap-4">
              {allProjects.map((project) => {
                const isExpanded = expandedAllProjects.has(project.id);
                
                return (
                  <Card key={project.id} className="bg-background/50 border-border/50 hover:border-tunitech-blue/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-card-foreground mb-2">
                                {project.customer?.company_name || 'Projekt'}
                              </h3>
                              <p className="text-muted-foreground mb-2 text-sm">
                                Klicka för att läsa hela projektbeskrivningen
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllProjectExpansion(project.id)}
                              className="hover:bg-tunitech-blue/20"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          {isExpanded ? (
                            <div className="mt-4 space-y-4">
                              <div>
                                <h4 className="font-semibold text-card-foreground mb-2">Projektbeskrivning:</h4>
                                <p className="text-card-foreground leading-relaxed bg-background/50 p-4 rounded-lg">
                                  {project.project_description}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-1">Erfarenhetsnivå:</h4>
                                  <p className="text-muted-foreground">{getExperienceLevelLabel(project.experience_level)}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-1">Startdatum:</h4>
                                  <p className="text-muted-foreground">
                                    {new Date(project.start_date).toLocaleDateString('sv-SE')}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-1">Varaktighet:</h4>
                                  <p className="text-muted-foreground">{project.project_duration}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-card-foreground mb-2">Tekniska krav:</h4>
                                <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.technical_skills}</p>
                              </div>

                              {project.required_resources && (
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-2">Resurser och tillgångar:</h4>
                                  <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.required_resources}</p>
                                </div>
                              )}

                              {project.security_requirements && (
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-2">Säkerhetskrav:</h4>
                                  <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.security_requirements}</p>
                                </div>
                              )}

                              {project.project_risks && (
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-2">Projektrisker:</h4>
                                  <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.project_risks}</p>
                                </div>
                              )}

                              {project.additional_comments && (
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-2">Övriga kommentarer:</h4>
                                  <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.additional_comments}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-card-foreground leading-relaxed mt-2">
                              {project.project_description.substring(0, 150)}
                              {project.project_description.length > 150 && '...'}
                            </p>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <div className="text-xs text-muted-foreground mb-2">
                            Publicerat: {new Date(project.created_at).toLocaleDateString('sv-SE')}
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {getExperienceLevelLabel(project.experience_level)}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-tunitech-blue/10 border border-tunitech-blue/20 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-1">Intresserad av detta projekt?</h4>
                            <p className="text-muted-foreground text-sm">
                              Anmäl ditt intresse så kommer kunden att få en notifikation om dig.
                            </p>
                          </div>
                          <Button 
                            onClick={() => expressInterest(project.id)}
                            className="bg-gradient-to-r from-tunitech-blue to-tunitech-mint hover:from-tunitech-blue/80 hover:to-tunitech-mint/80 text-white border-0"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Anmäl Intresse
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Inga tillgängliga projekt att visa intresse för för tillfället.
              </p>
              <p className="text-sm text-muted-foreground">
                Nya projekt kommer att visas här när kunder publicerar dem.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projektmatchningar med intresse först */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-tunitech-mint to-tunitech-blue bg-clip-text text-transparent">
            Projektmatchningar
          </CardTitle>
          <CardDescription>
            Projekt som matchar din profil och kompetens
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Kunder som har anmält intresse */}
          {interestedMatches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-pink-500" />
                <button 
                  onClick={scrollToInterestedProjects}
                  className="text-lg font-semibold text-card-foreground hover:text-pink-500 transition-colors cursor-pointer underline decoration-pink-500/30 hover:decoration-pink-500"
                >
                  Projekt med kundintresse ({interestedMatches.length})
                </button>
              </div>
              <div className="grid gap-4" ref={interestedProjectsRef} id="interested-projects">
                {interestedMatches.map((match) => {
                  const project = match.project_requirement;
                  if (!project) return null;

                  const statusInfo = getMatchStatus(match);
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = expandedProjects.has(match.id);

                  return (
                    <Card key={match.id} className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-pink-500" />
                              <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                                KUNDEN HAR ANMÄLT INTRESSE!
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-card-foreground mb-2">
                                  Projektförfrågan #{match.id.slice(0, 8)}
                                </h3>
                                <p className="text-muted-foreground mb-2 text-sm">
                                  Klicka för att läsa hela projektbeskrivningen
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProjectExpansion(match.id)}
                                className="hover:bg-pink-500/20"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {/* Förhandsvisning eller full beskrivning */}
                            {isExpanded ? (
                              <div className="mt-4 space-y-4">
                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-2">Projektbeskrivning:</h4>
                                  <p className="text-card-foreground leading-relaxed bg-background/50 p-4 rounded-lg">
                                    {project.project_description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-1">Erfarenhetsnivå:</h4>
                                    <p className="text-muted-foreground">{getExperienceLevelLabel(project.experience_level)}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-1">Startdatum:</h4>
                                    <p className="text-muted-foreground">
                                      {new Date(project.start_date).toLocaleDateString('sv-SE')}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-1">Varaktighet:</h4>
                                    <p className="text-muted-foreground">{project.project_duration}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-card-foreground mb-2">Tekniska krav:</h4>
                                  <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.technical_skills}</p>
                                </div>

                                {project.required_resources && (
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-2">Resurser och tillgångar:</h4>
                                    <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.required_resources}</p>
                                  </div>
                                )}

                                {project.security_requirements && (
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-2">Säkerhetskrav:</h4>
                                    <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.security_requirements}</p>
                                  </div>
                                )}

                                {project.project_risks && (
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-2">Projektrisker:</h4>
                                    <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.project_risks}</p>
                                  </div>
                                )}

                                {project.additional_comments && (
                                  <div>
                                    <h4 className="font-semibold text-card-foreground mb-2">Övriga kommentarer:</h4>
                                    <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-lg">{project.additional_comments}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-card-foreground leading-relaxed mt-2">
                                {project.project_description.substring(0, 150)}
                                {project.project_description.length > 150 && '...'}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center mb-2">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                                {match.match_score}% matchning
                              </span>
                            </div>
                            <Badge variant="outline">
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>

                        {!match.developer_approved_at && (
                          <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-lg p-4 mt-4">
                            <div className="flex items-start space-x-3">
                              <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-card-foreground mb-1">Kunden vill arbeta med dig!</h4>
                                <p className="text-muted-foreground text-sm mb-3">
                                  Denna kund har anmält intresse för dina tjänster. Genom att godkänna projektet kommer ni kunna se varandras kontaktuppgifter.
                                </p>
                                <div className="flex gap-3">
                                  <Button 
                                    onClick={() => approveProject(match.id)}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                    size="lg"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Godkänn projekt
                                  </Button>
                                  <Button 
                                    onClick={() => rejectProject(match.id)}
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all duration-300"
                                    size="lg"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Avböj projekt
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Övriga matchningar */}
          {otherMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Övriga projektmatchningar ({otherMatches.length})
              </h3>
              <div className="grid gap-4">
                {otherMatches.map((match) => {
                  const project = match.project_requirement;
                  if (!project) return null;

                  const statusInfo = getMatchStatus(match);
                  const StatusIcon = statusInfo.icon;
                  const showCustomerInfo = match.developer_approved_at && match.customer_interested_at;

                  return (
                    <Card key={match.id} className="bg-background/50 border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-card-foreground mb-2">
                              {showCustomerInfo ? project.customer?.company_name : 'Projekt'}
                            </h3>
                            {showCustomerInfo && (
                              <p className="text-muted-foreground mb-2">
                                Kontakt: {project.customer?.contact_name}
                              </p>
                            )}
                            <p className="text-card-foreground leading-relaxed">
                              {project.project_description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center mb-2">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                                {match.match_score}% matchning
                              </span>
                            </div>
                            <Badge variant="outline">
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-1">Erfarenhetsnivå:</h4>
                            <p className="text-muted-foreground">{getExperienceLevelLabel(project.experience_level)}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-1">Startdatum:</h4>
                            <p className="text-muted-foreground">
                              {new Date(project.start_date).toLocaleDateString('sv-SE')}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-card-foreground mb-1">Varaktighet:</h4>
                            <p className="text-muted-foreground">{project.project_duration}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-card-foreground mb-2">Tekniska krav:</h4>
                          <p className="text-muted-foreground text-sm">{project.technical_skills}</p>
                        </div>

                        {!match.developer_approved_at && match.status !== 'hired' && (
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => approveProject(match.id)}
                              variant="outline"
                              className="flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Godkänn projekt
                            </Button>
                            <Button 
                              onClick={() => rejectProject(match.id)}
                              variant="outline"
                              className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Avböj
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {matches.length === 0 && (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Inga projektmatchningar hittades ännu.
              </p>
              <p className="text-sm text-muted-foreground">
                Nya matchningar kommer att visas här när kunder skapar projekt som matchar din profil.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
