import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
import heroImage from "@/assets/hero-kaaba.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Masjid al-Haram" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gold-light tracking-[0.3em] uppercase text-sm md:text-base mb-4 font-medium">
            بسم اللہ الرحمن الرحیم
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground font-bold leading-tight mb-6"
        >
          Your Journey to the
          <br />
          <span className="text-gradient-gold">Holy Land</span> Begins Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Trusted Hajj & Umrah packages from Narowal. Experience a spiritually fulfilling pilgrimage with our expert guidance and premium services.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/hajj-packages">
            <Button variant="gold" size="lg" className="text-base px-8">
              Explore Hajj Packages
            </Button>
          </Link>
          <Link to="/umrah-packages">
            <Button variant="outline-gold" size="lg" className="text-base px-8 border-accent text-primary-foreground">
              View Umrah Packages
            </Button>
          </Link>
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg" className="text-base px-8 gap-2">
              <Phone className="w-5 h-5" /> WhatsApp Us
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-gold-light/60" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
