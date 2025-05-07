
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const QuoteBlock = () => {
  const { language } = useLanguage();
  
  // Get quote text based on language
  const getDiversityQuote = () => {
    switch (language) {
      case "sv":
        return {
          title: "Mångfald och nya perspektiv",
          text: "Att arbeta med utvecklare från olika bakgrunder ger nya insikter, perspektiv och innovation till projekten."
        };
      case "fr":
        return {
          title: "Diversité et nouvelles perspectives",
          text: "Travailler avec des développeurs de divers horizons apporte de nouvelles idées, perspectives et innovations aux projets."
        };
      default: // English
        return {
          title: "Diversity and fresh perspectives",
          text: "Working with developers from diverse backgrounds brings new insights, perspectives, and innovation to projects."
        };
    }
  };

  const diversityQuote = getDiversityQuote();
  
  return (
    <section className="py-12 bg-tunitech-dark">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="flex gap-4 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <Quote className="text-tunitech-mint w-12 h-12 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-medium mb-2 text-white">
              {diversityQuote.title}
            </h3>
            <p className="text-gray-300">
              {diversityQuote.text}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
