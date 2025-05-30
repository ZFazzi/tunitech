
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
    <section className="py-12 bg-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="flex gap-4 items-center backdrop-blur-md bg-white/5 p-6 border border-white/5 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Quote className="text-tunitech-mint w-10 h-10 flex-shrink-0" />
          <div>
            <p className="text-gray-300 italic">
              {quoteText}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
