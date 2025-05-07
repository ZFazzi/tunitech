
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
  
  // Pricing options based on language
  const getPricingOptions = () => {
    switch (language) {
      case "sv":
        return ["Timvis/Daglig taxa", "Månatlig fast pris", "Projektbaserad prissättning"];
      case "fr":
        return ["Tarif horaire/journalier", "Prix fixe mensuel", "Tarification basée sur le projet"];
      default: // English
        return ["Hourly/Daily Rate", "Monthly Fixed Price", "Project-Based Pricing"];
    }
  };
  
  const pricingTitle = getPricingTitle();
  const pricingDescription = getPricingDescription();
  const pricingOptions = getPricingOptions();
  
  return (
    <section className="py-16 bg-tunitech-dark">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <CircleDollarSign className="w-10 h-10 mx-auto mb-4 text-tunitech-mint" />
          <h2 className="text-3xl font-bold mb-4 text-tunitech-mint">{pricingTitle}</h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            {pricingDescription}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 border border-white/10 hover:border-tunitech-mint/40 transition-all duration-300"
            >
              <h3 className="text-xl font-medium text-center text-white mb-2">{option}</h3>
              <div className="h-1 w-12 mx-auto mt-4 bg-gradient-to-r from-tunitech-blue to-tunitech-mint rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
