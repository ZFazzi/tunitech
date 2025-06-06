
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, MapPin, AlertCircle, CheckCircle, X, User } from 'lucide-react';

interface Developer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  experience_level: string;
  technical_skills: string[];
  is_approved: boolean;
  available_for_work: boolean;
  cv_summary?: string;
  location?: string;
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
  };
}

export const DeveloperDashboard = () => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [matches, setMatches] = useState<ProjectMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('DeveloperDashboard: Component mounted, user:', user);

  useEffect(() => {
    if (user) {
      console.log('DeveloperDashboard: User found, fetching profile');
      fetchDeveloperProfile();
    } else {
      console.log('DeveloperDashboard: No user found');
      setLoading(false);
    }
  }, [user]);

  const fetchDeveloperProfile = async () => {
    if (!user) {
      console.log('DeveloperDashboard: No user, returning');
      return;
    }

    try {
      console.log('DeveloperDashboard: Fetching developer profile for user:', user.id);
      
      // Hämta utvecklarprofil
      const { data: developerData, error: devError } = await supabase
        .from('developers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('DeveloperDashboard: Developer data:', developerData, 'Error:', devError);

      if (devError && devError.code === 'PGRST116') {
        console.log('DeveloperDashboard: No developer profile found, redirecting to onboarding');
        navigate('/developer-onboarding');
        return;
      }

      if (devError) {
        console.error('DeveloperDashboard: Error fetching developer:', devError);
        throw devError;
      }

      setDeveloper(developerData);

      // Hämta projektmatchningar om utvecklaren är godkänd
      if (developerData?.is_approved) {
        console.log('DeveloperDashboard: Developer approved, fetching matches');
        await fetchMatches(developerData.id);
      } else {
        console.log('DeveloperDashboard: Developer not approved, skipping matches');
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
        .order('match_score', { ascending: false });

      console.log('DeveloperDashboard: Matches data:', data, 'Error:', error);

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      console.error('DeveloperDashboard: Error fetching matches:', error);
      toast.error('Kunde inte hämta projektmatchningar');
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
            status: 'declined',
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
      console.error('Error updating match status:', error);
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
      return { label: 'Matchad - Möte kan bokas', color: 'bg-green-500', icon: CheckCircle };
    }
    if (match.developer_approved_at) {
      return { label: 'Du har godkänt', color: 'bg-blue-500', icon: CheckCircle };
    }
    if (match.customer_interested_at) {
      return { label: 'Kunden har visat intresse', color: 'bg-yellow-500', icon: Star };
    }
    if (match.status === 'declined') {
      return { label: 'Avböjt', color: 'bg-red-500', icon: X };
    }
    return { label: 'Väntande svar', color: 'bg-gray-500', icon: AlertCircle };
  };

  console.log('DeveloperDashboard: Rendering, loading:', loading, 'developer:', developer, 'error:', error);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-tunitech-dark via-gray-900 to-black">
        <div className="text-white text-xl">Laddar utvecklarprofil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-tunitech-dark via-gray-900 to-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Något gick fel</h1>
          <p className="mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Försök igen
          </Button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-tunitech-dark via-gray-900 to-black">
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
        {/* Utvecklarprofil sektion */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
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
              <User className="w-4 h-4 mr-2" />
              Redigera Profil
            </Button>
          </div>

          {/* Profilkort */}
          <Card className="mb-6 bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="w-5 h-5 mr-2" />
                Min Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Grundläggande information</h4>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Namn:</strong> {developer.first_name} {developer.last_name}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>E-post:</strong> {developer.email}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Erfarenhetsnivå:</strong> {developer.experience_level}
                  </p>
                  {developer.location && (
                    <p className="text-sm text-gray-300 mb-1">
                      <strong>Plats:</strong> {developer.location}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tekniska färdigheter</h4>
                  <div className="flex flex-wrap gap-2">
                    {developer.technical_skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-white border-white/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {developer.cv_summary && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Sammanfattning</h4>
                      <p className="text-sm text-gray-300">{developer.cv_summary}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!developer.is_approved ? (
          <Card className="mb-6 bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-white">Profil väntar på godkännande</h3>
                  <p className="text-gray-300">
                    Din profil granskas av vårt team. Du kommer att få tillgång till projektmatchningar när din profil är godkänd.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Star className="w-5 h-5 mr-2" />
                Projektmatchningar
              </CardTitle>
              <CardDescription className="text-gray-300">
                Projekt som matchar din profil baserat på dina färdigheter och erfarenhet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {matches.map((match) => {
                  const status = getMatchStatus(match);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={match.id} className="border border-white/20 rounded-lg p-6 bg-white/5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Star className={`w-4 h-4 mr-1 ${getScoreColor(match.match_score)}`} />
                            <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                              {match.match_score}% matchning
                            </span>
                            <Badge variant="outline" className="ml-4 text-white border-white/30">
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
                            <p className="text-sm text-gray-300">
                              Budget: {match.project_requirement.budget_amount}
                            </p>
                          )}
                        </div>
                      </div>

                      <h3 className="font-semibold text-white mb-2">Projektbeskrivning</h3>
                      <p className="text-gray-300 mb-4">
                        {match.project_requirement.project_description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {getEmploymentTypeLabel(match.project_requirement.employment_type)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            Start: {new Date(match.project_requirement.start_date).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            Varaktighet: {match.project_requirement.project_duration}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-white mb-2">Tekniska krav:</h4>
                        <p className="text-gray-300 text-sm">
                          {match.project_requirement.technical_skills}
                        </p>
                      </div>

                      {match.customer_interested_at && (
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-blue-300 mb-1">🔔 Kunden har visat intresse!</h4>
                          <p className="text-blue-200 text-sm">
                            Kunden har anmält intresse för ditt arbete. Vill du gå vidare med detta projekt?
                          </p>
                        </div>
                      )}

                      {!match.developer_approved_at && match.status !== 'declined' && (
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
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-semibold text-green-300 mb-2">🎉 Matchning bekräftad!</h4>
                          <p className="text-green-200 text-sm mb-3">
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

                {matches.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Inga projektmatchningar än
                    </h3>
                    <p className="text-gray-400">
                      Vi söker kontinuerligt efter projekt som matchar din profil.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};
