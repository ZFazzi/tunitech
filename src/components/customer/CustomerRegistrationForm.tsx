
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CheckCircle, Copy } from 'lucide-react';

export const CustomerRegistrationForm = () => {
  // Auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Customer profile fields
  const [companyName, setCompanyName] = useState('');
  const [orgNumber, setOrgNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredCredentials, setRegisteredCredentials] = useState<{email: string, password: string} | null>(null);
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, just show customer profile form
  const [showProfileForm, setShowProfileForm] = useState(!!user);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} kopierat till urklipp`);
  };

  const handleAccountCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Lösenorden matchar inte');
      return;
    }

    if (password.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken');
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await signUp(email, password, { 
        user_type: 'customer',
        emailRedirectTo: redirectUrl
      });
      
      if (error) throw error;
      
      setRegisteredCredentials({ email, password });
      setRegistrationSuccess(true);
      
      toast.success('Konto skapat! Kontrollera din e-post för verifiering.');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('User already registered')) {
        toast.error('En användare med denna e-postadress finns redan. Försök logga in istället.');
      } else {
        toast.error(error.message || 'Något gick fel vid registrering');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          user_id: user?.id,
          company_name: companyName,
          org_number: orgNumber || null,
          contact_name: contactName,
          role_title: roleTitle,
          email: email || user?.email,
          phone,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Kundprofil skapad framgångsrikt!');
      navigate('/customer-dashboard');
    } catch (error: any) {
      console.error('Error creating customer profile:', error);
      toast.error('Kunde inte skapa kundprofil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Success screen after account creation
  if (registrationSuccess && registeredCredentials) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Konto skapat!</CardTitle>
            <CardDescription>
              Ditt konto har skapats. Här är dina inloggningsuppgifter:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">E-postadress</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={registeredCredentials.email} 
                    readOnly 
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(registeredCredentials.email, 'E-postadress')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Lösenord</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={registeredCredentials.password} 
                    readOnly 
                    className="bg-white"
                    type="text"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(registeredCredentials.password, 'Lösenord')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                📧 Kontrollera din e-post och klicka på verifieringslänken
              </p>
              <p className="text-xs text-gray-500">
                Efter verifiering kan du logga in och slutföra din kundprofil
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Gå till inloggning
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {user ? 'Slutför din kundprofil' : 'Registrera dig som kund'}
          </CardTitle>
          <CardDescription>
            {user 
              ? 'Fyll i dina företagsuppgifter för att slutföra registreringen'
              : 'Skapa ett konto och registrera ditt företag'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skapa konto</h3>
                <form onSubmit={handleAccountCreation} className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-postadress</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="din@epost.se"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Lösenord</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Minst 6 tecken"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Upprepa lösenordet"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Skapar konto...' : 'Skapa konto'}
                  </Button>
                </form>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Har du redan ett konto?{' '}
                  <Button variant="link" onClick={() => navigate('/auth')} className="p-0">
                    Logga in här
                  </Button>
                </p>
              </div>
            </>
          )}

          {user && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Företagsinformation</h3>
              <form onSubmit={handleCustomerProfileSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Företagsnamn *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Ditt företagsnamn"
                  />
                </div>
                <div>
                  <Label htmlFor="orgNumber">Organisationsnummer</Label>
                  <Input
                    id="orgNumber"
                    value={orgNumber}
                    onChange={(e) => setOrgNumber(e.target.value)}
                    placeholder="123456-7890"
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Kontaktperson *</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    placeholder="För- och efternamn"
                  />
                </div>
                <div>
                  <Label htmlFor="roleTitle">Titel/Roll *</Label>
                  <Input
                    id="roleTitle"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    required
                    placeholder="VD, Projektledare, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefonnummer *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="070-123 45 67"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sparar...' : 'Slutför registrering'}
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
