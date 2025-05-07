
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

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
        return "Vi erbjuder flexibla prisalternativ för att passa dina behov — oavsett om du behöver timvis/dagligt stöd, en heltidsmedarbetare eller en leverans till fast pris.";
      case "fr":
        return "Nous offrons des options de tarification flexibles pour répondre à vos besoins — que vous ayez besoin d'un support horaire/quotidien, d'un membre d'équipe à temps plein ou d'une livraison de projet à prix fixe.";
      default: // English
        return "We offer flexible pricing options to fit your needs — whether you require hourly/daily support, a full-time team member, or a fixed-price project delivery.";
    }
  };
  
  // Rate description based on language
  const getRatesDescription = () => {
    switch (language) {
      case "sv":
        return "Våra priser är konkurrenskraftiga och återspeglar den höga kvaliteten, expertisen och tillförlitligheten hos våra tunisiska utvecklare.";
      case "fr":
        return "Nos tarifs sont compétitifs et reflètent la haute qualité, l'expertise et la fiabilité de nos développeurs tunisiens.";
      default: // English
        return "Our rates are competitive and reflect the high quality, expertise, and reliability of our Tunisian developers.";
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
  const ratesDescription = getRatesDescription();
  const pricingOptions = getPricingOptions();
  
  return (
    <section className="py-16 bg-tunitech-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-8 text-tunitech-mint">{pricingTitle}</h2>
            
            <p className="text-xl mb-10 text-white">
              {pricingDescription}
            </p>
            
            <p className="text-xl text-white">
              {ratesDescription}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8"
          >
            {pricingOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                viewport={{ once: true }}
                className={`p-6 rounded-lg w-full ${index === 2 ? 'bg-tunitech-mint text-tunitech-dark' : 'bg-tunitech-blue text-white'}`}
              >
                <h3 className="text-3xl font-semibold text-center">{option}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
