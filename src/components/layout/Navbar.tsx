import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-primary/98 backdrop-blur-xl shadow-lg shadow-emerald-dark/20 border-b border-emerald-light/10"
          : "bg-primary/80 backdrop-blur-md border-b border-emerald-light/10"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Alhabib Travel & Tours" className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
          <div className="hidden sm:block">
            <h1 className="text-primary-foreground font-display text-lg font-bold leading-tight">Alhabib</h1>
            <p className="text-gold-light text-[10px] tracking-[0.3em] uppercase">Travel & Tours</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                location.pathname === link.path
                  ? "text-accent"
                  : "text-primary-foreground/80 hover:text-accent"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 gradient-gold rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
            <Button variant="gold" size="sm" className="gap-2 shadow-gold">
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
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary/98 backdrop-blur-xl border-t border-emerald-light/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-sm font-medium py-3 px-3 rounded-lg transition-all ${
                      location.pathname === link.path
                        ? "text-accent bg-accent/10"
                        : "text-primary-foreground/80 hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                <Button variant="gold" className="w-full gap-2 mt-3 shadow-gold">
                  <Phone className="w-4 h-4" /> Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
