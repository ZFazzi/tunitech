import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleRoleSelect = (role: 'customer' | 'developer') => {
    // Store the selected role in sessionStorage so the auth page can use it
    sessionStorage.setItem('selectedRole', role);
    onClose();
    
    // Navigate directly to the appropriate onboarding page
    if (role === 'developer') {
      navigate('/developer-onboarding');
    } else {
      navigate('/customer-onboarding');
    }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{texts.title}</DialogTitle>
          <p className="text-center text-muted-foreground">{texts.subtitle}</p>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
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
      </DialogContent>
    </Dialog>
  );
};
