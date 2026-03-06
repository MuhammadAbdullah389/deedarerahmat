import { Phone, Mail, MapPin, Clock, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { toast } from "sonner";
import heroKaaba from "@/assets/hero-kaaba.jpg";

const contactItems = [
  { icon: Phone, label: "Phone", value: "+92 342 2356719", href: "tel:+923422356719" },
  { icon: Mail, label: "Email", value: "info@alhabibtravel.com", href: "mailto:info@alhabibtravel.com" },
  { icon: MapPin, label: "Office Address", value: "Main Bazaar, Near Jama Masjid,\nNarowal, Punjab, Pakistan" },
  { icon: Clock, label: "Office Hours", value: "Mon–Sat: 9AM – 8PM\nSun: 10AM – 4PM" },
];

const ContactUs = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={heroKaaba} alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Reach Out</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground">Contact Us</h1>
            <p className="text-primary-foreground/70 mt-4 max-w-xl mx-auto">
              We'd love to hear from you. Get in touch for any inquiries about our packages or services.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <ScrollReveal>
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">Get In Touch</h2>
                  <p className="text-muted-foreground">Visit our office or reach us through any of the channels below.</p>
                </div>
                {contactItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-4 glass-card rounded-xl p-4"
                  >
                    <div className="w-11 h-11 rounded-lg gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-accent text-xs font-medium mb-1 uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-foreground/90 hover:text-accent transition-colors whitespace-pre-line text-sm">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground/90 whitespace-pre-line text-sm">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                <a href="https://wa.me/923422356719" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="gold" size="lg" className="w-full gap-2 shadow-gold">
                    <Phone className="w-5 h-5" /> Chat on WhatsApp <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-lg h-[250px] border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27008.15730454969!2d74.86!3d32.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f29e7bce0fba3%3A0xc0e7ad7b0d3b6285!2sNarowal%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%" height="100%" style={{ border: 0 }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Location"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={0.2}>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground text-sm mb-6">Fill out the form and we'll respond within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Full Name *</Label><Input required placeholder="Your name" className="mt-1" /></div>
                    <div><Label>Phone *</Label><Input required placeholder="+92 300 1234567" className="mt-1" /></div>
                  </div>
                  <div><Label>Email *</Label><Input type="email" required placeholder="your@email.com" className="mt-1" /></div>
                  <div><Label>Subject</Label><Input placeholder="How can we help?" className="mt-1" /></div>
                  <div><Label>Message *</Label><Textarea required placeholder="Write your message..." className="mt-1 min-h-[120px]" /></div>
                  <Button type="submit" variant="gold" size="lg" className="w-full gap-2 shadow-gold">
                    <Send className="w-5 h-5" /> Send Message
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ContactUs;
