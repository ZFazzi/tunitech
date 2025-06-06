
import { motion } from "framer-motion";
import { Brain, Lightbulb, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const values = [
  {
    icon: Brain,
    title: "Smart Solutions",
    translationKey: "smartSolutions",
  },
  {
    icon: Users,
    title: "Client-Centric",
    translationKey: "clientCentric",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    translationKey: "innovation",
  },
];

export const Values = () => {
  const { language, translations } = useLanguage();
  
  return (
    <section className="section-padding bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            // Get the correct title based on language
            const valueTitle = translations[language][value.translationKey + "Title"];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center group hover:bg-white/10 transition-all duration-300"
              >
                <value.icon className="w-12 h-12 text-tunitech-mint mx-auto mb-6 group-hover:text-tunitech-blue transition-colors duration-300" />
                <h3 className="text-xl font-semibold text-white mb-4">{valueTitle}</h3>
                <p className="text-gray-400">{translations[language][value.translationKey]}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
