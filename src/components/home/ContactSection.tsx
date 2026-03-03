import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

const contactItems = [
  { icon: Phone, label: "Phone", value: "+92 300 1234567", href: "tel:+923001234567" },
  { icon: Mail, label: "Email", value: "info@alhabibtravel.com", href: "mailto:info@alhabibtravel.com" },
  { icon: MapPin, label: "Office Address", value: "Main Bazaar, Near Jama Masjid,\nNarowal, Punjab, Pakistan" },
  { icon: Clock, label: "Office Hours", value: "Mon–Sat: 9AM – 8PM\nSun: 10AM – 4PM" },
];

const ContactSection = () => {
  return (
    <section className="py-24 gradient-emerald text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full border border-accent/10" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full border border-accent/10" />

      <div className="container mx-auto px-4 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold-light font-medium tracking-widest uppercase text-sm mb-3">Get In Touch</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Contact Us Today</h2>
            <div className="h-[2px] w-24 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              {contactItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-4 glass-dark rounded-xl p-4"
                >
                  <div className="w-11 h-11 rounded-lg gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-gold-light text-xs font-medium mb-1 uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-primary-foreground/90 hover:text-accent transition-colors whitespace-pre-line text-sm">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-primary-foreground/90 whitespace-pre-line text-sm">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="gold" size="lg" className="w-full gap-2 mt-2 shadow-gold">
                  <Phone className="w-5 h-5" /> Chat on WhatsApp <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px] md:h-full min-h-[350px] border border-accent/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27008.15730454969!2d74.86!3d32.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f29e7bce0fba3%3A0xc0e7ad7b0d3b6285!2sNarowal%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Alhabib Travel & Tours Location"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
