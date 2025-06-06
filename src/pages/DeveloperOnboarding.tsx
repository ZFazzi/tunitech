
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DeveloperRegistrationForm } from '@/components/developer/DeveloperRegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const DeveloperOnboarding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Information om AI-funktionen */}
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Sparkles className="h-5 w-5 mr-2" />
                AI-driven profiloptimering
              </CardTitle>
              <CardDescription>
                Vår AI kommer automatiskt att skapa en professionell rubrik för din profil baserat på din profilbeskrivning och tekniska färdigheter. Detta hjälper kunder att snabbt förstå din specialisering och expertis.
              </CardDescription>
            </CardHeader>
          </Card>

          <DeveloperRegistrationForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeveloperOnboarding;
