
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock data för utvecklarexempel
const mockDevelopers = [
  {
    id: 1,
    name: "Senior Full-Stack Utvecklare",
    title: "8+ års erfarenhet",
    location: "Stockholm, Sverige",
    experience: 8,
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    rating: 4.9,
    projects: 12,
    specialty: "E-handelsplattformar",
    languages: ["Svenska", "Engelska"]
  },
  {
    id: 2,
    name: "AI/ML Specialist",
    title: "6+ års erfarenhet",
    location: "Göteborg, Sverige",
    experience: 6,
    skills: ["Python", "TensorFlow", "PyTorch", "Docker", "Kubernetes"],
    rating: 4.8,
    projects: 8,
    specialty: "Maskininlärning och AI-lösningar",
    languages: ["Svenska", "Engelska", "Mandarin"]
  },
  {
    id: 3,
    name: "Mobile App Developer",
    title: "5+ års erfarenhet",
    location: "Malmö, Sverige",
    experience: 5,
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "GraphQL"],
    rating: 4.7,
    projects: 15,
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
              {language === "sv" ? "Exempel på våra utvecklare" : 
               language === "en" ? "Examples of our developers" :
               "Exemples de nos développeurs"}
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "sv" ? "Här är några exempel på de typer av talangfulla utvecklare vi arbetar med" : 
             language === "en" ? "Here are some examples of the types of talented developers we work with" :
             "Voici quelques exemples des types de développeurs talentueux avec qui nous travaillons"}
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
