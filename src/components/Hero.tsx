
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const GradientText = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ backgroundPosition: "0% 50%" }}
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-[length:200%_100%] bg-clip-text text-transparent"
  >
    {children}
  </motion.span>
);

export const Hero = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  // These phrases will always be in English regardless of language selection
  const tagline = "Talented Minds, Tailored Solutions";
  const subTagline = "Digital Experts Delivered on Demand";
  
  // Paragraph text changes based on language
  const getParagraphText = () => {
    switch (language) {
      case "sv":
        return "I en värld där teknikutvecklingen aldrig står still krävs skarpa hjärnor för att bygga framtidens lösningar. TuniTech kopplar samman de bästa utvecklarna från Tunisien med innovativa företag i Sverige. Vi bemannar er med högkvalificerade utvecklare – när ni behöver dem, hur ni behöver dem. Vår modell bygger på smidighet, effektivitet och innovation – där rätt talang möter rätt behov.";
      case "fr":
        return "Dans un monde où le développement technologique ne s'arrête jamais, des esprits vifs sont nécessaires pour construire les solutions de demain. TuniTech connecte les meilleurs développeurs tunisiens avec des entreprises innovantes en Suède. Nous vous dotons de développeurs hautement qualifiés - quand vous en avez besoin, comme vous en avez besoin. Notre modèle est basé sur l'agilité, l'efficacité et l'innovation - où le bon talent rencontre le bon besoin.";
      default: // English
        return "In a world where technological development never stands still, sharp minds are needed to build the solutions of tomorrow. TuniTech connects the best developers from Tunisia with innovative companies in Sweden. We staff you with highly qualified developers - when you need them, how you need them. Our model is based on agility, efficiency and innovation - where the right talent meets the right need.";
    }
  };
  
  // Features text changes based on language
  const getFeatures = () => {
    switch (language) {
      case "sv":
        return [
          {
            title: t.talentedMindsTitle,
            description: "Våra utvecklare är drivna, kompetenta och lösningsorienterade.",
          },
          {
            title: t.tailoredSolutionsTitle,
            description: "Vi erbjuder flexibla utvecklare som snabbt anpassar sig efter era projekt.",
          },
          {
            title: t.globalReachTitle,
            description: "Vi skapar gränsöverskridande samarbeten som stärker er digitala konkurrenskraft. Med samma tidszon som Sverige får ni smidigare kommunikation och effektivare samarbete.",
          },
          {
            title: t.costEfficientTitle,
            description: "Premiumutveckling utan storbolagens overhead-kostnader.",
          }
        ];
      case "fr":
        return [
          {
            title: t.talentedMindsTitle,
            description: "Nos développeurs sont motivés, compétents et orientés solutions.",
          },
          {
            title: t.tailoredSolutionsTitle,
            description: "Nous offrons des développeurs flexibles qui s'adaptent rapidement à vos projets.",
          },
          {
            title: t.globalReachTitle,
            description: "Nous créons des collaborations transfrontalières qui renforcent votre compétitivité numérique. Avec le même fuseau horaire que la Suède, vous bénéficiez d'une communication plus fluide et d'une collaboration plus efficace.",
          },
          {
            title: t.costEfficientTitle,
            description: "Développement premium sans les coûts généraux des grandes entreprises.",
          }
        ];
      default: // English
        return [
          {
            title: t.talentedMindsTitle,
            description: "Our developers are driven, competent, and solution-oriented.",
          },
          {
            title: t.tailoredSolutionsTitle,
            description: "We offer flexible developers who quickly adapt to your projects.",
          },
          {
            title: t.globalReachTitle,
            description: "We create cross-border collaborations that strengthen your digital competitiveness. Sharing the same time zone as Sweden provides smoother communication and more efficient collaboration.",
          },
          {
            title: t.costEfficientTitle,
            description: "Premium development without the overhead costs of large companies.",
          }
        ];
    }
  };
  
  // Get button text based on language
  const getButtonText = () => {
    switch (language) {
      case "sv": return "Kom igång";
      case "fr": return "Commencer";
      default: return "Get Started";
    }
  };
  
  // Quote text based on language
  const getQuoteText = () => {
    switch (language) {
      case "sv":
        return "\"Att göra talang tillgänglig över gränser, där intelligens och innovation möts för att skapa smarta, framtidssäkra lösningar.\"";
      case "fr":
        return "\"Rendre le talent accessible au-delà des frontières, où l'intelligence et l'innovation se rencontrent pour créer des solutions intelligentes et pérennes.\"";
      default: // English
        return "\"Making talent accessible across borders, where intelligence and innovation meet to create smart, future-proof solutions.\"";
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-tunitech-dark/50 to-tunitech-dark" />
      
      {/* Background tech image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" 
          alt="Technology background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <img
            src="/lovable-uploads/36dd338f-a61a-41d1-ad24-3126f66bd23b.png"
            alt="Tunitech Logo"
            className="h-20 md:h-24 mx-auto mb-8"
          />
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            <GradientText>{tagline}</GradientText>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            {subTagline}
          </p>
          
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {getParagraphText()}
          </p>

          <motion.div 
            className="mt-12 space-y-8 text-left max-w-4xl mx-auto glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
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
            >
              {getFeatures().map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="glass-card p-6 border border-tunitech-mint/20 hover:border-tunitech-mint/40 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    <GradientText>{item.title}</GradientText>
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 text-gray-300 text-lg max-w-4xl mx-auto glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GradientText>
              {getQuoteText()}
            </GradientText>
          </motion.div>
          
          <div className="mt-8">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-tunitech-mint to-tunitech-blue text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {getButtonText()}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
