
import { motion } from "framer-motion";
import { Clock, Users, BriefCase, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Flexibility = () => {
  const { language, translations } = useLanguage();
  
  // Define flexibility options
  const flexibilityOptions = [
    {
      icon: Clock,
      title: translations[language].contractOptionsTitle || "Flexible Hours",
      description: translations[language].contractOptions || "Our talents can be contracted full-time, part-time, or on an hourly basis."
    },
    {
      icon: Users,
      title: translations[language].teamOptionsTitle || "Team Integration",
      description: translations[language].teamOptions || "They can join an existing team or lead their own projects."
    },
    {
      icon: BriefCase,
      title: translations[language].assignmentLengthTitle || "Assignment Length",
      description: translations[language].assignmentLength || "They are available for short-term or long-term assignments."
    },
    {
      icon: User,
      title: translations[language].experienceLevelsTitle || "Experience Levels",
      description: translations[language].experienceLevels || "They range from curious recent graduates to senior experts."
    }
  ];

  return (
    <section id="flexibility" className="section-padding bg-black relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {translations[language].whyUsTitle || "Why us?"}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {translations[language].flexibilitySubtitle || "Your wish is our demand"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flexibilityOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <option.icon className="w-10 h-10 text-tunitech-mint mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-400 text-sm">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
