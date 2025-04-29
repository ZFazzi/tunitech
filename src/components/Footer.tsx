
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-black text-white py-12 px-6 md:px-8 lg:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-5 text-tunitech-mint">Kontaktinfo</h3>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-tunitech-mint" />
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-tunitech-mint" />
              <p className="text-gray-300">hello@tunitech.se</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-tunitech-mint" />
              <p className="text-gray-300">Stockholm, Sverige</p>
            </div>
          </motion.div>
          
          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-5 text-tunitech-mint">Meny</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white hover:underline transition-colors">{t.aboutUs}</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white hover:underline transition-colors">{t.ourTalents}</a></li>
              <li><a href="#values" className="text-gray-300 hover:text-white hover:underline transition-colors">{t.career}</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white hover:underline transition-colors">{t.contact}</a></li>
            </ul>
          </motion.div>
          
          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-5 text-tunitech-mint">Sociala medier</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Copyright Section */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TuniTech. Alla rättigheter reserverade.</p>
        </div>
      </div>
    </footer>
  );
};
