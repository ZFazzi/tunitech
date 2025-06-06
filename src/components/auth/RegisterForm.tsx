
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'developer'>('customer');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

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
      
      toast.success('Registrering lyckades! Kontrollera din e-post för verifiering. Du kommer att omdirigeras hit när du klickar på länken.');
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
