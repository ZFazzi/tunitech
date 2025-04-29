
import { Code, Server, Smartphone, Workflow, BrainCircuit, Palette, Database, Shield, Globe } from "lucide-react";
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
    title: "Frontend-utvecklare",
    description: "Expertutvedklare specialiserade på React, Angular, Vue och moderna webbtekniker.",
  },
  {
    icon: BrainCircuit,
    title: "AI-experter",
    description: "Specialister inom maskininlärning, naturlig språkbehandling och AI-lösningar.",
  },
  {
    icon: Server,
    title: "Backend-utvecklare",
    description: "Erfarna ingenjörer som bygger robusta och skalbara serverapplikationer.",
  },
  {
    icon: Palette,
    title: "UI/UX-designers",
    description: "Kreativa designers som skapar vackra och intuitiva användargränssnitt och upplevelser.",
  },
  {
    icon: Database,
    title: "Databasspecialister",
    description: "Experter på SQL, NoSQL, datamodellering och databasoptimering.",
  },
  {
    icon: Workflow,
    title: "DevOps-ingenjörer",
    description: "Specialister på CI/CD-pipelines, infrastruktur som kod och molntjänster.",
  },
  {
    icon: Shield,
    title: "Säkerhetsexperter",
    description: "Yrkesverksamma som säkerställer att applikationer är säkra och skyddade mot hot.",
  },
  {
    icon: Globe,
    title: "Fullstack-utvecklare",
    description: "Mångsidiga utvecklare som behärskar både frontend- och backendtekniker.",
  },
  {
    icon: Smartphone,
    title: "Mobilutvecklare",
    description: "Specialister på native och plattformsoberoende mobilapputveckling.",
  },
];

export const Services = () => {
  const [api, setApi] = useState<any>(null);
  const { language } = useLanguage();
  
  return (
    <section id="services" className="section-padding bg-gradient-to-b from-tunitech-dark to-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Våra Talanger</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vi erbjuder talanger efter era önskemål inom alla IT-områden
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
            <CarouselContent className="-ml-4">
              {services.map((service, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 h-full group hover:bg-white/10 transition-all duration-300 mr-4"
                  >
                    <service.icon className="w-12 h-12 text-tunitech-mint mb-4 group-hover:text-tunitech-blue transition-colors duration-300" />
                    <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 hover:bg-white/10 text-white h-12 w-12 rounded-full" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-white/20 hover:bg-white/10 text-white h-12 w-12 rounded-full" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
