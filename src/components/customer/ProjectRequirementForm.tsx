import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectSkillSelector } from './ProjectSkillSelector';
import { ProjectIndustrySelector } from './ProjectIndustrySelector';
import { toast } from 'sonner';

interface RequiredSkill {
  skillCategoryId: string;
  name: string;
  importanceLevel: number;
  minimumYears: number;
}

interface RequiredIndustry {
  industryCategoryId: string;
  name: string;
  required: boolean;
}

export const ProjectRequirementForm = () => {
  const [formData, setFormData] = useState({
    project_description: '',
    experience_level: '',
    employment_type: '',
    employment_type_other: '',
    start_date: '',
    project_duration: '',
    has_budget: false,
    budget_amount: '',
    project_type: '',
    required_resources: '',
    security_requirements: '',
    project_risks: '',
    additional_comments: ''
  });
  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([]);
  const [requiredIndustries, setRequiredIndustries] = useState<RequiredIndustry[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      // Get customer profile
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!customer) {
        toast.error('Du måste skapa en kundprofil först');
        navigate('/customer-onboarding');
        return;
      }

      // Create technical skills summary for backward compatibility
      const technicalSkillsSummary = requiredSkills.map(skill => skill.name).join(', ');

      const { data, error } = await supabase
        .from('project_requirements')
        .insert([{
          ...formData,
          customer_id: customer.id,
          technical_skills: technicalSkillsSummary,
          industry_experience_required: requiredIndustries.some(i => i.required),
          industry_type: requiredIndustries.filter(i => i.required).map(i => i.name).join(', '),
          experience_level: formData.experience_level as any,
          employment_type: formData.employment_type as any,
          project_type: formData.project_type as any
        }])
        .select()
        .single();

      if (error) throw error;

      // Insert required skills
      if (requiredSkills.length > 0) {
        const skillsToInsert = requiredSkills.map(skill => ({
          project_requirement_id: data.id,
          skill_category_id: skill.skillCategoryId,
          importance_level: skill.importanceLevel,
          minimum_years: skill.minimumYears
        }));

        await supabase
          .from('project_required_skills')
          .insert(skillsToInsert);
      }

      // Insert industry requirements
      if (requiredIndustries.length > 0) {
        const industriesToInsert = requiredIndustries.map(industry => ({
          project_requirement_id: data.id,
          industry_category_id: industry.industryCategoryId,
          required: industry.required
        }));

        await supabase
          .from('project_industry_requirements')
          .insert(industriesToInsert);
      }

      // Generate matches using new function
      await supabase.rpc('calculate_match_score_v2', { 
        req_id: data.id, 
        dev_id: '00000000-0000-0000-0000-000000000000' // Dummy call to ensure function works
      });
      
      toast.success('Kravspecifikation skapad! Du dirigeras nu till din kundpanel.');
      
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating project requirement:', error);
      toast.error(error.message || 'Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Kravspecifikation och projektinformation</CardTitle>
          <CardDescription>Beskriv ditt projekt för att hitta rätt utvecklare</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="project_description">Vänligen beskriv projektet eller uppdragets mål och syfte? *</Label>
              <Textarea
                id="project_description"
                value={formData.project_description}
                onChange={(e) => setFormData(prev => ({ ...prev, project_description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Technical Skills Section */}
            <div>
              <Label className="text-lg font-semibold">Tekniska kompetenskrav</Label>
              <ProjectSkillSelector
                requiredSkills={requiredSkills}
                onSkillsChange={setRequiredSkills}
              />
            </div>

            <div>
              <Label>Vilken erfarenhetsnivå söker ni? *</Label>
              <Select 
                value={formData.experience_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj erfarenhetsnivå" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (1-3 års erfarenhet)</SelectItem>
                  <SelectItem value="medior">Medior (3-5 års erfarenhet)</SelectItem>
                  <SelectItem value="senior">Senior (5+ års erfarenhet)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="industry_experience"
                  checked={formData.industry_experience_required}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, industry_experience_required: Boolean(checked) }))
                  }
                />
                <Label htmlFor="industry_experience">Behöver konsulterna ha erfarenhet av er bransch?</Label>
              </div>
              
              {formData.industry_experience_required && (
                <div>
                  <Label htmlFor="industry_type">Vilken bransch?</Label>
                  <Input
                    id="industry_type"
                    value={formData.industry_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry_type: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Vilken anställningsform önskar ni? *</Label>
              <Select 
                value={formData.employment_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj anställningsform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Timanställd</SelectItem>
                  <SelectItem value="part_time">Deltidsanställd</SelectItem>
                  <SelectItem value="full_time">Heltidsanställd</SelectItem>
                  <SelectItem value="other">Övrigt</SelectItem>
                </SelectContent>
              </Select>
              
              {formData.employment_type === 'other' && (
                <Input
                  className="mt-2"
                  placeholder="Specificera anställningsform"
                  value={formData.employment_type_other}
                  onChange={(e) => setFormData(prev => ({ ...prev, employment_type_other: e.target.value }))}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">När är ni i behov av en konsult senast? *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="project_duration">Hur länge önskar ni att göra avtal med personen? *</Label>
                <Input
                  id="project_duration"
                  value={formData.project_duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_duration: e.target.value }))}
                  placeholder="t.ex. 6 månader, 1 år"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_budget"
                  checked={formData.has_budget}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, has_budget: Boolean(checked) }))
                  }
                />
                <Label htmlFor="has_budget">Har ni en fast budget för projektet?</Label>
              </div>
              
              {formData.has_budget && (
                <div>
                  <Label htmlFor="budget_amount">Vänligen ange den ungefärliga budgeten</Label>
                  <Input
                    id="budget_amount"
                    value={formData.budget_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_amount: e.target.value }))}
                    placeholder="t.ex. 500 000 SEK"
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Är uppdraget en fastprisupphandling eller timbaserad? *</Label>
              <Select 
                value={formData.project_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj projekttyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed_price">Fastprisupphandling</SelectItem>
                  <SelectItem value="hourly_based">Timbaserad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="required_resources">Finns det några resurser eller tillgångar som ni förväntar er att vi ska bidra med? *</Label>
              <Textarea
                id="required_resources"
                value={formData.required_resources}
                onChange={(e) => setFormData(prev => ({ ...prev, required_resources: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="security_requirements">Finns det några säkerhets- eller integritetskrav som vi behöver vara medvetna om? *</Label>
              <Textarea
                id="security_requirements"
                value={formData.security_requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, security_requirements: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="project_risks">Finns det risker eller osäkerheter i projektet som ni redan nu vill uppmärksamma? *</Label>
              <Textarea
                id="project_risks"
                value={formData.project_risks}
                onChange={(e) => setFormData(prev => ({ ...prev, project_risks: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="additional_comments">Övriga önskemål eller kommentarer</Label>
              <Textarea
                id="additional_comments"
                value={formData.additional_comments}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_comments: e.target.value }))}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sparar kravspecifikation...' : 'Skapa kravspecifikation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
