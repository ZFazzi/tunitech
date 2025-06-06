
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CircleDollarSign } from "lucide-react";

export const Pricing = () => {
  const { language } = useLanguage();
  
  // Pricing title based on language
  const getPricingTitle = () => {
    switch (language) {
      case "sv":
        return "Flexibla priser anpassade efter dina behov";
      case "fr":
        return "Prix flexibles adaptés à vos besoins";
      default: // English
        return "Flexible pricing tailored to your needs";
    }
  };
  
  // Description text based on language
  const getPricingDescription = () => {
    switch (language) {
      case "sv":
        return "Hos TuniTech förstår vi att varje projekt är unikt. Därför erbjuder vi flexibla prismodeller som anpassas efter dina specifika behov och projektets omfattning. Oavsett om du behöver en utvecklare för några timmar, flera månader eller ett helt projekt, så hittar vi en lösning som passar din budget och dina mål.";
      case "fr":
        return "Chez TuniTech, nous comprenons que chaque projet est unique. C'est pourquoi nous proposons des modèles de tarification flexibles qui s'adaptent à vos besoins spécifiques et à la portée de votre projet. Que vous ayez besoin d'un développeur pour quelques heures, plusieurs mois ou un projet complet, nous trouverons une solution qui correspond à votre budget et à vos objectifs.";
      default: // English
        return "At TuniTech, we understand that every project is unique. That's why we offer flexible pricing models that adapt to your specific needs and project scope. Whether you need a developer for a few hours, several months, or a complete project, we'll find a solution that fits your budget and goals.";
    }
  };
  
  const pricingTitle = getPricingTitle();
  const pricingDescription = getPricingDescription();
  
  return (
    <section className="py-16 bg-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <CircleDollarSign className="w-12 h-12 mx-auto mb-6 text-tunitech-mint" />
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-tunitech-mint">{pricingTitle}</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {pricingDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
