import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const Advantages = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  // Get advantages based on language
  const getAdvantages = () => {
    switch (language) {
      case "sv":
        return [
          {
            title: "Kostnadseffektivitet",
            description: "Hög kvalitet - Lågt pris"
          },
          {
            title: "Hög kompetensnivå",
            description: "Starka tekniska universitet i Nordafrika"
          },
          {
            title: "Kulturell närhet till Europa",
            description: "Underlättar samarbete, förståelse och kommunikation"
          },
          {
            title: "Centraleuropeisk tidszon",
            description: "Gör realtidssamarbete enklare utan större tidsskillnad"
          },
          {
            title: "Flerspråkiga utvecklare",
            description: "Våra utvecklare talar engelska, franska, arabiska och tyska, vilket säkerställer effektiv kommunikation"
          },
          {
            title: "Innovationskraft",
            description: "En stark entreprenörsanda som ger tillgång till kreativa och lösningsorienterade utvecklare"
          }
        ];
      case "fr":
        return [
          {
            title: "Rapport coût-efficacité",
            description: "Haute qualité - Prix bas"
          },
          {
            title: "Niveau de compétence élevé",
            description: "Universités techniques solides en Afrique du Nord"
          },
          {
            title: "Proximité culturelle avec l'Europe",
            description: "Facilite la collaboration, la compréhension et la communication"
          },
          {
            title: "Fuseau horaire d'Europe centrale",
            description: "Facilite la collaboration en temps réel sans décalage horaire majeur"
          },
          {
            title: "Développeurs multilingues",
            description: "Nos développeurs parlent anglais, français, arabe et allemand, ce qui assure une communication efficace"
          },
          {
            title: "Puissance d'innovation",
            description: "Un fort esprit d'entreprise, donnant accès à des développeurs créatifs et orientés solutions"
          }
        ];
      default: // English
        return [
          {
            title: "Cost-effectiveness",
            description: "High quality - Low price"
          },
          {
            title: "High skill level",
            description: "Strong technical universities in North Africa"
          },
          {
            title: "Cultural proximity to Europe",
            description: "Facilitating collaboration, understanding, and communication"
          },
          {
            title: "Central European Time zone",
            description: "Making real-time collaboration easier without major time difference"
          },
          {
            title: "Multilingual Developers",
            description: "Our developers speaks English, French, Arabic and German, which ensures efficient communication"
          },
          {
            title: "Innovation power",
            description: "A strong entrepreneurial spirit, providing access to creative and solution-oriented developers"
          }
        ];
    }
  };
  
  // Get section title based on language
  const getSectionTitle = () => {
    switch (language) {
      case "sv":
        return "Fördelar";
      case "fr":
        return "Avantages";
      default:
        return "Advantages";
    }
  };
  
  // Get subtitle based on language
  const getSubtitle = () => {
    switch (language) {
      case "sv":
        return "att arbeta med IT-utvecklare från Nordafrika";
      case "fr":
        return "de travailler avec des développeurs IT d'Afrique du Nord";
      default:
        return "working with IT developers from North Africa";
    }
  };
  
  const advantages = getAdvantages();

  return (
    <section id="advantages" className="py-16 md:py-24 bg-tunitech-dark relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
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
          <p className="text-xl md:text-2xl text-gray-300">
            {getSubtitle()}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {advantages.slice(0, 3).map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/10 backdrop-blur-sm rounded-lg p-6 border border-white/5"
            >
              <h3 className="text-xl font-bold mb-3 text-tunitech-mint">
                {advantage.title}
              </h3>
              <p className="text-gray-300">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="h-px w-full bg-tunitech-mint/30 my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.slice(3).map((advantage, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/10 backdrop-blur-sm rounded-lg p-6 border border-white/5"
            >
              <h3 className="text-xl font-bold mb-3 text-tunitech-mint">
                {advantage.title}
              </h3>
              <p className="text-gray-300">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
