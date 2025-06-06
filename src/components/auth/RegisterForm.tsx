
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle, Copy } from 'lucide-react';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'developer'>('customer');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredCredentials, setRegisteredCredentials] = useState<{email: string, password: string} | null>(null);
  const { signUp } = useAuth();

  // Check if a role was pre-selected from the role selection component
  useEffect(() => {
    const selectedRole = sessionStorage.getItem('selectedRole');
    if (selectedRole && (selectedRole === 'customer' || selectedRole === 'developer')) {
      setUserType(selectedRole);
      // Clear it after using it
      sessionStorage.removeItem('selectedRole');
    }
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} kopierat till urklipp`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use current domain for email redirect
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await signUp(email, password, { 
        user_type: userType,
        emailRedirectTo: redirectUrl
      });
      
      if (error) throw error;
      
      // Store credentials for display
      setRegisteredCredentials({ email, password });
      setRegistrationSuccess(true);
      
      toast.success('Registrering lyckades! Kontrollera din e-post för verifiering.');
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

  if (registrationSuccess && registeredCredentials) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Registrering lyckades!</CardTitle>
            <CardDescription>
              Ditt konto har skapats. Här är dina inloggningsuppgifter:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">E-postadress (användarnamn)</Label>
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
                Efter verifiering kan du logga in med ovanstående uppgifter
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setRegistrationSuccess(false);
                setRegisteredCredentials(null);
                setEmail('');
                setPassword('');
              }}
              variant="outline" 
              className="w-full"
            >
              Registrera ny användare
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
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Skapa konto</CardTitle>
          <CardDescription>Registrera dig för TuniTech</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="userType">Jag är</Label>
              <Select value={userType} onValueChange={(value: 'customer' | 'developer') => setUserType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj användartyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Kund (Söker utvecklare)</SelectItem>
                  <SelectItem value="developer">Utvecklare (Söker uppdrag)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrerar...' : 'Registrera'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
