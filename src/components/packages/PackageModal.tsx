import { useState } from "react";
import { PackageType, formatPrice } from "@/data/packages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock, Building, Star, Phone, Plane, Calendar, AlertTriangle, FileText } from "lucide-react";
import HajjRegistrationForm from "@/components/forms/HajjRegistrationForm";
import UmrahRegistrationForm from "@/components/forms/UmrahRegistrationForm";

interface PackageModalProps {
  pkg: PackageType | null;
  open: boolean;
  onClose: () => void;
}

const PackageModal = ({ pkg, open, onClose }: PackageModalProps) => {
  const [showForm, setShowForm] = useState(false);

  if (!pkg) return null;

  if (showForm) {
    return (
      <Dialog open={open} onOpenChange={() => { setShowForm(false); onClose(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">
              Apply for {pkg.name}
            </DialogTitle>
          </DialogHeader>
          {pkg.type === 'hajj' ? (
            <HajjRegistrationForm packageName={pkg.name} onBack={() => setShowForm(false)} />
          ) : (
            <UmrahRegistrationForm packageName={pkg.name} onBack={() => setShowForm(false)} />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  const priceEntries = Object.entries(pkg.prices).filter(([, v]) => v !== undefined);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            {pkg.name}
            {pkg.featured && (
              <span className="gradient-gold px-2 py-0.5 rounded-full text-xs text-primary-foreground flex items-center gap-1">
                <Star className="w-3 h-3" /> Popular
              </span>
            )}
            {pkg.maktab && (
              <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-bold">
                Maktab {pkg.maktab}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Duration & Flight */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-medium">{pkg.duration}</span>
            </div>
            {pkg.flightInfo && (
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-accent" />
                <span className="text-sm">{pkg.flightInfo.route} • {pkg.flightInfo.date}</span>
              </div>
            )}
          </div>

          {/* Pricing Table */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-3">Pricing (Per Person)</h4>
            <div className={`grid grid-cols-${priceEntries.length} gap-3`}>
              {priceEntries.map(([type, price]) => (
                <div key={type} className="bg-secondary rounded-lg p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{type} Sharing</p>
                  <p className="text-base font-bold text-accent">{formatPrice(price!)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Room Upgrades (Hajj) */}
          {pkg.roomUpgrades && (
            <div>
              <h4 className="font-display text-lg font-bold text-foreground mb-3">Room Upgrade Options</h4>
              <div className="space-y-2">
                {pkg.roomUpgrades.map((u) => (
                  <div key={u.type} className="flex justify-between items-center bg-secondary/50 rounded-lg p-3 border border-border/50">
                    <span className="text-sm font-medium text-foreground">{u.type}</span>
                    <span className="text-sm text-accent font-semibold">{u.extra}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotels */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-accent" /> Hotels & Accommodation
            </h4>
            <div className="space-y-3">
              {pkg.hotels.map((h) => (
                <div key={h.name} className="glass-card rounded-lg p-4">
                  <p className="font-semibold text-foreground">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.city} • {h.distance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          {pkg.itinerary && (
            <div>
              <h4 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" /> Travel & Stay Schedule
              </h4>
              <div className="space-y-2">
                {pkg.itinerary.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3 border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground text-sm">{item.label}</p>
                        {item.duration && <span className="text-xs text-accent font-medium">{item.duration}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.dates} • {item.islamicDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Details */}
          {pkg.packageDetails && (
            <div>
              <h4 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" /> Package Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pkg.packageDetails.map((d) => (
                  <div key={d} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-accent shrink-0" /> {d}
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Requirements */}
          {pkg.requirements && (
            <div>
              <h4 className="font-display text-lg font-bold text-foreground mb-3">Requirements</h4>
              <div className="space-y-2">
                {pkg.requirements.map((r) => (
                  <div key={r} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overseas Discount */}
          {pkg.overseasDiscount && (
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <p className="text-sm font-medium text-foreground">🌍 Overseas Clients: {pkg.overseasDiscount}</p>
            </div>
          )}

          {/* Notes */}
          {pkg.notes && pkg.notes.length > 0 && (
            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
              {pkg.notes.map((n) => (
                <p key={n} className="text-sm text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0" /> {n}
                </p>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button variant="gold" className="flex-1 gap-2 shadow-gold" onClick={() => setShowForm(true)}>
              Apply Now
            </Button>
            <a href="https://wa.me/923422356719" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="whatsapp" className="w-full gap-2">
                <Phone className="w-4 h-4" /> Book via WhatsApp
              </Button>
            </a>
            <a href="tel:+923422356719" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
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
