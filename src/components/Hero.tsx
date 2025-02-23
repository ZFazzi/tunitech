
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-tunitech-dark/50 to-tunitech-dark" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <img
            src="/lovable-uploads/9e74fbfb-e487-4cc3-a2e1-827bc6ac79de.png"
            alt="Tunitech Logo"
            className="h-20 md:h-24 mx-auto mb-8"
          />
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Developers Delivered on Demand
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Talented Minds, Tailored Solutions
          </p>
          
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            I en värld där teknikutvecklingen aldrig står still krävs skarpa hjärnor för att bygga framtidens lösningar. 
            TuniTech kopplar samman de bästa utvecklarna från Tunisien med innovativa företag i Sverige. 
            Vi bemannar er med högkvalificerade utvecklare – när ni behöver dem, hur ni behöver dem. 
            Vår modell bygger på smidighet, effektivitet och innovation – där rätt talang möter rätt behov.
          </p>
          
          <div className="mt-8">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-tunitech-mint to-tunitech-blue text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
