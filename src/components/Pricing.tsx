
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CircleDollarSign } from "lucide-react";

export const Pricing = () => {
  const { language } = useLanguage();
  
  // Pricing title based on language
  const getPricingTitle = () => {
    switch (language) {
      case "sv":
        return "Vår prismodell";
      case "fr":
        return "Notre modèle de prix";
      default: // English
        return "Our Pricing Model";
    }
  };
  
  // Description text based on language
  const getPricingDescription = () => {
    switch (language) {
      case "sv":
        return "Vi erbjuder flexibla prisalternativ för att passa dina behov.";
      case "fr":
        return "Nous offrons des options de tarification flexibles pour répondre à vos besoins.";
      default: // English
        return "We offer flexible pricing options to fit your needs.";
    }
  };
  
  // Fixed Swedish pricing options
  const getPricingOptions = () => {
    switch (language) {
      case "sv":
        return ["Pris per timme/dag", "Pris per månad", "Pris per projekt"];
      case "fr":
        return ["Prix par heure/jour", "Prix par mois", "Prix par projet"];
      default: // English
        return ["Price per hour/day", "Price per month", "Price per project"];
    }
  };
  
  const pricingTitle = getPricingTitle();
  const pricingDescription = getPricingDescription();
  const pricingOptions = getPricingOptions();
  
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-tunitech-mint/5 to-transparent opacity-70"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <CircleDollarSign className="w-12 h-12 mx-auto mb-6 text-tunitech-mint" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-tunitech-mint to-tunitech-blue bg-clip-text text-transparent">
              {pricingTitle}
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {pricingDescription}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="glass-effect p-8 hover:shadow-lg hover:border-tunitech-mint/30 transition-all duration-500"
            >
              <h3 className="text-2xl font-medium text-center text-white mb-6">{option}</h3>
              <div className="h-1 w-16 mx-auto bg-gradient-to-r from-tunitech-blue to-tunitech-mint rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
