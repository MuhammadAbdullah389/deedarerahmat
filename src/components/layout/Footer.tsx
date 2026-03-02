import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="Alhabib Travel" className="h-16 w-auto mb-4" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner for Hajj, Umrah, and visa services. Serving pilgrims from Narowal and across Pakistan with dedication and care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent font-display text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Hajj Packages", path: "/hajj-packages" },
                { label: "Umrah Packages", path: "/umrah-packages" },
                { label: "Visa Assistance", path: "/visa-assistance" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-accent font-display text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <a href="tel:+923001234567" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent" /> +92 300 1234567
              </a>
              <a href="mailto:info@alhabibtravel.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4 text-accent" /> info@alhabibtravel.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Main Bazaar, Narowal, Punjab, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-accent font-display text-lg mb-4">Office Hours</h3>
            <div className="text-sm text-primary-foreground/70 space-y-1">
              <p>Monday – Saturday</p>
              <p className="text-accent font-medium">9:00 AM – 8:00 PM</p>
              <p className="mt-3">Sunday</p>
              <p className="text-accent font-medium">10:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-light/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Alhabib Travel & Tours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
