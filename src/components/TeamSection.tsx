
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, Target, Heart } from "lucide-react";

export const TeamSection = () => {
  const { language } = useLanguage();
  
  // Get section title based on language
  const getSectionTitle = () => {
    switch (language) {
      case "sv":
        return "Vårt team & kultur";
      case "fr":
        return "Notre équipe & culture";
      default:
        return "Our Team & Culture";
    }
  };

  // Get team values based on language
  const getTeamValues = () => {
    switch (language) {
      case "sv":
        return [
          {
            icon: Users,
            title: "Erfaret team",
            description: "Vårt team består av erfarna rekryterare och tekniska experter med djup förståelse för både svenska och tunisiska marknader."
          },
          {
            icon: Globe,
            title: "Kulturell förståelse",
            description: "Vi överbryggar kulturella skillnader och skapar framgångsrika samarbeten mellan Sverige och Tunisien."
          },
          {
            icon: Target,
            title: "Resultatfokuserad",
            description: "Vi mäter vår framgång genom våra kunders framgång och utvecklarnas karriärtillväxt."
          },
          {
            icon: Heart,
            title: "Mänsklig approach",
            description: "Bakom varje matchning står människor med drömmar och ambitioner som vi hjälper att förverkliga."
          }
        ];
      case "fr":
        return [
          {
            icon: Users,
            title: "Équipe expérimentée",
            description: "Notre équipe se compose de recruteurs expérimentés et d'experts techniques avec une compréhension approfondie des marchés suédois et tunisiens."
          },
          {
            icon: Globe,
            title: "Compréhension culturelle",
            description: "Nous comblons les différences culturelles et créons des collaborations réussies entre la Suède et la Tunisie."
          },
          {
            icon: Target,
            title: "Axé sur les résultats",
            description: "Nous mesurons notre succès par le succès de nos clients et la croissance de carrière des développeurs."
          },
          {
            icon: Heart,
            title: "Approche humaine",
            description: "Derrière chaque correspondance se trouvent des personnes avec des rêves et des ambitions que nous aidons à réaliser."
          }
        ];
      default:
        return [
          {
            icon: Users,
            title: "Experienced Team",
            description: "Our team consists of experienced recruiters and technical experts with deep understanding of both Swedish and Tunisian markets."
          },
          {
            icon: Globe,
            title: "Cultural Understanding",
            description: "We bridge cultural differences and create successful collaborations between Sweden and Tunisia."
          },
          {
            icon: Target,
            title: "Results-Focused",
            description: "We measure our success through our clients' success and developers' career growth."
          },
          {
            icon: Heart,
            title: "Human Approach",
            description: "Behind every match are people with dreams and ambitions that we help realize."
          }
        ];
    }
  };

  const teamValues = getTeamValues();

  return (
    <section className="py-20 section-padding bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 + 0.3 
                }}
                viewport={{ once: true }}
              >
                <Card className="bg-black/10 backdrop-blur-sm border border-white/10 hover:border-tunitech-mint/30 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <value.icon className="w-8 h-8 text-tunitech-mint mb-4" />
                    <h3 className="text-xl font-bold mb-4 text-tunitech-mint">
                      {value.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
