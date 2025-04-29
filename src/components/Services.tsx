
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

const services = [
  {
    icon: Code,
    title: "Frontend Developer",
    description: "Expert developers specializing in React, Angular, Vue, and modern web technologies.",
  },
  {
    icon: BrainCircuit,
    title: "AI Experts",
    description: "Specialists in machine learning, natural language processing, and AI solutions.",
  },
  {
    icon: Server,
    title: "Backend Developers",
    description: "Experienced engineers building robust and scalable server-side applications.",
  },
  {
    icon: Palette,
    title: "UI/UX Designers",
    description: "Creative designers crafting beautiful and intuitive user interfaces and experiences.",
  },
  {
    icon: Database,
    title: "Database Specialists",
    description: "Experts in SQL, NoSQL, data modeling and database optimization.",
  },
  {
    icon: Workflow,
    title: "DevOps Engineers",
    description: "Specialists in CI/CD pipelines, infrastructure as code, and cloud services.",
  },
  {
    icon: Shield,
    title: "Security Experts",
    description: "Professionals ensuring applications are secure and protected from threats.",
  },
  {
    icon: Globe,
    title: "Full-Stack Developers",
    description: "Versatile developers comfortable with both frontend and backend technologies.",
  },
  {
    icon: Smartphone,
    title: "Mobile Developers",
    description: "Specialists in native and cross-platform mobile app development.",
  },
];

export const Services = () => {
  const [api, setApi] = useState<any>(null);
  
  return (
    <section id="services" className="section-padding bg-gradient-to-b from-tunitech-dark to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Talents</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vi erbjuder talanger efter era önskemål inom alla IT-områden
          </p>
        </div>

        <div className="relative px-4 md:px-8 lg:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: false,
              skipSnaps: false,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="-ml-4">
              {services.map((service, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/3 2xl:basis-1/4"
                  style={{ paddingRight: "12px" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 h-full group hover:bg-white/10 transition-all duration-300"
                  >
                    <service.icon className="w-12 h-12 text-tunitech-mint mb-4 group-hover:text-tunitech-blue transition-colors duration-300" />
                    <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <CarouselPrevious className="bg-black/50 border-white/20 hover:bg-white/10 text-white h-10 w-10">
                <span className="text-xl font-bold">&lt;</span>
              </CarouselPrevious>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext className="bg-black/50 border-white/20 hover:bg-white/10 text-white h-10 w-10">
                <span className="text-xl font-bold">&gt;</span>
              </CarouselNext>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
