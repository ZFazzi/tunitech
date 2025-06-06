
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { RoleSelection } from "./RoleSelection";

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ backgroundPosition: "0% 50%" }}
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-[length:200%_100%] bg-clip-text text-transparent"
  >
    {children}
  </motion.span>
);

export const Hero = () => {
  const { language, translations } = useLanguage();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const t = translations[language];
  
  // These phrases will always be in English regardless of language selection
  const tagline = "Talented Minds, Tailored Solutions";
  
  // Paragraph text changes based on language
  const getParagraphText = () => {
    switch (language) {
      case "sv":
        return "TuniTech kopplar samman de bästa utvecklarna från Tunisien med innovativa företag i Sverige. Vi levererar högkvalificerade utvecklare – när ni behöver dem, hur ni behöver dem.";
      case "fr":
        return "TuniTech connecte les meilleurs développeurs tunisiens avec des entreprises innovantes en Suède. Nous livrons des développeurs hautement qualifiés - quand vous en avez besoin, comme vous en avez besoin.";
      default: // English
        return "TuniTech connects the best developers from Tunisia with innovative companies in Sweden. We deliver highly qualified developers - when you need them, how you need them.";
    }
  };
  
  // Get button text based on language
  const getButtonText = () => {
    switch (language) {
      case "sv": return "Kom igång";
      case "fr": return "Commencer";
      default: return "Get Started";
    }
  };

  const handleGetStarted = () => {
    setShowRoleSelection(true);
  };

  return (
    <>
      <section id="home" className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tunitech-dark/50 to-tunitech-dark" />
        
        {/* Background tech image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
            alt="Technology background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              <GradientText>{tagline}</GradientText>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              {getParagraphText()}
            </p>
            
            <div className="mt-16">
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-tunitech-mint to-tunitech-blue text-white font-semibold px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg md:text-xl"
              >
                {getButtonText()}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <RoleSelection 
        isOpen={showRoleSelection} 
        onClose={() => setShowRoleSelection(false)} 
      />
    </>
  );
};
