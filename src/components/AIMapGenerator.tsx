
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AIMapGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { language } = useLanguage();

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const getPrompt = () => {
    switch (language) {
      case "sv":
        return "Skapa en stiliserad världskarta som visar Sverige och Tunisien markerade med tydliga markeringar. Kartan ska vara modern och professionell med Sverige markerat i norra Europa och Tunisien markerat i norra Afrika. Använd en blå och grön färgpalett för att matcha TuniTech:s varumärke. Inkludera en subtil linje som förbinder de två länderna för att visa kopplingen mellan dem.";
      case "fr":
        return "Créer une carte du monde stylisée montrant la Suède et la Tunisie marquées avec des marqueurs clairs. La carte doit être moderne et professionnelle avec la Suède marquée en Europe du Nord et la Tunisie marquée en Afrique du Nord. Utilisez une palette de couleurs bleue et verte pour correspondre à la marque TuniTech. Incluez une ligne subtile reliant les deux pays pour montrer la connexion entre eux.";
      default:
        return "Create a stylized world map showing Sweden and Tunisia marked with clear markers. The map should be modern and professional with Sweden marked in Northern Europe and Tunisia marked in North Africa. Use a blue and green color palette to match TuniTech's branding. Include a subtle line connecting the two countries to show the connection between them.";
    }
  };

  const getTitle = () => {
    switch (language) {
      case "sv":
        return "AI-Genererad Karta";
      case "fr":
        return "Carte Générée par IA";
      default:
        return "AI-Generated Map";
    }
  };

  const getSubtitle = () => {
    switch (language) {
      case "sv":
        return "Visa kopplingen mellan Sverige och Tunisien";
      case "fr":
        return "Montrer la connexion entre la Suède et la Tunisie";
      default:
        return "Showing the connection between Sweden and Tunisia";
    }
  };

  const getButtonText = () => {
    if (isGenerating) {
      switch (language) {
        case "sv":
          return "Genererar...";
        case "fr":
          return "Génération...";
        default:
          return "Generating...";
      }
    }
    switch (language) {
      case "sv":
        return "Generera Karta";
      case "fr":
        return "Générer la Carte";
      default:
        return "Generate Map";
    }
  };

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-map-image', {
        body: { prompt: getPrompt() }
      });

      if (error) {
        throw error;
      }

      if (data.success && data.image) {
        setGeneratedImage(data.image);
        toast.success(language === "sv" ? "Karta genererad!" : language === "fr" ? "Carte générée!" : "Map generated!");
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(language === "sv" ? "Kunde inte generera karta" : language === "fr" ? "Impossible de générer la carte" : "Failed to generate map");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-lg p-8 border border-white/5">
      <h3 className="text-2xl font-bold mb-2 text-center text-tunitech-mint">
        {getTitle()}
      </h3>
      <p className="text-gray-300 text-center mb-6">
        {getSubtitle()}
      </p>
      
      <div className="text-center mb-6">
        <Button 
          onClick={generateImage}
          disabled={isGenerating}
          className="bg-tunitech-blue hover:bg-tunitech-blue/80 text-white px-6 py-3"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </div>

      {generatedImage && (
        <div className="relative w-full rounded-lg overflow-hidden">
          <img 
            src={generatedImage} 
            alt="AI-generated map showing Sweden and Tunisia"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default AIMapGenerator;
