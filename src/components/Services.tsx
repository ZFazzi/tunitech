
import { Code, Server, Smartphone, Workflow, BrainCircuit, Palette, Database, Shield, Globe, Gamepad, AppWindow, Bug, Users } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const services = [
  {
    icon: Code,
    title: "Frontend Developers",
    translationKey: "frontendDevelopers",
  },
  {
    icon: BrainCircuit,
    title: "AI Experts",
    translationKey: "aiExperts",
  },
  {
    icon: Server,
    title: "Backend Developers",
    translationKey: "backendDevelopers",
  },
  {
    icon: Palette,
    title: "UI/UX Designers",
    translationKey: "uiUxDesigners",
  },
  {
    icon: Database,
    title: "Database Specialists",
    translationKey: "databaseSpecialists",
  },
  {
    icon: Workflow,
    title: "DevOps Engineers",
    translationKey: "devOpsEngineers",
  },
  {
    icon: Shield,
    title: "Security Experts",
    translationKey: "securityExperts",
  },
  {
    icon: Globe,
    title: "Full-Stack Developers",
    translationKey: "fullStackDevelopers",
  },
  {
    icon: Smartphone,
    title: "Mobile Developers",
    translationKey: "mobileDevelopers",
  },
  {
    icon: Gamepad,
    title: "Game Developers",
    translationKey: "gameDevelopers",
  },
  {
    icon: AppWindow,
    title: "Web Designers",
    translationKey: "webDesigners",
  },
  {
    icon: Bug,
    title: "Automation Testers",
    translationKey: "automationTesters",
  },
  {
    icon: Users,
    title: "Scrum Masters",
    translationKey: "scrumMasters",
  },
  {
    icon: AppWindow,
    title: "App Developers",
    translationKey: "appDevelopers",
  },
];

// Animation variants with synchronized timing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const Services = () => {
  const [api, setApi] = useState<any>(null);
  const { language, translations } = useLanguage();
  
  return (
    <section id="services" className="section-padding bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
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
              {translations[language].ourTalents}
            </span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "sv" ? "Vi erbjuder talanger efter era önskemål inom alla IT-områden" : 
             language === "en" ? "We offer talents according to your needs in all IT areas" :
             "Nous offrons des talents selon vos besoins dans tous les domaines informatiques"}
          </p>
        </div>

        <div className="max-w-7xl mx-auto overflow-hidden relative">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              containScroll: "trimSnaps",
            }}
            className="w-full"
            setApi={setApi}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {services.map((service, index) => {
                  // Get the correct title based on language
                  const serviceTitle = language === "sv" ? 
                    translations.sv[service.translationKey + "Title"] : 
                    language === "en" ? 
                    translations.en[service.translationKey + "Title"] :
                    translations.fr[service.translationKey + "Title"];
                  
                  return (
                    <CarouselItem 
                      key={index} 
                      className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
                    >
                      <motion.div
                        variants={itemVariants}
                        custom={index}
                        className="glass-card p-6 h-full group hover:bg-white/10 transition-all duration-300 mr-4"
                      >
                        <service.icon className="w-12 h-12 text-tunitech-mint mb-4 group-hover:text-tunitech-blue transition-colors duration-300" />
                        <h3 className="text-xl font-semibold text-white mb-2">{serviceTitle}</h3>
                        <p className="text-gray-400">{translations[language][service.translationKey]}</p>
                      </motion.div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </motion.div>
            
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 border-white/20 hover:bg-white/10 text-white h-12 w-12 rounded-full" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 border-white/20 hover:bg-white/10 text-white h-12 w-12 rounded-full" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
