
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const AboutUs = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  // Get section title based on language
  const getSectionTitle = () => {
    switch (language) {
      case "sv":
        return "Om oss";
      case "fr":
        return "À propos de nous";
      default: // English
        return "About Us";
    }
  };

  // Get "What we do" title based on language
  const getWhatWeDoTitle = () => {
    switch (language) {
      case "sv":
        return "Vad vi gör";
      case "fr":
        return "Ce que nous faisons";
      default: // English
        return "What we do";
    }
  };

  // Get "What we do" content based on language
  const getWhatWeDoContent = () => {
    switch (language) {
      case "sv":
        return (
          <>
            <p className="mb-4">
              TuniTech rekryterar, bemannar och matchar Tunisiens främsta utvecklare med svenska företag – snabbt, smidigt och träffsäkert.
            </p>
            <p className="mb-4">
              Med stark marknadsnärvaro, digitala plattformar och strategiska partnerskap skapar vi en dynamisk och flexibel lösning för företag som behöver rätt kompetens vid rätt tidpunkt.
            </p>
            <p className="mb-4">
              TuniTech gör det enkelt att hitta expertis och bygger en bro mellan två länder för en starkare och mer global techindustri.
            </p>
          </>
        );
      case "fr":
        return (
          <>
            <p className="mb-4">
              TuniTech recrute, dote en personnel et associe les meilleurs développeurs de Tunisie avec des entreprises suédoises – rapidement, facilement et avec précision.
            </p>
            <p className="mb-4">
              Avec une forte présence sur le marché, des plateformes numériques et des partenariats stratégiques, nous créons une solution dynamique et flexible pour les entreprises ayant besoin du bon talent au bon moment.
            </p>
            <p className="mb-4">
              TuniTech facilite la recherche d'expertise et construit un pont entre deux pays pour une industrie technologique plus forte et plus globale.
            </p>
          </>
        );
      default: // English
        return (
          <>
            <p className="mb-4">
              TuniTech recruits, staffs, and matches Tunisia's top developers with Swedish companies – quickly, smoothly, and accurately.
            </p>
            <p className="mb-4">
              With a strong market presence, digital platforms, and strategic partnerships, we create a dynamic and flexible solution for companies needing the right talent at the right time.
            </p>
            <p className="mb-4">
              TuniTech makes it easy to find expertise and builds a bridge between two countries for a stronger and more global tech industry.
            </p>
          </>
        );
    }
  };

  return (
    <section id="about" className="py-20 section-padding bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 100 
            }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {getSectionTitle()}
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-tunitech-mint">
              {getWhatWeDoTitle()}
            </h3>
            <div className="text-white/90 text-lg leading-relaxed">
              {getWhatWeDoContent()}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
