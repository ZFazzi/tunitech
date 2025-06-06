
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data för kundrecensioner
const testimonials = [
  {
    id: 1,
    name: "Anna Lindström",
    company: "TechStart AB",
    role: "VD",
    avatar: "/lovable-uploads/9e74fbfb-e487-4cc3-a2e1-827bc6ac79de.png",
    rating: 5,
    text: "TuniTech hjälpte oss hitta den perfekta full-stack utvecklaren för vårt e-handelsprojekt. Processen var smidig och utvecklaren de matchade oss med hade exakt den expertis vi behövde.",
    project: "E-handelsplattform",
    duration: "3 månader"
  },
  {
    id: 2,
    name: "David Chen",
    company: "InnovateLab",
    role: "CTO",
    avatar: "/lovable-uploads/d0c39a01-0fd1-4def-a437-d7d7fb59e2b3.png",
    rating: 5,
    text: "Som startup behövde vi en AI-specialist snabbt. TuniTech levererade en fantastisk utvecklare som inte bara hade teknisk kompetens utan också förstod våra affärsbehov.",
    project: "AI-baserad analysplattform",
    duration: "6 månader"
  },
  {
    id: 3,
    name: "Maria Johansson",
    company: "HealthTech Solutions",
    role: "Produktchef",
    avatar: "/lovable-uploads/36dd338f-a61a-41d1-ad24-3126f66bd23b.png",
    rating: 5,
    text: "TuniTech förstod våra specifika krav inom hälso-tech och matchade oss med en utvecklare som hade tidigare erfarenhet av medicinska applikationer. Resultatet blev över förväntan.",
    project: "Mobil hälsoapp",
    duration: "4 månader"
  }
];

// Utvecklarrecensioner
const developerTestimonials = [
  {
    id: 1,
    name: "Erik Svensson",
    role: "Senior React Developer",
    avatar: "/lovable-uploads/3172edd2-90b1-4282-81e4-e6efcb996bd0.png",
    rating: 5,
    text: "TuniTech har hjälpt mig hitta spännande projekt som matchar mina färdigheter perfekt. Deras team förstår både tekniska krav och projektdynamik.",
    experience: "8 års erfarenhet"
  },
  {
    id: 2,
    name: "Sarah Nilsson",
    role: "UX/UI Designer",
    avatar: "/lovable-uploads/45c83552-0727-4db6-b02c-5e5fec1f7a86.png",
    rating: 5,
    text: "Som frilansare uppskattar jag TuniTechs professionella approach. De matchar mig med kunder som verkligen värdesätter design och användarupplevelse.",
    experience: "6 års erfarenhet"
  }
];

export const TestimonialsSection = () => {
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        {/* Kundrecensioner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {language === "sv" ? "Vad våra kunder säger" : 
               language === "en" ? "What our clients say" :
               "Ce que disent nos clients"}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "sv" ? "Läs om hur TuniTech har hjälpt företag hitta rätt utvecklare för sina projekt" : 
             language === "en" ? "Read about how TuniTech has helped companies find the right developers for their projects" :
             "Découvrez comment TuniTech a aidé les entreprises à trouver les bons développeurs pour leurs projets"}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="group"
            >
              <Card className="glass-card hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-tunitech-mint mr-3" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-3">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        <p className="text-tunitech-mint text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Projekt:</span>
                      <span className="text-white">{testimonial.project}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Varaktighet:</span>
                      <span className="text-white">{testimonial.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Utvecklarrecensioner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {language === "sv" ? "Vad våra utvecklare säger" : 
               language === "en" ? "What our developers say" :
               "Ce que disent nos développeurs"}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "sv" ? "Hör från utvecklare som har hittat spännande projekt genom TuniTech" : 
             language === "en" ? "Hear from developers who have found exciting projects through TuniTech" :
             "Écoutez les développeurs qui ont trouvé des projets passionnants grâce à TuniTech"}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {developerTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="group"
            >
              <Card className="glass-card hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-tunitech-mint mr-3" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-3">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        <p className="text-tunitech-mint text-sm">{testimonial.experience}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
