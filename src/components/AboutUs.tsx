
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

  return (
    <section id="about" className="py-20 section-padding bg-tunitech-dark">
      <div className="max-w-7xl mx-auto">
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
        </motion.div>
      </div>
    </section>
  );
};
