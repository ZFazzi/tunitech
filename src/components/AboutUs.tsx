import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

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

  // Get "What we do" title based on language
  const getWhatWeDoTitle = () => {
    switch (language) {
      case "sv":
        return "Vad vi gör";
      case "fr":
        return "Ce que nous faisons";
      default: // English
        return "What we do";
    }
  };

  // Get "What we do" content based on language
  const getWhatWeDoContent = () => {
    switch (language) {
      case "sv":
        return (
          <>
            <p className="mb-4">
              TuniTech rekryterar, bemannar och matchar Tunisiens främsta utvecklare med svenska företag – snabbt, smidigt och träffsäkert.
            </p>
            <p className="mb-4">
              Med stark marknadsnärvaro, digitala plattformar och strategiska partnerskap skapar vi en dynamisk och flexibel lösning för företag som behöver rätt kompetens vid rätt tidpunkt.
            </p>
            <p className="mb-4">
              TuniTech gör det enkelt att hitta expertis och bygger en bro mellan två länder för en starkare och mer global techindustri.
            </p>
          </>
        );
      case "fr":
        return (
          <>
            <p className="mb-4">
              TuniTech recrute, dote en personnel et associe les meilleurs développeurs de Tunisie avec des entreprises suédoises – rapidement, facilement et avec précision.
            </p>
            <p className="mb-4">
              Avec une forte présence sur le marché, des plateformes numériques et des partenariats stratégiques, nous créons une solution dynamique et flexible pour les entreprises ayant besoin du bon talent au bon moment.
            </p>
            <p className="mb-4">
              TuniTech facilite la recherche d'expertise et construit un pont entre deux pays pour une industrie technologique plus forte et plus globale.
            </p>
          </>
        );
      default: // English
        return (
          <>
            <p className="mb-4">
              TuniTech recruits, staffs, and matches Tunisia's top developers with Swedish companies – quickly, smoothly, and accurately.
            </p>
            <p className="mb-4">
              With a strong market presence, digital platforms, and strategic partnerships, we create a dynamic and flexible solution for companies needing the right talent at the right time.
            </p>
            <p className="mb-4">
              TuniTech makes it easy to find expertise and builds a bridge between two countries for a stronger and more global tech industry.
            </p>
          </>
        );
    }
  };

  // Get "Our Goal" title based on language
  const getOurGoalTitle = () => {
    switch (language) {
      case "sv":
        return "Vårt mål";
      case "fr":
        return "Notre objectif";
      default: // English
        return "Our Goal";
    }
  };

  // Get "Our Goal" content based on language
  const getOurGoalContent = () => {
    switch (language) {
      case "sv":
        return (
          <>
            <p className="mb-4">
              TuniTech kommer att vara förstahandsvalet för svenska företag som söker flexibel, högkvalitativ IT-kompetens och en pålitlig partner inom teknisk bemanning och rekrytering.
            </p>
            <p className="mb-4">
              Vi kommer att bygga långsiktiga relationer där våra kunder känner sig säkra på vår expertis och vårt nätverk av tunisiska topputvecklare.
            </p>
            <p className="mb-4">
              Samtidigt kommer vi att vara en attraktiv arbetsgivare för utvecklare i Tunisien som sträver efter att arbeta internationellt och utveckla sina karriärer.
            </p>
            <p className="mb-4">
              Genom vårt arbete kommer vi att sätta Tunisien på teknikkartan och förändra hur företag hittar, anställer och samarbetar med talanger över gränserna.
            </p>
          </>
        );
      case "fr":
        return (
          <>
            <p className="mb-4">
              TuniTech sera le premier choix pour les entreprises suédoises à la recherche de talents informatiques flexibles et de haute qualité, ainsi qu'un partenaire de confiance en matière de dotation en personnel et de recrutement.
            </p>
            <p className="mb-4">
              Nous établirons des relations à long terme où nos clients auront confiance en notre expertise et en notre réseau de développeurs tunisiens de premier plan.
            </p>
            <p className="mb-4">
              En même temps, nous serons un employeur attrayant pour les développeurs en Tunisie qui aspirent à travailler à l'international et à développer leur carrière.
            </p>
            <p className="mb-4">
              Grâce à notre travail, nous mettrons la Tunisie sur la carte technologique et transformerons la façon dont les entreprises trouvent, recrutent et collaborent avec des talents au-delà des frontières.
            </p>
          </>
        );
      default: // English
        return (
          <>
            <p className="mb-4">
              TuniTech will be the go-to choice for Swedish companies seeking flexible, high-quality IT talent and a trusted partner in tech staffing and recruitment.
            </p>
            <p className="mb-4">
              We will build long-term relationships where our clients feel confident in our expertise and our network of top Tunisian developers.
            </p>
            <p className="mb-4">
              At the same time, we will be an attractive employer for developers in Tunisia who aspire to work internationally and grow their careers.
            </p>
            <p className="mb-4">
              Through our work, we will put Tunisia on the tech map and transform how companies find, hire, and collaborate with talent across borders.
            </p>
          </>
        );
    }
  };

  return (
    <section id="about" className="py-20 section-padding bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
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
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-tunitech-mint">
              {getWhatWeDoTitle()}
            </h3>
            <div className="text-white/90 text-lg leading-relaxed">
              {getWhatWeDoContent()}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/10"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-tunitech-mint">
              {getOurGoalTitle()}
            </h3>
            <div className="text-white/90 text-lg leading-relaxed">
              {getOurGoalContent()}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
