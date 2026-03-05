import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, Star } from "lucide-react";
import heroImage from "@/assets/hero-kaaba.jpg";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";
import visaImage from "@/assets/visa-assistance.jpg";

const heroSlides = [
  { image: heroImage, alt: "Masjid al-Haram - Kaaba" },
  { image: masjidNabawi, alt: "Masjid an-Nabawi - Medina" },
  { image: visaImage, alt: "Visa & Passport Services" },
];

const floatingStars = [
  { top: "15%", left: "10%", delay: 0, size: 3 },
  { top: "25%", left: "85%", delay: 1.2, size: 4 },
  { top: "60%", left: "5%", delay: 0.6, size: 3 },
  { top: "70%", left: "90%", delay: 2, size: 5 },
  { top: "40%", left: "15%", delay: 1.5, size: 3 },
  { top: "20%", left: "70%", delay: 0.8, size: 4 },
  { top: "80%", left: "75%", delay: 1.8, size: 3 },
  { top: "35%", left: "92%", delay: 0.3, size: 4 },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 gradient-hero" />

      {/* Floating star particles */}
      {floatingStars.map((star, i) => (
        <motion.div
          key={i}
          className="star-particle hidden md:block"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Decorative top border */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-arabic text-gold-light tracking-[0.2em] text-xl md:text-2xl mb-2">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <div className="ornament-line text-accent/60 mb-6">
            <Star className="w-3 h-3 fill-accent text-accent" />
          </div>
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
          className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
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
            <Button variant="gold" size="lg" className="text-base px-8 shadow-gold">
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

        {/* Slide indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 flex items-center justify-center gap-2"
        >
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentSlide === i ? "w-8 bg-accent" : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex items-center justify-center gap-6 flex-wrap"
        >
          {["Licensed & Approved", "10+ Years Experience", "1000+ Happy Pilgrims"].map((badge) => (
            <span key={badge} className="glass-dark px-4 py-2 rounded-full text-xs text-primary-foreground/80 font-medium tracking-wide">
              ✦ {badge}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-gold-light/40 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="w-6 h-6 text-gold-light/50" />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
