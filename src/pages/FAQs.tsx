import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const faqs = [
  {
    category: "Hajj & Umrah",
    questions: [
      { q: "What documents are required for Hajj?", a: "You need a valid passport (6+ months validity), recent passport photos, vaccination certificates (Meningitis & COVID-19), completed application forms, and proof of mahram relationship for female pilgrims under 45." },
      { q: "When is the best time to perform Umrah?", a: "Umrah can be performed year-round. Ramadan is the most blessed time, but also the busiest. Off-peak months like Rajab and Sha'ban offer a more peaceful experience with lower prices." },
      { q: "Are meals included in the packages?", a: "Most of our packages include breakfast and dinner. Some premium packages offer all-inclusive meals. Specific details are mentioned in each package description." },
      { q: "How far are the hotels from Haram?", a: "We offer hotels ranging from 50m to 1km from Masjid al-Haram. Each package clearly mentions the hotel distance so you can choose according to your preference and budget." },
      { q: "Can I customize my package?", a: "Absolutely! We offer flexible packages that can be customized based on your budget, group size, preferred hotels, and travel dates. Contact us for a personalized quote." },
    ],
  },
  {
    category: "Visa Services",
    questions: [
      { q: "How long does visa processing take?", a: "Standard processing takes 7-15 working days. Express processing (3-5 days) is available for most countries at an additional fee." },
      { q: "What is your visa success rate?", a: "We maintain a 99% visa approval rate thanks to our thorough document preparation and expert guidance throughout the process." },
      { q: "Do you handle visa rejections?", a: "Yes, we provide re-application assistance if your visa is rejected. We analyze the rejection reason and help you reapply with a stronger application." },
    ],
  },
  {
    category: "Payments & Booking",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept bank transfers, cash payments at our office, JazzCash, EasyPaisa, and installment plans for eligible packages." },
      { q: "Is there an installment plan available?", a: "Yes! We offer flexible installment plans for Hajj and Umrah packages. You can reserve your spot with a deposit and pay the remaining amount in installments before departure." },
      { q: "What is your cancellation policy?", a: "Cancellations made 60+ days before departure receive a full refund minus processing fees. Cancellations within 30-60 days receive 50% refund. Within 30 days, the deposit is non-refundable." },
    ],
  },
];

const FAQs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-gold flex items-center justify-center shadow-gold">
                <HelpCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">Frequently Asked Questions</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Find answers to common questions about our Hajj, Umrah, and visa services.
              </p>
              <div className="section-divider w-24 mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="space-y-10">
            {faqs.map((section, si) => (
              <ScrollReveal key={section.category} delay={si * 0.1}>
                <div className="glass-card rounded-2xl p-6 md:p-8">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {section.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {section.questions.map((faq, qi) => (
                      <AccordionItem key={qi} value={`${si}-${qi}`} className="border-border/50">
                        <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-accent transition-colors">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-14 text-center glass-card rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Still have questions?</h3>
              <p className="text-muted-foreground text-sm mb-5">Our team is always happy to help you with any queries.</p>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="lg" className="gap-2 shadow-gold">
                  <Phone className="w-5 h-5" /> Chat on WhatsApp
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FAQs;
