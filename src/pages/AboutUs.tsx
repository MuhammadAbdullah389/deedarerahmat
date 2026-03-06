import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Star, Shield, Users, Award, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";
import heroKaaba from "@/assets/hero-kaaba.jpg";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "1000+", label: "Happy Pilgrims" },
  { value: "50+", label: "Hajj Groups" },
  { value: "100%", label: "Satisfaction Rate" },
];

const values = [
  { icon: Shield, title: "Trust & Reliability", desc: "Licensed and government-approved agency ensuring your peace of mind throughout your sacred journey." },
  { icon: Heart, title: "Dedication & Care", desc: "We treat every pilgrim like family, providing personalized attention and round-the-clock support." },
  { icon: Award, title: "Premium Quality", desc: "Top-rated hotels near Haram, comfortable transport, and quality meals — no compromises." },
  { icon: Globe, title: "Expert Guidance", desc: "Our experienced scholars and guides ensure a spiritually enriching and hassle-free experience." },
  { icon: Users, title: "Community Focused", desc: "Proudly serving pilgrims from Narowal and across Pakistan with deep community roots." },
  { icon: Star, title: "Highly Rated", desc: "Consistently rated 5 stars by our pilgrims for exceptional service and organization." },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={heroKaaba} alt="About Us" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Our Story</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground">About Al-Habib</h1>
            <p className="text-primary-foreground/70 mt-4 max-w-xl mx-auto">
              Serving pilgrims with dedication, trust, and excellence since 2010.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-8 md:p-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">Our Journey Since 2010</h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  <strong className="text-foreground">Alhabib Travel & Tours</strong> was founded in 2010 with a simple mission — to make the sacred journey of Hajj and Umrah accessible, comfortable, and spiritually enriching for every Muslim in Pakistan.
                </p>
                <p>
                  Based in <strong className="text-foreground">Narowal, Punjab</strong>, we have grown from a small local agency to one of the most trusted names in religious travel. Over the past 15 years, we have successfully guided over <strong className="text-accent">1,000+ pilgrims</strong> to the holy cities of Makkah and Madinah.
                </p>
                <p>
                  Our packages are carefully designed to provide the best hotels near Haram, comfortable transportation, delicious meals, and complete guided Ziarat — all at competitive prices. We also provide comprehensive visa assistance for Saudi Arabia, UAE, Turkey, Malaysia, and other countries.
                </p>
                <p>
                  What sets us apart is our personal touch. Our founder and team personally accompany groups, ensuring every pilgrim feels safe, guided, and spiritually fulfilled. We conduct pre-Hajj training sessions, provide 24/7 support during the journey, and maintain close relationships with our pilgrims long after they return.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 gradient-emerald">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.05 }} className="text-center glass-dark rounded-2xl p-6">
                  <p className="text-3xl md:text-4xl font-display font-bold text-accent mb-2">{s.value}</p>
                  <p className="text-primary-foreground/70 text-sm">{s.label}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-3">Why Choose Us</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Our Core Values</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="glass-card rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                    <v.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AboutUs;
