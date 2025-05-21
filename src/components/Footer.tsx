
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from "lucide-react";

export const Footer = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  const currentYear = new Date().getFullYear();
  const copyright = t.copyright.replace("{year}", currentYear.toString());

  return (
    <footer className="bg-tunitech-dark/90 backdrop-blur-lg border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          {/* Logo and Contact */}
          <div className="mb-8 md:mb-0 space-y-6">
            {/* Logo */}
            <div className="flex items-center">
              <span className="font-bold text-white text-2xl">Tuni<span className="text-blue-400">Tech</span></span>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin size={20} className="mr-2 text-blue-400" />
                <span className="text-gray-300">{t.location}</span>
              </div>
              
              <a 
                href="#contact"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {t.contactUs}
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            {/* Menu */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t.menu}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-300 hover:text-white transition-colors duration-200">{t.aboutUs}</a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-white transition-colors duration-200">{t.ourTalents}</a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200">{t.pricing}</a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">{t.contact}</a>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t.socialMedia}</h3>
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <Facebook size={20} />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <Twitter size={20} />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <Instagram size={20} />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                    <Linkedin size={20} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400 text-center">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
