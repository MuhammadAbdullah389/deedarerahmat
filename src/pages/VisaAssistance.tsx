import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, FileText, Globe, Plane, Shield, Phone, Send } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import visaImage from "@/assets/visa-assistance.jpg";
import { toast } from "sonner";

const visaCountries = [
  "Saudi Arabia", "Turkey", "Malaysia", "Thailand", "UAE", "Iran", "Iraq",
  "United Kingdom", "United States", "Canada", "Australia", "China", "Japan",
];

const visaRequirements = [
  { icon: FileText, title: "Valid Passport", desc: "Passport valid for at least 6 months with 2+ blank pages" },
  { icon: Globe, title: "Visa Application Form", desc: "Completed and signed visa application form" },
  { icon: Shield, title: "Passport Photos", desc: "Recent passport-sized photographs (white background)" },
  { icon: Plane, title: "Travel Itinerary", desc: "Confirmed flight bookings and hotel reservations" },
];

const fascinations = [
  "🌍 We process visas for 50+ countries worldwide",
  "⚡ Express processing available for urgent travel",
  "📋 Complete document guidance & verification",
  "💯 99% visa approval success rate",
  "🤝 Personal assistance throughout the process",
  "🔒 Your documents are handled with utmost confidentiality",
];

const VisaAssistance = () => {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", country: "", passportNo: "", travelDate: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Your visa inquiry has been submitted! We'll contact you shortly.");
    setFormData({ name: "", phone: "", email: "", country: "", passportNo: "", travelDate: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={visaImage} alt="Visa Assistance" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Travel With Confidence</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground">Visa Assistance</h1>
            <p className="text-primary-foreground/70 mt-4 max-w-xl mx-auto">
              Expert visa processing and consultation for countries worldwide. We handle the paperwork, you plan the journey.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-secondary islamic-pattern">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-2">Requirements</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">General Visa Requirements</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {visaRequirements.map((req, i) => (
              <ScrollReveal key={req.title} delay={i * 0.1}>
                <div className="glass-card rounded-xl p-6 text-center hover:shadow-gold transition-all duration-500">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                    <req.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">{req.title}</h3>
                  <p className="text-muted-foreground text-sm">{req.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fascinations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-foreground">Why Choose Our Visa Services?</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fascinations.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="glass-card rounded-lg p-4 flex items-center gap-3 text-foreground/80 text-sm"
                >
                  {f}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 gradient-emerald text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold-light font-medium tracking-widest uppercase text-sm mb-2">Apply Now</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Visa Application Inquiry</h2>
              <p className="text-primary-foreground/70 mt-3">Fill out the form below and our visa experts will get back to you within 24 hours.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 shadow-lg space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone Number *</label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+92 300 1234567" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Country *</label>
                  <Select value={formData.country} onValueChange={(v) => setFormData({ ...formData, country: v })}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>{visaCountries.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Passport Number</label>
                  <Input value={formData.passportNo} onChange={(e) => setFormData({ ...formData, passportNo: e.target.value })} placeholder="AB1234567" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Expected Travel Date</label>
                  <Input type="date" value={formData.travelDate} onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Additional Message</label>
                <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Any specific requirements or questions..." rows={4} />
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full gap-2 text-base">
                <Send className="w-5 h-5" /> Submit Visa Inquiry
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default VisaAssistance;
