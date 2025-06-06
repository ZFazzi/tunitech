import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Calendar, Building, Users, Bell, Edit } from 'lucide-react';

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
    experience_level: string;
    technical_skills: string[];
    years_of_experience: number;
    industry_experience: string[];
    cv_summary: string;
    hourly_rate: number;
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

  const fetchMatches = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_matches')
        .select(`
          *,
          developer:developers (
            id,
            experience_level,
            technical_skills,
            years_of_experience,
            industry_experience,
            cv_summary,
            hourly_rate
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
    try {
      const { error } = await supabase
        .from('project_matches')
        .update({ 
          customer_interested_at: new Date().toISOString(),
          status: 'customer_interested'
        })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? { 
              ...match, 
              customer_interested_at: new Date().toISOString(),
              status: 'customer_interested'
            }
          : match
      ));

      toast.success('Intresse anmält! Utvecklaren kommer att få en notifikation.');
    } catch (error: any) {
      toast.error('Kunde inte anmäla intresse');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMatchStatus = (match: ProjectMatch) => {
    if (match.developer_approved_at && match.customer_interested_at) {
      return { label: 'Matchad - Schemalägg möte', color: 'bg-green-500' };
    }
    if (match.customer_interested_at) {
      return { label: 'Intresse anmält', color: 'bg-blue-500' };
    }
    return { label: 'Väntande', color: 'bg-gray-500' };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar...</div>;
  }

  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Kundprofil saknas</h1>
        <p className="text-gray-400 mb-6">Du måste skapa en kundprofil först.</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Välkommen, {customer.contact_name}!
          </h1>
          <p className="text-gray-400">{customer.company_name}</p>
        </div>
        <Button onClick={() => navigate('/project-requirement')}>
          <Plus className="w-4 h-4 mr-2" />
          Ny Kravspecifikation
        </Button>
      </div>

      {/* Notifikationer */}
      {notifications.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
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
                    notification.read_at ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projektlista */}
        <Card>
          <CardHeader>
            <CardTitle>Mina Projekt</CardTitle>
            <CardDescription>Klicka på ett projekt för att se eller redigera kravspecifikationen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProject === project.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedProject(project.id);
                      fetchMatches(project.id);
                    }}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {project.project_description.substring(0, 60)}...
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
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
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Inga projekt än</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Utvecklarmatchningar
              </CardTitle>
              <CardDescription>
                {selectedProject ? 'Utvecklare som matchar ditt valda projekt' : 'Välj ett projekt för att se matchningar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProject ? (
                <div className="space-y-6">
                  {matches.map((match) => {
                    const status = getMatchStatus(match);
                    return (
                      <div key={match.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Star className={`w-4 h-4 mr-1 ${getScoreColor(match.match_score)}`} />
                              <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                                {match.match_score}% match
                              </span>
                              <Badge variant="outline" className="ml-4">
                                {match.developer.experience_level}
                              </Badge>
                            </div>
                            <Badge className={status.color + ' text-white'}>
                              {status.label}
                            </Badge>
                          </div>
                          
                          <div className="text-right">
                            {match.developer.hourly_rate && (
                              <p className="text-sm text-gray-600">
                                {match.developer.hourly_rate} SEK/tim
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Utvecklarens meriter:</h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {match.developer.cv_summary || 'Ingen sammanfattning tillgänglig'}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Tekniska färdigheter:</h5>
                              <div className="flex flex-wrap gap-1">
                                {match.developer.technical_skills?.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Branschexpertis:</h5>
                              <div className="flex flex-wrap gap-1">
                                {match.developer.industry_experience?.map((exp, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-2">
                            {match.developer.years_of_experience} års erfarenhet
                          </p>
                        </div>

                        {!match.customer_interested_at && (
                          <Button 
                            onClick={() => showInterest(match.id)}
                            className="w-full"
                          >
                            Anmäl intresse
                          </Button>
                        )}

                        {match.customer_interested_at && match.developer_approved_at && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">🎉 Matchning bekräftad!</h4>
                            <p className="text-green-700 text-sm mb-3">
                              Både du och utvecklaren har visat intresse. Nu kan ni schemalägga ett möte.
                            </p>
                            <Button variant="outline" className="w-full">
                              Schemalägg möte
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {matches.length === 0 && (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Inga matchningar än
                      </h3>
                      <p className="text-gray-500">
                        Vi söker kontinuerligt efter utvecklare som matchar ditt projekt.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
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
