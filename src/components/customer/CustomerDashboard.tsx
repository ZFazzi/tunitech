
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Users, Clock, Star } from 'lucide-react';

interface ProjectRequirement {
  id: string;
  project_description: string;
  technical_skills: string;
  experience_level: string;
  created_at: string;
  is_active: boolean;
}

interface ProjectMatch {
  id: string;
  match_score: number;
  status: string;
  developer: {
    id: string;
    first_name: string;
    last_name: string;
    experience_level: string;
    technical_skills: string[];
    cv_summary: string;
    hourly_rate: number;
    portfolio_url: string;
    linkedin_url: string;
    github_url: string;
  };
}

export const CustomerDashboard = () => {
  const [projects, setProjects] = useState<ProjectRequirement[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [matches, setMatches] = useState<ProjectMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchMatches(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!customer) {
        navigate('/customer-onboarding');
        return;
      }

      const { data, error } = await supabase
        .from('project_requirements')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id);
      }
    } catch (error: any) {
      toast.error('Kunde inte hämta projekt');
    } finally {
      setLoading(false);
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
            cv_summary,
            hourly_rate,
            portfolio_url,
            linkedin_url,
            github_url
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Kundpanel</h1>
        <p className="text-gray-400">Hantera dina projekt och se matchningar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mina Projekt</span>
                <Button onClick={() => navigate('/project-requirement')} size="sm">
                  Nytt Projekt
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedProject === project.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <h3 className="font-semibold text-sm mb-2 text-gray-900">
                    {project.project_description.substring(0, 60)}...
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(project.created_at).toLocaleDateString('sv-SE')}</span>
                    <Badge variant={project.is_active ? 'default' : 'secondary'}>
                      {project.is_active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {projects.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Inga projekt ännu. Skapa ditt första projekt!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Matches */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Matchade Utvecklare
                </CardTitle>
                <CardDescription>
                  Utvecklare som matchar ditt projekt sorterade efter matchningspoäng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {matches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-6 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {match.developer.first_name} {match.developer.last_name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">
                              {match.developer.experience_level}
                            </Badge>
                            <div className="flex items-center">
                              <Star className={`w-4 h-4 mr-1 ${getScoreColor(match.match_score)}`} />
                              <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                                {match.match_score}% match
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {match.developer.hourly_rate && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {match.developer.hourly_rate} SEK
                            </div>
                            <div className="text-sm text-gray-500">per timme</div>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4">
                        {match.developer.cv_summary}
                      </p>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Tekniska färdigheter:</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.developer.technical_skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {match.developer.portfolio_url && (
                          <a
                            href={match.developer.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Portfolio
                          </a>
                        )}
                        {match.developer.linkedin_url && (
                          <a
                            href={match.developer.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            LinkedIn
                          </a>
                        )}
                        {match.developer.github_url && (
                          <a
                            href={match.developer.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            GitHub
                          </a>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button className="w-full">
                          Kontakta utvecklare
                        </Button>
                      </div>
                    </div>
                  ))}

                  {matches.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Inga matchningar än
                      </h3>
                      <p className="text-gray-500">
                        Vi söker fortfarande efter lämpliga utvecklare för ditt projekt.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Välj ett projekt
                </h3>
                <p className="text-gray-500">
                  Välj ett projekt från listan för att se matchningar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};
