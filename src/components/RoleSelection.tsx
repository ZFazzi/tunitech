
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface RoleSelectionProps {
  onClose: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleRoleSelect = (role: 'customer' | 'developer') => {
    // Store the selected role in sessionStorage so the auth page can use it
    sessionStorage.setItem('selectedRole', role);
    navigate('/auth');
  };

  const getTexts = () => {
    switch (language) {
      case 'sv':
        return {
          title: 'Välj din roll',
          subtitle: 'Vad passar dig bäst?',
          customer: {
            title: 'Jag är kund',
            description: 'Jag söker utvecklare för mitt projekt',
            button: 'Fortsätt som kund'
          },
          developer: {
            title: 'Jag är utvecklare',
            description: 'Jag söker uppdrag och projekt',
            button: 'Fortsätt som utvecklare'
          }
        };
      case 'fr':
        return {
          title: 'Choisissez votre rôle',
          subtitle: 'Qu\'est-ce qui vous convient le mieux?',
          customer: {
            title: 'Je suis client',
            description: 'Je recherche des développeurs pour mon projet',
            button: 'Continuer en tant que client'
          },
          developer: {
            title: 'Je suis développeur',
            description: 'Je recherche des missions et des projets',
            button: 'Continuer en tant que développeur'
          }
        };
      default:
        return {
          title: 'Choose your role',
          subtitle: 'What fits you best?',
          customer: {
            title: 'I am a customer',
            description: 'I\'m looking for developers for my project',
            button: 'Continue as customer'
          },
          developer: {
            title: 'I am a developer',
            description: 'I\'m looking for assignments and projects',
            button: 'Continue as developer'
          }
        };
    }
  };

  const texts = getTexts();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{texts.title}</h2>
          <p className="text-gray-400">{texts.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{texts.customer.title}</CardTitle>
              <CardDescription>{texts.customer.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => handleRoleSelect('customer')}
                className="w-full bg-gradient-to-r from-tunitech-mint to-tunitech-blue"
              >
                {texts.customer.button}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{texts.developer.title}</CardTitle>
              <CardDescription>{texts.developer.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => handleRoleSelect('developer')}
                className="w-full bg-gradient-to-r from-tunitech-mint to-tunitech-blue"
              >
                {texts.developer.button}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            Stäng
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
