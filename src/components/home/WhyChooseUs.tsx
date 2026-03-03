import { Shield, Clock, HeadphonesIcon, Users } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const features = [
  { icon: Shield, title: "Licensed & Approved", desc: "Fully authorized by the Ministry of Religious Affairs & Saudi Consulate", stat: "100%", statLabel: "Verified" },
  { icon: Clock, title: "10+ Years Experience", desc: "A decade of excellence in serving pilgrims with trusted packages", stat: "10+", statLabel: "Years" },
  { icon: HeadphonesIcon, title: "24/7 Customer Support", desc: "Round-the-clock assistance from booking to your safe return home", stat: "24/7", statLabel: "Support" },
  { icon: Users, title: "Trusted by 1000+ Pilgrims", desc: "Families across Pakistan have chosen us for their sacred journeys", stat: "1000+", statLabel: "Pilgrims" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-secondary islamic-pattern relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full border border-accent/10" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full border border-accent/10" />

      <div className="container mx-auto px-4 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-3">Why Choose Us</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Your Trusted Travel Partner
            </h2>
            <div className="section-divider w-24 mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl p-8 text-center shadow-emerald hover:shadow-gold transition-all duration-500 group shimmer-hover border border-border"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-gold flex items-center justify-center group-hover:animate-pulse-glow transition-all shadow-gold">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-3xl font-display font-bold text-accent mb-0">{feature.stat}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">{feature.statLabel}</p>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
