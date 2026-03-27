import { Phone, Mail, MapPin, Clock, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
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
import { SITE_CONTACT } from "@/lib/siteContact";

const contactItems = [
  { icon: Phone, label: "Phone (M. Owais Azhar)", value: SITE_CONTACT.primaryPhoneDisplay, href: `tel:${SITE_CONTACT.primaryPhoneDial}` },
  { icon: Phone, label: "Phone (M. Farooq)", value: SITE_CONTACT.secondaryPhoneDisplay, href: `tel:${SITE_CONTACT.secondaryPhoneDial}` },
  { icon: Mail, label: "Email", value: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}` },
  { icon: MapPin, label: "Office Address", value: SITE_CONTACT.officeAddressMultiline },
  { icon: Clock, label: "Office Hours", value: "Mon–Sat: 9AM – 8PM\nSun: 10AM – 4PM" },
];

const adminWhatsAppNumber = SITE_CONTACT.whatsappNumber;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    const message = [
      "Assalam o Alaikum!",
      "",
      "A new contact inquiry has been submitted:",
      "",
      `Name: ${formData.fullName}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `Subject: ${formData.subject || 'General Inquiry'}`,
      "",
      "Message:",
      formData.message,
    ].join("\n");

    window.open(`https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`, "_blank");
    toast.success("WhatsApp opened with your message.");
    setFormData({ fullName: "", phone: "", email: "", subject: "", message: "" });
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

                <a href={`https://wa.me/${SITE_CONTACT.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="gold" size="lg" className="w-full gap-2 shadow-gold">
                    <Phone className="w-5 h-5" /> Chat on WhatsApp <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-lg h-[250px] border border-border">
                  <iframe
                    src={SITE_CONTACT.mapEmbedUrl}
                    width="100%" height="100%" style={{ border: 0 }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title={`${SITE_CONTACT.agencyName} Location`}
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
                    <div><Label>Full Name *</Label><Input required placeholder="Your name" className="mt-1" value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} /></div>
                    <div><Label>Phone *</Label><Input required placeholder="+92 300 1234567" className="mt-1" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} /></div>
                  </div>
                  <div><Label>Email *</Label><Input type="email" required placeholder="your@email.com" className="mt-1" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} /></div>
                  <div><Label>Subject</Label><Input placeholder="How can we help?" className="mt-1" value={formData.subject} onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))} /></div>
                  <div><Label>Message *</Label><Textarea required placeholder="Write your message..." className="mt-1 min-h-[120px]" value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} /></div>
                  <Button type="submit" variant="gold" size="lg" className="w-full gap-2 shadow-gold">
                    <Send className="w-5 h-5" /> Send on WhatsApp
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
