
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check for email confirmation success
    const type = searchParams.get('type');
    const tokenHash = searchParams.get('token_hash');
    
    if (type === 'signup' && tokenHash) {
      toast.success('E-post verifierad! Du kan nu logga in.');
      // Clear the URL parameters
      window.history.replaceState({}, document.title, '/auth');
    }

    // Check for password recovery
    if (type === 'recovery' && tokenHash) {
      toast.success('Klicka på länken i e-postmeddelandet för att återställa ditt lösenord.');
    }
    
    // Check if user is already authenticated and redirect
    if (!loading && user && user.email_confirmed_at) {
      const userType = user.user_metadata?.user_type;
      console.log('User type:', userType);
      
      if (userType === 'customer') {
        navigate('/customer-onboarding');
      } else if (userType === 'developer') {
        navigate('/developer-onboarding');
      } else {
        navigate('/customer-onboarding'); // Default fallback
      }
    }
  }, [searchParams, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Laddar...</div>
      </div>
    );
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setIsLogin(true);
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
            {showForgotPassword 
              ? 'Återställ ditt lösenord' 
              : isLogin 
                ? 'Logga in på ditt konto' 
                : 'Skapa ett nytt konto'
            }
          </p>
        </motion.div>

        {showForgotPassword ? (
          <ForgotPasswordForm onBack={handleBackToLogin} />
        ) : isLogin ? (
          <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
        ) : (
          <RegisterForm />
        )}

        {!showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-white"
            >
              {isLogin ? 'Har du inget konto? Registrera dig' : 'Har du redan ett konto? Logga in'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Auth;
