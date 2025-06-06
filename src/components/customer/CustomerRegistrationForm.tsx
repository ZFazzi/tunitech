
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const CustomerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    // Company information
    company_name: '',
    org_number: '',
    contact_name: '',
    role_title: '',
    email: '',
    phone: '',
    
    // Project requirements
    project_description: '',
    technical_skills: '',
    experience_level: '',
    industry_experience_required: false,
    industry_type: '',
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      // First, create the customer profile
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          user_id: user.id,
          company_name: formData.company_name,
          org_number: formData.org_number,
          contact_name: formData.contact_name,
          role_title: formData.role_title,
          email: formData.email,
          phone: formData.phone
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Then, create the project requirement using the customer data
      const { data: projectReq, error: projectError } = await supabase
        .from('project_requirements')
        .insert([{
          customer_id: customer.id,
          project_description: formData.project_description,
          technical_skills: formData.technical_skills,
          experience_level: formData.experience_level as any,
          industry_experience_required: formData.industry_experience_required,
          industry_type: formData.industry_type,
          employment_type: formData.employment_type as any,
          employment_type_other: formData.employment_type_other,
          start_date: formData.start_date,
          project_duration: formData.project_duration,
          has_budget: formData.has_budget,
          budget_amount: formData.budget_amount,
          project_type: formData.project_type as any,
          required_resources: formData.required_resources,
          security_requirements: formData.security_requirements,
          project_risks: formData.project_risks,
          additional_comments: formData.additional_comments
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Generate matches for the project
      if (projectReq) {
        await supabase.rpc('generate_project_matches', { req_id: projectReq.id });
      }
      
      toast.success('Kundprofil och projekt skapat! Omdirigerar till kundpanel...');
      
      // Redirect to customer dashboard
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Något gick fel vid registrering');
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
          <CardTitle>Kundregistrering</CardTitle>
          <CardDescription>Fyll i era företagsuppgifter och beskriv ert projekt</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Företagsinformation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Företagsnamn *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="org_number">Organisationsnummer</Label>
                  <Input
                    id="org_number"
                    value={formData.org_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, org_number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_name">Kontaktperson *</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role_title">Roll/Titel *</Label>
                  <Input
                    id="role_title"
                    value={formData.role_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, role_title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Project Requirements Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Projektönskemål</h3>
              <div className="space-y-6">
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

                <div>
                  <Label htmlFor="technical_skills">Vilken typ av teknisk kompetens söker ni? Vänligen specificera *</Label>
                  <Textarea
                    id="technical_skills"
                    value={formData.technical_skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, technical_skills: e.target.value }))}
                    rows={3}
                    required
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
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrerar...' : 'Registrera och skapa projekt'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
