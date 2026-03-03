import { useState } from "react";
import { umrahPackages, PackageType } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";
import PackageModal from "@/components/packages/PackageModal";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";

const UmrahPackages = () => {
  const [selectedPkg, setSelectedPkg] = useState<PackageType | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={masjidNabawi} alt="Masjid-e-Nabawi" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center pt-16">
          <ScrollReveal>
            <p className="text-gold-light tracking-[0.3em] uppercase text-sm mb-3">Blessed Journey</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground">Umrah Packages</h1>
            <p className="text-primary-foreground/70 mt-4 max-w-xl mx-auto">
              Year-round Umrah packages including special Ramadan offerings for a spiritually enriching experience.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {umrahPackages.map((pkg, i) => (
              <ScrollReveal key={pkg.id} delay={i * 0.1}>
                <PackageCard pkg={pkg} onViewDetails={setSelectedPkg} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <PackageModal pkg={selectedPkg} open={!!selectedPkg} onClose={() => setSelectedPkg(null)} />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default UmrahPackages;
