import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "@/data/packages";
import ScrollReveal from "@/components/animations/ScrollReveal";

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-3">Testimonials</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Our Pilgrims Say
            </h2>
            <div className="section-divider w-24 mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-gold transition-all duration-500 relative overflow-hidden group"
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-[40px]" />
                
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center mb-5 shadow-gold group-hover:animate-pulse-glow transition-all">
                  <Quote className="w-5 h-5 text-primary-foreground" />
                </div>
                
                <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-base font-bold text-foreground">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
