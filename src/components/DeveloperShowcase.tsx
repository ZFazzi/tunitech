
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data för utvecklarexempel
const mockDevelopers = [
  {
    id: 1,
    name: "Erik Andersson",
    title: "Senior Full-Stack Utvecklare",
    location: "Stockholm, Sverige",
    experience: 8,
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    rating: 4.9,
    projects: 12,
    image: "/lovable-uploads/3172edd2-90b1-4282-81e4-e6efcb996bd0.png",
    specialty: "E-handelsplattformar",
    languages: ["Svenska", "Engelska"]
  },
  {
    id: 2,
    name: "Sarah Chen",
    title: "AI/ML Specialist",
    location: "Göteborg, Sverige",
    experience: 6,
    skills: ["Python", "TensorFlow", "PyTorch", "Docker", "Kubernetes"],
    rating: 4.8,
    projects: 8,
    image: "/lovable-uploads/45c83552-0727-4db6-b02c-5e5fec1f7a86.png",
    specialty: "Maskininlärning och AI-lösningar",
    languages: ["Svenska", "Engelska", "Mandarin"]
  },
  {
    id: 3,
    name: "Marcus Johansson",
    title: "Mobile App Developer",
    location: "Malmö, Sverige",
    experience: 5,
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "GraphQL"],
    rating: 4.7,
    projects: 15,
    image: "/lovable-uploads/6fc4dc50-55da-428f-9e2b-d966bd20a8f4.png",
    specialty: "iOS och Android appar",
    languages: ["Svenska", "Engelska", "Danska"]
  }
];

export const DeveloperShowcase = () => {
  const { language, translations } = useLanguage();

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {language === "sv" ? "Möt våra utvecklare" : 
               language === "en" ? "Meet our developers" :
               "Rencontrez nos développeurs"}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "sv" ? "Här är några exempel på de talangfulla utvecklare vi arbetar med" : 
             language === "en" ? "Here are some examples of the talented developers we work with" :
             "Voici quelques exemples des développeurs talentueux avec qui nous travaillons"}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {mockDevelopers.map((developer) => (
            <motion.div
              key={developer.id}
              variants={itemVariants}
              className="group"
            >
              <Card className="glass-card hover:bg-white/10 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={developer.image} alt={developer.name} />
                    <AvatarFallback>{developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl text-white">{developer.name}</CardTitle>
                  <p className="text-tunitech-mint font-medium">{developer.title}</p>
                  <div className="flex items-center justify-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {developer.location}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {developer.experience} år erfarenhet
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {developer.rating}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Specialitet:</p>
                    <p className="text-white text-sm font-medium">{developer.specialty}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Tekniska färdigheter:</p>
                    <div className="flex flex-wrap gap-1">
                      {developer.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {developer.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{developer.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Språk:</p>
                    <p className="text-white text-sm">{developer.languages.join(", ")}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-sm text-gray-400">
                      {developer.projects} slutförda projekt
                    </span>
                    <div className="flex space-x-2">
                      <Github className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                      <Linkedin className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
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
