import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Moon, FileText } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";
import visaImage from "@/assets/visa-assistance.jpg";

const services = [
  { title: "Hajj Packages", desc: "Complete Hajj packages with 5-star accommodation, guided tours, and all-inclusive services for the journey of a lifetime.", image: heroKaaba, link: "/hajj-packages", icon: Moon },
  { title: "Umrah Packages", desc: "Affordable Umrah packages throughout the year including special Ramadan offerings for a blessed experience.", image: masjidNabawi, link: "/umrah-packages", icon: Plane },
  { title: "Visa Assistance", desc: "Expert visa processing for Saudi Arabia, Turkey, Malaysia, and many more countries with hassle-free documentation.", image: visaImage, link: "/visa-assistance", icon: FileText },
];

const ServicesPreview = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-3">Our Services</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">What We Offer</h2>
            <div className="section-divider w-24 mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="group rounded-2xl overflow-hidden glass-card shimmer-hover hover:shadow-gold transition-all duration-500"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-gold">
                    <s.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{s.desc}</p>
                  <Link to={s.link}>
                    <Button variant="outline-gold" size="sm" className="gap-2 group/btn">
                      Learn More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
