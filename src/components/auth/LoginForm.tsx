
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      
      if (data.user) {
        // Check user type from metadata
        const userType = data.user.user_metadata?.user_type;
        
        if (userType === 'customer') {
          // Check if customer profile exists
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', data.user.id)
            .single();
          
          navigate(customer ? '/customer-dashboard' : '/customer-onboarding');
        } else if (userType === 'developer') {
          // Check if developer profile exists
          const { data: developer } = await supabase
            .from('developers')
            .select('id')
            .eq('user_id', data.user.id)
            .single();
          
          navigate(developer ? '/developer-dashboard' : '/developer-onboarding');
        } else {
          navigate('/customer-dashboard'); // Default fallback
        }
        
        toast.success('Inloggning lyckades!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Något gick fel vid inloggning');
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
          <CardTitle>Logga in</CardTitle>
          <CardDescription>Logga in på ditt TuniTech-konto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loggar in...' : 'Logga in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
