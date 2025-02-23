
import { motion } from "framer-motion";

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
            <GradientText>Talented Minds, Tailored Solutions</GradientText>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Digital Experts Delivered on Demand
          </p>
          
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            I en värld där teknikutvecklingen aldrig står still krävs skarpa hjärnor för att bygga framtidens lösningar. 
            TuniTech kopplar samman de bästa utvecklarna från Tunisien med innovativa företag i Sverige. 
            Vi bemannar er med högkvalificerade utvecklare – när ni behöver dem, hur ni behöver dem. 
            Vår modell bygger på smidighet, effektivitet och innovation – där rätt talang möter rätt behov.
          </p>

          <motion.div 
            className="mt-12 space-y-8 text-left max-w-4xl mx-auto glass-card p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              <GradientText>Why TuniTech?</GradientText>
            </h2>
            <motion.div 
              className="space-y-4"
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
              {[
                "Smart Minds: Våra utvecklare är drivna, kompetenta och lösningsorienterade.",
                "Smart Solutions: Vi erbjuder flexibla utvecklare som snabbt anpassar sig efter era projekt.",
                "Global Reach, Local Impact: Vi skapar gränsöverskridande samarbeten som stärker er digitala konkurrenskraft.",
                "Cost-Efficient, Quality-Driven: Premiumutveckling utan storbolagens overhead-kostnader."
              ].map((text, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start space-x-3"
                >
                  <span className="text-tunitech-mint flex-shrink-0">✅</span>
                  <p className="text-gray-300">{text}</p>
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
              "Att göra talang tillgänglig över gränser, där intelligens och innovation möts för att skapa smarta, framtidssäkra lösningar."
            </GradientText>
          </motion.div>
          
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
