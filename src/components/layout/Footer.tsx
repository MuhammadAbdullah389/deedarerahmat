import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-accent/5" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="Alhabib Travel" className="h-16 w-auto mb-4" />
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4">
              Your trusted partner for Hajj, Umrah, and visa services. Serving pilgrims from Narowal and across Pakistan with dedication and care.
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
              ))}
              <span className="text-xs text-primary-foreground/50 ml-2">Rated 5/5</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent font-display text-lg mb-5">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Hajj Packages", path: "/hajj-packages" },
                { label: "Umrah Packages", path: "/umrah-packages" },
                { label: "Visa Assistance", path: "/visa-assistance" },
                { label: "Submit Testimonial", path: "/submit-testimonial" },
                { label: "FAQs", path: "/faqs" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-primary-foreground/60 hover:text-accent text-sm transition-colors hover:translate-x-1 transform duration-200 inline-flex items-center gap-1">
                  <span className="text-accent/50">›</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-accent font-display text-lg mb-5">Contact Us</h3>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <a href="tel:+923001234567" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent/70" /> +92 300 1234567
              </a>
              <a href="mailto:info@alhabibtravel.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent/70" /> info@alhabibtravel.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent/70 mt-0.5 shrink-0" />
                <span>Main Bazaar, Narowal, Punjab, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-accent font-display text-lg mb-5">Office Hours</h3>
            <div className="text-sm text-primary-foreground/60 space-y-3">
              <div className="glass-dark rounded-lg p-3">
                <p className="text-xs uppercase tracking-wider text-gold-light/60 mb-1">Monday – Saturday</p>
                <p className="text-accent font-medium">9:00 AM – 8:00 PM</p>
              </div>
              <div className="glass-dark rounded-lg p-3">
                <p className="text-xs uppercase tracking-wider text-gold-light/60 mb-1">Sunday</p>
                <p className="text-accent font-medium">10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-light/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
          <p>© {new Date().getFullYear()} Alhabib Travel & Tours. All rights reserved.</p>
          <p className="font-arabic text-sm text-accent/40">الحبيب ٹریولز اینڈ ٹورز</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
