
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export const Team = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="team" className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">{t.theTeam}</h2>
          <p className="text-xl md:text-2xl text-gray-300 italic max-w-3xl mx-auto">{t.teamTagline}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {/* Felicia Fazzi */}
          <motion.div variants={item} className="flex flex-col items-center">
            <Avatar className="w-64 h-64 mb-6 border-4 border-teal-500">
              <AvatarImage src="/lovable-uploads/d9285a50-1af2-426c-bdae-f8fcb941985c.png" alt="Felicia Fazzi" className="object-cover object-[25%_25%]" />
              <AvatarFallback className="text-4xl bg-teal-900 text-white">FF</AvatarFallback>
            </Avatar>
            <h3 className="text-4xl font-bold text-teal-400 mb-2">FELICIA FAZZI</h3>
            <p className="text-2xl font-semibold text-white mb-4">CEO</p>
            <p className="text-gray-300 text-center">{t.feliciaDesc}</p>
          </motion.div>

          {/* Nadia Ouahchi */}
          <motion.div variants={item} className="flex flex-col items-center">
            <Avatar className="w-64 h-64 mb-6 border-4 border-teal-500">
              <AvatarImage src="/lovable-uploads/d9285a50-1af2-426c-bdae-f8fcb941985c.png" alt="Nadia Ouahchi" className="object-cover object-[50%_25%]" />
              <AvatarFallback className="text-4xl bg-teal-900 text-white">NO</AvatarFallback>
            </Avatar>
            <h3 className="text-4xl font-bold text-teal-400 mb-2">NADIA OUAHCHI</h3>
            <p className="text-2xl font-semibold text-white mb-4">COO</p>
            <p className="text-gray-300 text-center">{t.nadiaDesc}</p>
          </motion.div>

          {/* Zakia Fazzi */}
          <motion.div variants={item} className="flex flex-col items-center">
            <Avatar className="w-64 h-64 mb-6 border-4 border-teal-500">
              <AvatarImage src="/lovable-uploads/d9285a50-1af2-426c-bdae-f8fcb941985c.png" alt="Zakia Fazzi" className="object-cover object-[75%_25%]" />
              <AvatarFallback className="text-4xl bg-teal-900 text-white">ZF</AvatarFallback>
            </Avatar>
            <h3 className="text-4xl font-bold text-teal-400 mb-2">ZAKIA FAZZI</h3>
            <p className="text-2xl font-semibold text-white mb-4">CTO</p>
            <p className="text-gray-300 text-center">{t.zakiaDesc}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

