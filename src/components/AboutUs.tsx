
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

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

  // Get card data based on language
  const getCardData = () => {
    switch (language) {
      case "sv":
        return [
          {
            title: "Vad vi gör",
            content: "Vi rekryterar och matchar Tunisiens bästa utvecklare med svenska företag – snabbt och träffsäkert."
          },
          {
            title: "Vårt mål",
            content: "Att vara förstahandsvalet för svenska företag som söker flexibel, högkvalitativ IT-kompetens."
          },
          {
            title: "Varför oss?",
            content: "Vi bygger en bro mellan två länder och skapar möjligheter för både företag och utvecklare."
          },
          {
            title: "Vår styrka",
            content: "Stark marknadsnärvaro, digitala plattformar och strategiska partnerskap för rätt talent vid rätt tidpunkt."
          },
          {
            title: "Global vision",
            content: "Vi sätter Tunisien på teknikkartan och förändrar hur företag samarbetar över gränserna."
          },
          {
            title: "Långsiktigt fokus",
            content: "Vi bygger pålitliga relationer där våra kunder känner sig säkra på vår expertis och nätverk."
          }
        ];
      case "fr":
        return [
          {
            title: "Ce que nous faisons",
            content: "Nous recrutons et associons les meilleurs développeurs de Tunisie avec des entreprises suédoises – rapidement et avec précision."
          },
          {
            title: "Notre objectif",
            content: "Être le premier choix pour les entreprises suédoises à la recherche de talents informatiques flexibles et de haute qualité."
          },
          {
            title: "Pourquoi nous?",
            content: "Nous construisons un pont entre deux pays et créons des opportunités pour les entreprises et les développeurs."
          },
          {
            title: "Notre force",
            content: "Présence forte sur le marché, plateformes numériques et partenariats stratégiques pour le bon talent au bon moment."
          },
          {
            title: "Vision globale",
            content: "Nous mettons la Tunisie sur la carte technologique et transformons la collaboration internationale."
          },
          {
            title: "Focus long terme",
            content: "Nous établissons des relations fiables où nos clients ont confiance en notre expertise et réseau."
          }
        ];
      default: // English
        return [
          {
            title: "What we do",
            content: "We recruit and match Tunisia's top developers with Swedish companies – quickly and accurately."
          },
          {
            title: "Our Goal",
            content: "To be the go-to choice for Swedish companies seeking flexible, high-quality IT talent."
          },
          {
            title: "Why us?",
            content: "We build a bridge between two countries and create opportunities for both companies and developers."
          },
          {
            title: "Our Strength",
            content: "Strong market presence, digital platforms, and strategic partnerships for the right talent at the right time."
          },
          {
            title: "Global Vision",
            content: "We put Tunisia on the tech map and transform how companies collaborate across borders."
          },
          {
            title: "Long-term Focus",
            content: "We build reliable relationships where our clients feel confident in our expertise and network."
          }
        ];
    }
  };

  const cardData = getCardData();

  return (
    <section id="about" className="py-20 section-padding bg-transparent">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardData.map((card, index) => (
              <motion.div
                key={card.title}
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
                    <h3 className="text-xl font-bold mb-4 text-tunitech-mint">
                      {card.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      {card.content}
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
