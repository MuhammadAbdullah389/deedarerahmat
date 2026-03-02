import { Shield, Clock, HeadphonesIcon, Users } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const features = [
  { icon: Shield, title: "Licensed & Approved", desc: "Fully authorized by the Ministry of Religious Affairs & Saudi Consulate" },
  { icon: Clock, title: "10+ Years Experience", desc: "A decade of excellence in serving pilgrims with trusted packages" },
  { icon: HeadphonesIcon, title: "24/7 Customer Support", desc: "Round-the-clock assistance from booking to your safe return home" },
  { icon: Users, title: "Trusted by 1000+ Pilgrims", desc: "Families across Pakistan have chosen us for their sacred journeys" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-secondary islamic-pattern">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-2">Why Choose Us</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Your Trusted Travel Partner
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div className="bg-card rounded-xl p-8 text-center shadow-emerald hover:shadow-gold transition-shadow duration-500 group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center group-hover:animate-pulse-glow transition-all">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
