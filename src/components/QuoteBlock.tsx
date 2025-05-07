
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const QuoteBlock = () => {
  const { language } = useLanguage();
  
  // Get quote text based on language
  const getDiversityQuote = () => {
    switch (language) {
      case "sv":
        return "Att arbeta med utvecklare från olika bakgrunder ger nya insikter, perspektiv och innovation till projekten.";
      case "fr":
        return "Travailler avec des développeurs de divers horizons apporte de nouvelles idées, perspectives et innovations aux projets.";
      default: // English
        return "Working with developers from diverse backgrounds brings new insights, perspectives, and innovation to projects.";
    }
  };

  const quoteText = getDiversityQuote();
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Subtil gradient som överlagrar bakgrunden */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-white/3 to-transparent blur-2xl opacity-60 z-0"></div>
      
      <motion.div 
        className="max-w-4xl mx-auto px-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div 
          className="glass-effect p-10 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex gap-6 items-center">
            <Quote className="text-tunitech-mint w-14 h-14 flex-shrink-0" />
            <div>
              <p className="text-xl md:text-2xl text-gray-300 italic leading-relaxed">
                "{quoteText}"
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
