
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
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
          <div className="mb-8 md:mb-0 space-y-2">
            {/* Logo */}
            <div className="space-y-4">
              <img 
                src="/lovable-uploads/45c83552-0727-4db6-b02c-5e5fec1f7a86.png" 
                alt="TuniTech Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <MapPin size={20} className="mr-2 text-blue-400" />
                <span className="text-gray-300">{t.location}</span>
              </div>
              
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {t.contactUs}
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            {/* Menu */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t.menu}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200">{t.aboutUs}</Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-200">{t.ourTalents}</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200">{t.pricing}</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">{t.contact}</Link>
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
