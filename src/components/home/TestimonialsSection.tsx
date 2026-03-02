import { Star } from "lucide-react";
import { testimonials } from "@/data/packages";
import ScrollReveal from "@/components/animations/ScrollReveal";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-2">Testimonials</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              What Our Pilgrims Say
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-gold transition-all duration-500 relative overflow-hidden">
                {/* Decorative quote */}
                <div className="absolute top-4 right-6 text-6xl font-display text-accent/10 leading-none">"</div>
                
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-display text-base font-bold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.location}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
