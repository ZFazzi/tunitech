
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
            description: "Starka tekniska universitet i Tunisien"
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
            description: "Universités techniques solides en Tunisie"
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
            description: "Strong technical universities in Tunisia"
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
        return "att arbeta med IT-utvecklare från Tunisien";
      case "fr":
        return "de travailler avec des développeurs IT de Tunisie";
      default:
        return "working with IT developers from Tunisia";
    }
  };
  
  const advantages = getAdvantages();

  return (
    <section id="advantages" className="py-16 section-padding bg-tunitech-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-tunitech-mint">
            {getSectionTitle()}
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-300">
            {getSubtitle()}
          </p>
          
          <div className="relative">
            {/* Line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-tunitech-mint hidden md:block" />
            
            {/* Advantages grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                className="col-span-3 space-y-16"
              >
                {/* First row */}
                <div className="grid md:grid-cols-3 gap-8">
                  {advantages.slice(0, 3).map((advantage, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="relative"
                    >
                      {/* Dot */}
                      <div className="absolute -left-4 top-2 h-3 w-3 bg-tunitech-mint rounded-full hidden md:block" />
                      <h3 className="text-xl font-bold mb-3 text-tunitech-mint">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-300">
                        {advantage.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Line in the middle */}
                <div className="h-0.5 w-full bg-tunitech-mint my-8" />
                
                {/* Second row */}
                <div className="grid md:grid-cols-3 gap-8">
                  {advantages.slice(3).map((advantage, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="relative"
                    >
                      {/* Dot */}
                      <div className="absolute -left-4 top-2 h-3 w-3 bg-tunitech-mint rounded-full hidden md:block" />
                      <h3 className="text-xl font-bold mb-3 text-tunitech-mint">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-300">
                        {advantage.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
