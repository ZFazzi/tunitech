
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const AboutUs = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  const getContent = () => {
    switch (language) {
      case "sv":
        return {
          sectionTitle: "Om oss",
          summitExperience: "Vi hade en fantastisk upplevelse när vi representerade TuniTech vid årets tunisiska Digital Summit!",
          inspiration: "Det var inspirerande att delta i diskussioner kring digital innovation och gränsöverskridande samarbete — teman som ligger i hjärtat av det vi gör på TuniTech.",
          mission: "Att koppla samman talang och möjligheter över kontinenter är inte bara vår verksamhet — det är vår mission.",
          gratitude: "Vi är tacksamma för möjligheten att visa hur Tunisiens tekniska kompetens kan skapa verklig påverkan för svenska företag och utöver det.",
          thanks: "Ett stort tack till Skander HADDAR, till arrangörerna av #TDS9 och till alla som bidrog till ett så dynamiskt och inspirerande evenemang. Låt oss fortsätta bygga broar och bryta barriärer!",
          hashtags: "#TuniTech #TDS9 #DigitalTransformation #TechTalent #SwedenTunisia #Innovation #ITConsulting #NearshoreTech",
          team: "Felicia Fazzi | Nadia Ouahchi Ghanem"
        };
      case "fr":
        return {
          sectionTitle: "À propos de nous",
          summitExperience: "Nous avons vécu une excellente expérience en représentant TuniTech lors du Sommet Numérique Tunisien de cette année !",
          inspiration: "C'était inspirant de participer aux discussions autour de l'innovation numérique et de la collaboration transfrontalière — des thèmes qui sont au cœur de ce que nous faisons chez TuniTech.",
          mission: "Connecter les talents et les opportunités à travers les continents n'est pas seulement notre activité — c'est notre mission.",
          gratitude: "Nous sommes reconnaissants pour l'opportunité de montrer comment l'expertise technologique tunisienne peut avoir un impact réel pour les entreprises suédoises et au-delà.",
          thanks: "Un grand merci à Skander HADDAR, aux organisateurs du #TDS9 et à tous ceux qui ont contribué à un événement aussi dynamique et inspirant. Continuons à construire des ponts et à briser les barrières !",
          hashtags: "#TuniTech #TDS9 #TransformationNumérique #TalentTech #SuèdeTunisie #Innovation #ConseilIT #TechNearshore",
          team: "Felicia Fazzi | Nadia Ouahchi Ghanem"
        };
      default: // English
        return {
          sectionTitle: "About Us",
          summitExperience: "We had a great experience representing TuniTech at this year's Tunisian Digital Summit!",
          inspiration: "It was inspiring to be part of discussions around digital innovation and cross-border collaboration — themes that are at the heart of what we do at TuniTech.",
          mission: "Connecting talent and opportunities across continents isn't just our business — it's our mission.",
          gratitude: "Grateful for the chance to showcase how Tunisia's tech expertise can power real impact for Swedish companies and beyond.",
          thanks: "A big thank you to Skander HADDAR, to the organizers of #TDS9 and to everyone who contributed to such a dynamic and inspiring event. Let's keep building bridges and breaking barriers!",
          hashtags: "#TuniTech #TDS9 #DigitalTransformation #TechTalent #SwedenTunisia #Innovation #ITConsulting #NearshoreTech",
          team: "Felicia Fazzi | Nadia Ouahchi Ghanem"
        };
    }
  };

  const content = getContent();

  return (
    <section id="about" className="py-20 section-padding bg-tunitech-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {content.sectionTitle}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="glass-card p-8 border border-tunitech-mint/20">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-4 text-gray-300"
                >
                  <p className="text-lg">{content.summitExperience}</p>
                  <p>{content.inspiration}</p>
                  <p>{content.mission} 💻 🚀</p>
                  <p>{content.gratitude}</p>
                  <p>{content.thanks} ❤️</p>
                  <p className="text-tunitech-mint text-sm">{content.hashtags}</p>
                  <p className="font-semibold text-tunitech-blue">{content.team}</p>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <img 
                src="/lovable-uploads/d0c39a01-0fd1-4def-a437-d7d7fb59e2b3.png"
                alt="TuniTech at Digital Summit"
                className="rounded-lg shadow-xl w-full glass-card p-2 border border-tunitech-mint/20"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
