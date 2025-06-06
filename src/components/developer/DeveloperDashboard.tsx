
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Building, MapPin, AlertCircle } from 'lucide-react';

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
  project_requirement: {
    id: string;
    project_description: string;
    technical_skills: string;
    experience_level: string;
    employment_type: string;
    start_date: string;
    project_duration: string;
    budget_amount: string;
    customer: {
      company_name: string;
      contact_name: string;
    };
  };
}

export const DeveloperDashboard = () => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [matches, setMatches] = useState<ProjectMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeveloperProfile();
  }, [user]);

  const fetchDeveloperProfile = async () => {
    if (!user) return;

    try {
      const { data: developerData, error: devError } = await supabase
        .from('developers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (devError && devError.code === 'PGRST116') {
        // No developer profile found
        navigate('/developer-onboarding');
        return;
      }

      if (devError) throw devError;
      setDeveloper(developerData);

      if (developerData.is_approved) {
        fetchMatches(developerData.id);
      }
    } catch (error: any) {
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
            budget_amount,
            customer:customers (
              company_name,
              contact_name
            )
          )
        `)
        .eq('developer_id', developerId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      toast.error('Kunde inte hämta matchningar');
    }
  };

  const updateMatchStatus = async (matchId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('project_matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;

      setMatches(prev => prev.map(match => 
        match.id === matchId ? { ...match, status } : match
      ));

      toast.success('Status uppdaterad!');
    } catch (error: any) {
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar...</div>;
  }

  if (!developer) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Utvecklarprofil saknas</h1>
        <p className="text-gray-400 mb-6">Du måste skapa en utvecklarprofil först.</p>
        <Button onClick={() => navigate('/developer-onboarding')}>
          Skapa Utvecklarprofil
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="mb-8">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Projektmatchningar
              </CardTitle>
              <CardDescription>
                Projekt som matchar din profil sorterade efter matchningspoäng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {matches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {match.project_requirement.customer.company_name}
                        </h3>
                        <div className="flex items-center mb-2">
                          <Star className={`w-4 h-4 mr-1 ${getScoreColor(match.match_score)}`} />
                          <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                            {match.match_score}% match
                          </span>
                          <Badge variant="outline" className="ml-4">
                            {match.project_requirement.experience_level}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge 
                          variant={match.status === 'pending' ? 'secondary' : 'default'}
                          className="mb-2"
                        >
                          {match.status === 'pending' && 'Väntar'}
                          {match.status === 'interested' && 'Intresserad'}
                          {match.status === 'declined' && 'Avböjd'}
                          {match.status === 'selected' && 'Vald'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {match.project_requirement.project_description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      {match.project_requirement.budget_amount && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">
                            Budget: {match.project_requirement.budget_amount}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tekniska krav:</h4>
                      <p className="text-gray-600 text-sm">
                        {match.project_requirement.technical_skills}
                      </p>
                    </div>

                    {match.status === 'pending' && (
                      <div className="flex space-x-3">
                        <Button 
                          onClick={() => updateMatchStatus(match.id, 'interested')}
                          className="flex-1"
                        >
                          Visa intresse
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => updateMatchStatus(match.id, 'declined')}
                          className="flex-1"
                        >
                          Inte intresserad
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {matches.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Inga matchningar än
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
  );
};
