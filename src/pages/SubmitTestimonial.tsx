import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Send, MessageSquareHeart } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { toast } from "sonner";

const SubmitTestimonial = () => {
  const [formData, setFormData] = useState({
    name: "", location: "", packageType: "", rating: 5, text: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text || !formData.packageType) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Thank you! Your testimonial has been submitted for review.");
    setFormData({ name: "", location: "", packageType: "", rating: 5, text: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-gold flex items-center justify-center shadow-gold">
                <MessageSquareHeart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Share Your Experience</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                We'd love to hear about your journey. Your testimonial helps other pilgrims make informed decisions.
              </p>
              <div className="section-divider w-24 mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Narowal, Pakistan" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Package Type *</label>
                <Select value={formData.packageType} onValueChange={(v) => setFormData({ ...formData, packageType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select package type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hajj">Hajj Package</SelectItem>
                    <SelectItem value="umrah">Umrah Package</SelectItem>
                    <SelectItem value="visa">Visa Assistance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= formData.rating ? "fill-accent text-accent" : "text-border"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Your Experience *</label>
                <Textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Tell us about your journey — what made it special?"
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" variant="gold" size="lg" className="w-full gap-2 text-base shadow-gold">
                <Send className="w-5 h-5" /> Submit Testimonial
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your testimonial will be reviewed before being published on our website.
              </p>
            </form>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SubmitTestimonial;
