
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';

interface ProjectRequirement {
  id: string;
  project_description: string;
  technical_skills: string;
  experience_level: string;
  industry_experience_required: boolean;
  industry_type: string;
  employment_type: string;
  employment_type_other: string;
  start_date: string;
  project_duration: string;
  has_budget: boolean;
  budget_amount: string;
  project_type: string;
  required_resources: string;
  security_requirements: string;
  project_risks: string;
  additional_comments: string;
  created_at: string;
  updated_at: string;
}

export const ProjectSpecificationView = () => {
  const [project, setProject] = useState<ProjectRequirement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectRequirement>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id, user]);

  const fetchProject = async (projectId: string) => {
    if (!user) return;

    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!customer) {
        toast.error('Kundprofil hittades inte');
        navigate('/customer-dashboard');
        return;
      }

      const { data, error } = await supabase
        .from('project_requirements')
        .select('*')
        .eq('id', projectId)
        .eq('customer_id', customer.id)
        .single();

      if (error) throw error;
      
      setProject(data);
      setFormData(data);
    } catch (error: any) {
      toast.error('Kunde inte hämta projektspecifikation');
      navigate('/customer-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project || !formData) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('project_requirements')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject({ ...project, ...formData } as ProjectRequirement);
      setIsEditing(false);
      toast.success('Projektspecifikation uppdaterad!');
    } catch (error: any) {
      toast.error('Kunde inte spara ändringar');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(project || {});
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Laddar...</div>;
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Projekt hittades inte</h1>
        <Button onClick={() => navigate('/customer-dashboard')}>
          Tillbaka till översikt
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/customer-dashboard')}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka till översikt
        </Button>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Redigera
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sparar...' : 'Spara'}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Avbryt
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projektspecifikation</CardTitle>
          <CardDescription>
            Skapad: {new Date(project.created_at).toLocaleDateString('sv-SE')}
            {project.updated_at !== project.created_at && (
              <> • Uppdaterad: {new Date(project.updated_at).toLocaleDateString('sv-SE')}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Projektbeskrivning</Label>
            {isEditing ? (
              <Textarea
                value={formData.project_description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, project_description: e.target.value }))}
                rows={4}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                {project.project_description}
              </p>
            )}
          </div>

          <div>
            <Label>Teknisk kompetens</Label>
            {isEditing ? (
              <Textarea
                value={formData.technical_skills || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, technical_skills: e.target.value }))}
                rows={3}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                {project.technical_skills}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Erfarenhetsnivå</Label>
              {isEditing ? (
                <Select 
                  value={formData.experience_level} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (1-3 års erfarenhet)</SelectItem>
                    <SelectItem value="medior">Medior (3-5 års erfarenhet)</SelectItem>
                    <SelectItem value="senior">Senior (5+ års erfarenhet)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                  {project.experience_level === 'junior' && 'Junior (1-3 års erfarenhet)'}
                  {project.experience_level === 'medior' && 'Medior (3-5 års erfarenhet)'}
                  {project.experience_level === 'senior' && 'Senior (5+ års erfarenhet)'}
                </p>
              )}
            </div>

            <div>
              <Label>Anställningsform</Label>
              {isEditing ? (
                <Select 
                  value={formData.employment_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Timanställd</SelectItem>
                    <SelectItem value="part_time">Deltidsanställd</SelectItem>
                    <SelectItem value="full_time">Heltidsanställd</SelectItem>
                    <SelectItem value="other">Övrigt</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                  {project.employment_type === 'hourly' && 'Timanställd'}
                  {project.employment_type === 'part_time' && 'Deltidsanställd'}
                  {project.employment_type === 'full_time' && 'Heltidsanställd'}
                  {project.employment_type === 'other' && (project.employment_type_other || 'Övrigt')}
                </p>
              )}
            </div>
          </div>

          {formData.employment_type === 'other' && isEditing && (
            <div>
              <Label>Specificera anställningsform</Label>
              <Input
                value={formData.employment_type_other || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, employment_type_other: e.target.value }))}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Startdatum</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                  {project.start_date ? new Date(project.start_date).toLocaleDateString('sv-SE') : 'Ej specificerat'}
                </p>
              )}
            </div>

            <div>
              <Label>Projektlängd</Label>
              {isEditing ? (
                <Input
                  value={formData.project_duration || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_duration: e.target.value }))}
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                  {project.project_duration || 'Ej specificerat'}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              {isEditing ? (
                <Checkbox
                  checked={formData.industry_experience_required}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, industry_experience_required: Boolean(checked) }))
                  }
                />
              ) : (
                <div className={`w-4 h-4 rounded border ${project.industry_experience_required ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
              <Label>Branschexpertis krävs</Label>
            </div>
            
            {(formData.industry_experience_required || project.industry_experience_required) && (
              <div>
                <Label>Bransch</Label>
                {isEditing ? (
                  <Input
                    value={formData.industry_type || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry_type: e.target.value }))}
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                    {project.industry_type || 'Ej specificerat'}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              {isEditing ? (
                <Checkbox
                  checked={formData.has_budget}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, has_budget: Boolean(checked) }))
                  }
                />
              ) : (
                <div className={`w-4 h-4 rounded border ${project.has_budget ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
              <Label>Fastställd budget</Label>
            </div>
            
            {(formData.has_budget || project.has_budget) && (
              <div>
                <Label>Budget</Label>
                {isEditing ? (
                  <Input
                    value={formData.budget_amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_amount: e.target.value }))}
                  />
                ) : (
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                    {project.budget_amount || 'Ej specificerat'}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>Projekttyp</Label>
            {isEditing ? (
              <Select 
                value={formData.project_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed_price">Fastprisupphandling</SelectItem>
                  <SelectItem value="hourly_based">Timbaserad</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                {project.project_type === 'fixed_price' ? 'Fastprisupphandling' : 'Timbaserad'}
              </p>
            )}
          </div>

          <div>
            <Label>Resurser och tillgångar</Label>
            {isEditing ? (
              <Textarea
                value={formData.required_resources || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, required_resources: e.target.value }))}
                rows={3}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                {project.required_resources}
              </p>
            )}
          </div>

          <div>
            <Label>Säkerhetskrav</Label>
            {isEditing ? (
              <Textarea
                value={formData.security_requirements || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, security_requirements: e.target.value }))}
                rows={3}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                {project.security_requirements}
              </p>
            )}
          </div>

          <div>
            <Label>Projektrisker</Label>
            {isEditing ? (
              <Textarea
                value={formData.project_risks || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, project_risks: e.target.value }))}
                rows={3}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                {project.project_risks}
              </p>
            )}
          </div>

          {project.additional_comments && (
            <div>
              <Label>Övriga kommentarer</Label>
              {isEditing ? (
                <Textarea
                  value={formData.additional_comments || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, additional_comments: e.target.value }))}
                  rows={3}
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-900">
                  {project.additional_comments}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
