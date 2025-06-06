import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, translations } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = translations[language];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-tunitech-dark/95 backdrop-blur-lg shadow-xl border-b border-white/10" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - positioned to the left and made larger */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/36dd338f-a61a-41d1-ad24-3126f66bd23b.png"
                alt="Tunitech Logo"
                className="h-14 md:h-18 hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
          </div>

          {/* Desktop menu - centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-2 px-6 py-3 rounded-full bg-tunitech-dark/80 backdrop-blur-md border border-white/20 shadow-lg">
              <NavLink to="/about">{t.aboutUs}</NavLink>
              <NavLink to="/services">{t.ourTalents}</NavLink>
              <NavLink to="/contact">{t.contact}</NavLink>
              
              {/* Language dropdown integrated within the menu bar */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full flex items-center gap-2">
                  <Globe size={16} />
                  <span className="text-sm">{language.toUpperCase()}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-tunitech-dark/95 backdrop-blur-md border border-white/10 text-white">
                  <DropdownMenuItem 
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                    onClick={() => setLanguage("sv")}
                  >
                    {t.swedish}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                    onClick={() => setLanguage("en")}
                  >
                    {t.english}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                    onClick={() => setLanguage("fr")}
                  >
                    {t.french}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center">
            <Button 
              asChild 
              variant="outline" 
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/auth">
                {language === 'sv' ? 'Logga in' : language === 'fr' ? 'Se connecter' : 'Login'}
              </Link>
            </Button>
          </div>
          
          {/* Mobile language selector and menu - placed to the right */}
          <div className="md:hidden flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-300 hover:text-white p-2 bg-tunitech-dark/90 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                <Globe size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-tunitech-dark/95 backdrop-blur-md border border-white/10 text-white">
                <DropdownMenuItem 
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                  onClick={() => setLanguage("sv")}
                >
                  {t.swedish}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                  onClick={() => setLanguage("en")}
                >
                  {t.english}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer" 
                  onClick={() => setLanguage("fr")}
                >
                  {t.french}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 bg-tunitech-dark/90 backdrop-blur-md rounded-full border border-white/20"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 pointer-events-none"}`}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-tunitech-dark/95 backdrop-blur-lg border-t border-white/10">
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>{t.aboutUs}</MobileNavLink>
          <MobileNavLink to="/services" onClick={() => setIsOpen(false)}>{t.ourTalents}</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>{t.contact}</MobileNavLink>
          <MobileNavLink to="/auth" onClick={() => setIsOpen(false)}>
            {language === 'sv' ? 'Logga in' : language === 'fr' ? 'Se connecter' : 'Login'}
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-300 hover:text-white hover:bg-white/10 block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg"
  >
    {children}
  </Link>
);
