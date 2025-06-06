
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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
            {isLogin ? 'Logga in på ditt konto' : 'Skapa ett nytt konto'}
          </p>
        </motion.div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

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
      </div>
    </div>
  );
};

export default Auth;
