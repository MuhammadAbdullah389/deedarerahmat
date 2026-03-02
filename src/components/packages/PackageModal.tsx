import { PackageType, formatPrice } from "@/data/packages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock, Building, Star, Phone } from "lucide-react";

interface PackageModalProps {
  pkg: PackageType | null;
  open: boolean;
  onClose: () => void;
}

const PackageModal = ({ pkg, open, onClose }: PackageModalProps) => {
  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            {pkg.name}
            {pkg.featured && (
              <span className="gradient-gold px-2 py-0.5 rounded-full text-xs text-primary-foreground flex items-center gap-1">
                <Star className="w-3 h-3" /> Popular
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Duration */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5 text-accent" />
            <span className="font-medium">{pkg.duration}</span>
          </div>

          {/* Pricing Table */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-3">Pricing (Per Person)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(pkg.prices).map(([type, price]) => (
                <div key={type} className="bg-secondary rounded-lg p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{type} Sharing</p>
                  <p className="text-base font-bold text-accent">{formatPrice(price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hotels */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-accent" /> Hotels & Accommodation
            </h4>
            <div className="space-y-3">
              {pkg.hotels.map((h) => (
                <div key={h.name} className="bg-secondary rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.city} • {h.distance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-3">Services Included</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pkg.services.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-accent shrink-0" /> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-3">Package Inclusions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pkg.inclusions.map((inc) => (
                <div key={inc} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-emerald shrink-0" /> {inc}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="whatsapp" className="w-full gap-2">
                <Phone className="w-4 h-4" /> Book via WhatsApp
              </Button>
            </a>
            <a href="tel:+923001234567" className="flex-1">
              <Button variant="gold" className="w-full gap-2">
                <Phone className="w-4 h-4" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;
