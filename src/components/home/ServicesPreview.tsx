import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import medinaMosque from "@/assets/medina-mosque.jpg";

const services = [
  { title: "Hajj Packages", desc: "Complete Hajj packages with 5-star accommodation, guided tours, and all-inclusive services.", image: heroKaaba, link: "/hajj-packages" },
  { title: "Umrah Packages", desc: "Affordable Umrah packages throughout the year including Ramadan specials.", image: medinaMosque, link: "/umrah-packages" },
  { title: "Visa Assistance", desc: "Expert visa processing for Saudi Arabia, Turkey, Malaysia, and many more countries.", image: heroKaaba, link: "/visa-assistance" },
];

const ServicesPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-2">Our Services</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">What We Offer</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.15}>
              <div className="group rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-gold transition-all duration-500">
                <div className="h-52 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{s.desc}</p>
                  <Link to={s.link}>
                    <Button variant="outline-gold" size="sm">Learn More</Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
