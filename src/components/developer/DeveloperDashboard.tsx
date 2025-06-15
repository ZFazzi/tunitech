
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Building, MapPin, AlertCircle, Bell, CheckCircle, X, Heart, Clock } from 'lucide-react';

interface Developer {
  id: string;
  first_name: string;
  last_name: string;
  is_approved: boolean;
  available_for_work: boolean;
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
    budget_amount: string;
  } | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('DeveloperDashboard: Component mounted, user:', user);
    if (user) {
      fetchDeveloperProfile();
    } else {
      console.log('DeveloperDashboard: No user found');
      setLoading(false);
    }
  }, [user]);

  const fetchDeveloperProfile = async () => {
    if (!user) {
      console.log('DeveloperDashboard: No user available for fetch');
      return;
    }

    try {
      console.log('DeveloperDashboard: Fetching developer profile for user:', user.id);
      
      const { data: developerData, error: devError } = await supabase
        .from('developers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (devError && devError.code === 'PGRST116') {
        console.log('DeveloperDashboard: No developer profile found, redirecting to onboarding');
        navigate('/developer-onboarding');
        return;
      }

      if (devError) {
        console.error('DeveloperDashboard: Error fetching developer:', devError);
        throw devError;
      }

      console.log('DeveloperDashboard: Developer data fetched:', developerData);
      setDeveloper(developerData);

      if (developerData?.is_approved) {
        console.log('DeveloperDashboard: Developer is approved, fetching matches and notifications');
        await Promise.all([
          fetchMatches(developerData.id),
          fetchNotifications()
        ]);
      } else {
        console.log('DeveloperDashboard: Developer not approved yet');
      }
    } catch (error: any) {
      console.error('DeveloperDashboard: Error in fetchDeveloperProfile:', error);
      setError('Kunde inte hämta utvecklarprofil: ' + error.message);
      toast.error('Kunde inte hämta utvecklarprofil');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (developerId: string) => {
    try {
      console.log('DeveloperDashboard: Fetching matches for developer:', developerId);
      
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
            budget_amount
          )
        `)
        .eq('developer_id', developerId)
        .order('customer_interested_at', { ascending: false, nullsLast: true })
        .order('match_score', { ascending: false });

      if (error) {
        console.error('DeveloperDashboard: Error fetching matches:', error);
        throw error;
      }

      console.log('DeveloperDashboard: Raw matches data:', data);
      
      // Filter out matches with null project_requirement and log them
      const validMatches = data?.filter(match => {
        if (match.project_requirement === null) {
          console.warn('DeveloperDashboard: Found match without project_requirement:', match.id);
          return false;
        }
        return true;
      }) || [];
      
      console.log('DeveloperDashboard: Valid matches after filtering:', validMatches);
      setMatches(validMatches);

      if (validMatches.length === 0) {
        console.log('DeveloperDashboard: No valid matches found');
        // Try to generate matches using existing project requirements
        await generateMatchesForDeveloper(developerId);
      }
    } catch (error: any) {
      console.error('DeveloperDashboard: Error in fetchMatches:', error);
      toast.error('Kunde inte hämta matchningar');
    }
  };

  const generateMatchesForDeveloper = async (developerId: string) => {
    try {
      console.log('DeveloperDashboard: Generating matches for developer:', developerId);
      
      // First, get all active project requirements
      const { data: requirements, error: reqError } = await supabase
        .from('project_requirements')
        .select('id')
        .eq('is_active', true);

      if (reqError) {
        console.error('DeveloperDashboard: Error fetching requirements:', reqError);
        return;
      }

      console.log('DeveloperDashboard: Found active requirements:', requirements?.length || 0);

      // Generate matches for each requirement
      if (requirements && requirements.length > 0) {
        for (const req of requirements) {
          try {
            const { error: matchError } = await supabase.rpc('generate_project_matches', {
              req_id: req.id
            });
            
            if (matchError) {
              console.error('DeveloperDashboard: Error generating matches for requirement:', req.id, matchError);
            }
          } catch (err) {
            console.error('DeveloperDashboard: Error in generate_project_matches call:', err);
          }
        }

        console.log('DeveloperDashboard: Finished generating matches, refreshing...');
        // Small delay to ensure the database has processed the changes
        setTimeout(() => {
          fetchMatches(developerId);
        }, 1000);
      }
    } catch (error: any) {
      console.error('DeveloperDashboard: Error in generateMatchesForDeveloper:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      console.log('DeveloperDashboard: Fetching notifications for user:', user?.id);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('DeveloperDashboard: Error fetching notifications:', error);
        throw error;
      }

      console.log('DeveloperDashboard: Notifications fetched:', data);
      setNotifications(data || []);
    } catch (error: any) {
      console.error('DeveloperDashboard: Error in fetchNotifications:', error);
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
      console.error('DeveloperDashboard: Error marking notification as read:', error);
    }
  };

  const updateMatchStatus = async (matchId: string, approved: boolean) => {
    try {
      const updateData = approved 
        ? { 
            developer_approved_at: new Date().toISOString(),
            status: 'developer_approved'
          }
        : { 
            status: 'developer_declined',
            developer_approved_at: null
          };

      const { error } = await supabase
        .from('project_matches')
        .update(updateData)
        .eq('id', matchId);

      if (error) throw error;

      setMatches(prev => prev.map(match => 
        match.id === matchId ? { ...match, ...updateData } : match
      ));

      toast.success(approved ? 'Projekt godkänt!' : 'Projekt avböjt!');
    } catch (error: any) {
      console.error('DeveloperDashboard: Error updating match status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
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

  const getMatchStatus = (match: ProjectMatch) => {
    if (match.developer_approved_at && match.customer_interested_at) {
      return { 
        label: 'Matchad - Möte kan bokas', 
        color: 'bg-green-500', 
        icon: CheckCircle,
        priority: 1
      };
    }
    if (match.customer_interested_at && !match.developer_approved_at) {
      return { 
        label: '💖 Kunden har visat intresse!', 
        color: 'bg-pink-500', 
        icon: Heart,
        priority: 2
      };
    }
    if (match.developer_approved_at) {
      return { 
        label: 'Du har godkänt - Väntar på kund', 
        color: 'bg-blue-500', 
        icon: Clock,
        priority: 3
      };
    }
    if (match.status === 'developer_declined') {
      return { 
        label: 'Avböjt', 
        color: 'bg-red-500', 
        icon: X,
        priority: 5
      };
    }
    return { 
      label: 'Väntande svar', 
      color: 'bg-gray-500', 
      icon: AlertCircle,
      priority: 4
    };
  };

  // Sort matches by priority (customer interest first)
  const sortedMatches = [...matches].sort((a, b) => {
    const statusA = getMatchStatus(a);
    const statusB = getMatchStatus(b);
    
    if (statusA.priority !== statusB.priority) {
      return statusA.priority - statusB.priority;
    }
    
    // Secondary sort by match score
    return b.match_score - a.match_score;
  });

  console.log('DeveloperDashboard: Rendering, loading:', loading, 'developer:', developer, 'error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Laddar...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ett fel uppstod</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Försök igen
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Du måste logga in</h1>
          <p className="text-gray-400 mb-6">Du måste vara inloggad för att se denna sida.</p>
          <Button onClick={() => navigate('/auth')}>
            Logga in
          </Button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Utvecklarprofil saknas</h1>
          <p className="text-gray-400 mb-6">Du måste skapa en utvecklarprofil först.</p>
          <Button onClick={() => navigate('/developer-onboarding')}>
            Skapa Utvecklarprofil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-6"
      >
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Välkommen, {developer.first_name}!
              </h1>
              <div className="flex items-center space-x-4">
                <Badge variant={developer.is_approved ? 'default' : 'secondary'}>
                  {developer.is_approved ? 'Godkänd' : 'Väntar på godkännande'}
                </Badge>
                <Badge variant={developer.available_for_work ? 'default' : 'secondary'}>
                  {developer.available_for_work ? 'Tillgänglig' : 'Ej tillgänglig'}
                </Badge>
              </div>
            </div>
            <Button onClick={() => navigate('/developer-profile')} variant="outline">
              <Star className="w-4 h-4 mr-2" />
              Min Profil
            </Button>
          </div>
        </div>

        {!developer.is_approved ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Profil väntar på godkännande</h3>
                  <p className="text-gray-600">
                    Din profil granskas av vårt team. Du kommer att få tillgång till projektmatchningar när din profil är godkänd.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Notifikationer */}
            {notifications.length > 0 && (
              <Card>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Projektförfrågningar
                </CardTitle>
                <CardDescription>
                  Projekt som matchar din profil - kunden ser inte ditt namn eller företagsnamnet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sortedMatches.map((match) => {
                    // Safety check to ensure project_requirement exists
                    if (!match.project_requirement) {
                      console.warn('DeveloperDashboard: Match without project_requirement found:', match.id);
                      return null;
                    }

                    const status = getMatchStatus(match);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={match.id} className={`border rounded-lg p-6 bg-white ${
                        match.customer_interested_at && !match.developer_approved_at 
                          ? 'ring-2 ring-pink-500 bg-pink-50' 
                          : ''
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Star className={`w-4 h-4 mr-1 ${getScoreColor(match.match_score)}`} />
                              <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                                {match.match_score}% match
                              </span>
                              <Badge variant="outline" className="ml-4">
                                {match.project_requirement.experience_level}
                              </Badge>
                            </div>
                            <div className="flex items-center">
                              <StatusIcon className="w-4 h-4 mr-1" />
                              <Badge className={status.color + ' text-white'}>
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {match.project_requirement.budget_amount && (
                              <p className="text-sm text-gray-600">
                                Budget: {match.project_requirement.budget_amount}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                          {match.project_requirement.project_description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {getEmploymentTypeLabel(match.project_requirement.employment_type)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Start: {new Date(match.project_requirement.start_date).toLocaleDateString('sv-SE')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Varaktighet: {match.project_requirement.project_duration}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Tekniska krav:</h4>
                          <p className="text-gray-600 text-sm">
                            {match.project_requirement.technical_skills}
                          </p>
                        </div>

                        {match.customer_interested_at && !match.developer_approved_at && (
                          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-pink-800 mb-1 flex items-center">
                              <Heart className="w-4 h-4 mr-2" />
                              Kunden har visat intresse!
                            </h4>
                            <p className="text-pink-700 text-sm">
                              Kunden har anmält intresse för ditt arbete den {new Date(match.customer_interested_at).toLocaleDateString('sv-SE')}. 
                              Vill du gå vidare med detta projekt?
                            </p>
                          </div>
                        )}

                        {!match.developer_approved_at && match.status !== 'developer_declined' && (
                          <div className="flex space-x-3">
                            <Button 
                              onClick={() => updateMatchStatus(match.id, true)}
                              className="flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Godkänn projekt
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => updateMatchStatus(match.id, false)}
                              className="flex-1"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Avböj projekt
                            </Button>
                          </div>
                        )}

                        {match.customer_interested_at && match.developer_approved_at && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">🎉 Matchning bekräftad!</h4>
                            <p className="text-green-700 text-sm mb-3">
                              Både du och kunden har visat intresse. Nu kan ni schemalägga ett möte för att diskutera projektet vidare.
                            </p>
                            <Button variant="outline" className="w-full">
                              Schemalägg möte
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {sortedMatches.length === 0 && (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Inga projektförfrågningar än
                      </h3>
                      <p className="text-gray-500">
                        Vi söker kontinuerligt efter projekt som matchar din profil.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};
