import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const ContactSection = () => {
  return (
    <section className="py-20 gradient-emerald text-primary-foreground">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold-light font-medium tracking-widest uppercase text-sm mb-2">Get In Touch</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Contact Us Today</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="space-y-8">
              {[
                { icon: Phone, label: "Phone", value: "+92 300 1234567", href: "tel:+923001234567" },
                { icon: Mail, label: "Email", value: "info@alhabibtravel.com", href: "mailto:info@alhabibtravel.com" },
                { icon: MapPin, label: "Office Address", value: "Main Bazaar, Near Jama Masjid,\nNarowal, Punjab, Pakistan" },
                { icon: Clock, label: "Office Hours", value: "Mon–Sat: 9AM – 8PM\nSun: 10AM – 4PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-gold-light text-sm font-medium mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-primary-foreground/90 hover:text-accent transition-colors whitespace-pre-line">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-primary-foreground/90 whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="rounded-xl overflow-hidden shadow-lg h-[300px] md:h-full min-h-[300px]">
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
