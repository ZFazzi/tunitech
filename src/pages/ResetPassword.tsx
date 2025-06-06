
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a password recovery session
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (type === 'recovery' && accessToken && refreshToken) {
      // Set the session with the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      // If no valid recovery tokens, redirect to auth
      navigate('/auth');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Lösenordet har uppdaterats!');
      navigate('/auth');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Något gick fel vid uppdatering av lösenord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            TuniTech
          </h1>
          <p className="text-gray-400">
            Skapa ett nytt lösenord
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Nytt lösenord</CardTitle>
              <CardDescription>
                Ange ditt nya lösenord nedan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Nytt lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minst 6 tecken"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ange lösenordet igen"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
