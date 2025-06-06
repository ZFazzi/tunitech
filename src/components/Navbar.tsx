
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-tunitech-dark/90 backdrop-blur-lg shadow-lg" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - positioned to the left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/36dd338f-a61a-41d1-ad24-3126f66bd23b.png"
                alt="Tunitech Logo"
                className="h-8 md:h-10 hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
          </div>

          {/* Desktop menu - centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-4 px-8 py-2 rounded-full bg-tunitech-dark/70 backdrop-blur-md border border-white/10 shadow-md">
              <NavLink to="/about">{t.aboutUs}</NavLink>
              <NavLink to="/services">{t.ourTalents}</NavLink>
              <NavLink to="/contact">{t.contact}</NavLink>
              
              {/* Language dropdown integrated within the menu bar */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-300 hover:text-white hover:bg-white/10 px-5 py-2 text-sm font-medium transition-colors duration-200 rounded-full flex items-center gap-2">
                  <Globe size={18} />
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
          
          {/* Mobile language selector - placed to the right */}
          <div className="md:hidden flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-300 hover:text-white p-2 bg-tunitech-dark/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
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
              className="text-gray-300 hover:text-white p-2 bg-tunitech-dark/80 backdrop-blur-md rounded-full border border-white/10"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-tunitech-dark/95 backdrop-blur-lg border-t border-white/10">
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>{t.aboutUs}</MobileNavLink>
          <MobileNavLink to="/services" onClick={() => setIsOpen(false)}>{t.ourTalents}</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>{t.contact}</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-white hover:bg-white/10 px-5 py-2 text-sm font-medium transition-colors duration-200 rounded-full"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-lg"
  >
    {children}
  </Link>
);
