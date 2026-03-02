import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Hajj Packages", path: "/hajj-packages" },
  { label: "Umrah Packages", path: "/umrah-packages" },
  { label: "Visa Assistance", path: "/visa-assistance" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-emerald-light/20">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Alhabib Travel & Tours" className="h-12 md:h-14 w-auto" />
          <div className="hidden sm:block">
            <h1 className="text-primary-foreground font-display text-lg font-bold leading-tight">Alhabib</h1>
            <p className="text-gold-light text-xs tracking-widest uppercase">Travel & Tours</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-accent"
                  : "text-primary-foreground/80 hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
            <Button variant="gold" size="sm" className="gap-2">
              <Phone className="w-4 h-4" /> Contact Us
            </Button>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-foreground p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary border-t border-emerald-light/20"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    location.pathname === link.path
                      ? "text-accent"
                      : "text-primary-foreground/80 hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                <Button variant="gold" className="w-full gap-2 mt-2">
                  <Phone className="w-4 h-4" /> Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
