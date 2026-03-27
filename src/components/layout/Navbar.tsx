import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import { LoginModal } from "../LoginModal";
import { useAuth } from "@/lib/authContext";
import { SITE_CONTACT } from "@/lib/siteContact";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Hajj Packages", path: "/hajj-packages" },
  { label: "Umrah Packages", path: "/umrah-packages" },
  { label: "Visa Assistance", path: "/visa-assistance" },
  { label: "About Us", path: "/about-us" },
  { label: "Contact Us", path: "/contact-us" },
  { label: "FAQs", path: "/faqs" },
  { label: "Track Application", path: "/track-application" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl shadow-lg shadow-foreground/5 border-b border-border"
          : "bg-primary/80 backdrop-blur-md border-b border-emerald-light/10"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt={SITE_CONTACT.agencyName} className="h-12 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
          <div className="hidden sm:block">
            <h1 className={`font-display text-lg font-bold leading-tight transition-colors duration-300 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>{SITE_CONTACT.agencyShortName}</h1>
            <p className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${scrolled ? "text-accent" : "text-gold-light"}`}>{SITE_CONTACT.agencyTagline}</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                location.pathname === link.path
                  ? "text-accent"
                  : scrolled
                    ? "text-foreground hover:text-accent"
                    : "text-primary-foreground hover:text-accent"
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
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="gold"
              size="sm"
              className="gap-2"
              onClick={() => setLoginModalOpen(true)}
            >
              <LogIn className="w-4 h-4" /> Login
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
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
            className={`lg:hidden backdrop-blur-xl border-t ${scrolled ? "bg-card/98 border-border" : "bg-primary/98 border-emerald-light/10"}`}
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
                        : scrolled
                          ? "text-foreground hover:text-accent hover:bg-accent/5"
                          : "text-primary-foreground hover:text-accent hover:bg-accent/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="gold"
                  className="w-full gap-2 mt-2"
                  onClick={() => {
                    setIsOpen(false);
                    setLoginModalOpen(true);
                  }}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;
