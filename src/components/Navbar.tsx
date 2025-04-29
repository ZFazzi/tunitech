
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-tunitech-dark/90 backdrop-blur-lg shadow-lg" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full flex justify-center h-16">
          {/* Desktop menu - centered */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center space-x-4 px-8 py-2 rounded-full bg-tunitech-dark/70 backdrop-blur-md border border-white/10 shadow-md">
              <NavLink href="#home">Om oss</NavLink>
              <NavLink href="#services">Våra talanger</NavLink>
              <NavLink href="#values">Karriär</NavLink>
              <NavLink href="#contact">Kontakt</NavLink>
            </div>
          </div>
          
          {/* Mobile menu button - positioned absolutely */}
          <div className="md:hidden absolute right-4 top-4">
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
          <MobileNavLink href="#home" onClick={() => setIsOpen(false)}>Om oss</MobileNavLink>
          <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Våra talanger</MobileNavLink>
          <MobileNavLink href="#values" onClick={() => setIsOpen(false)}>Karriär</MobileNavLink>
          <MobileNavLink href="#contact" onClick={() => setIsOpen(false)}>Kontakt</MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-gray-300 hover:text-white hover:bg-white/10 px-5 py-2 text-sm font-medium transition-colors duration-200 rounded-full"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-lg"
  >
    {children}
  </a>
);
