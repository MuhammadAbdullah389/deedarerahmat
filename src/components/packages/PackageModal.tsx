import { useState } from "react";
import { PackageType, formatPrice } from "@/data/packages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Clock, Building, Star, Phone, Plane, Calendar, AlertTriangle, FileText, ArrowLeft } from "lucide-react";
import HajjRegistrationForm from "@/components/forms/HajjRegistrationForm";
import UmrahRegistrationForm from "@/components/forms/UmrahRegistrationForm";
import { useAuth } from "@/lib/authContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { SITE_CONTACT } from "@/lib/siteContact";

interface PackageModalProps {
  pkg: PackageType | null;
  open: boolean;
  onClose: () => void;
  portalMode?: boolean;
}

const sharingLabels: Record<string, string> = {
  double: 'Double Sharing',
  triple: 'Triple Sharing',
  quad: 'Quad Sharing',
  quint: 'Quint Sharing',
};

const PackageModal = ({ pkg, open, onClose, portalMode = false }: PackageModalProps) => {
  const [step, setStep] = useState<'details' | 'sharing' | 'form'>('details');
  const [selectedSharing, setSelectedSharing] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const buildWhatsAppUrl = (priceText: string, hotelText: string) => {
    const message = `Assalam o Alaikum,\n\nI am interested in the following package:\n\nPackage Name: ${pkg?.name || ''}\nPrice: ${priceText}\nDuration: ${pkg?.duration || ''}\nHotel: ${hotelText}\n\nPlease share more details.`;
    return `https://wa.me/${SITE_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleClose = () => {
    setStep('details');
    setSelectedSharing('');
    setSelectedPrice(null);
    onClose();
  };

  if (!pkg) return null;

  if (step === 'sharing') {
    const sharingEntries = Object.entries(pkg.prices).filter(([, v]) => v !== undefined) as [string, number][];
    const selectedSharingText = selectedSharing && selectedPrice
      ? `${sharingLabels[selectedSharing] || selectedSharing} - ${formatPrice(selectedPrice)}`
      : '';
    const selectedHotelText = pkg.hotels[0]
      ? `${pkg.hotels[0].name} (${pkg.hotels[0].city} - ${pkg.hotels[0].distance})`
      : 'Please share hotel details';
    const selectedWhatsAppUrl = selectedSharingText
      ? buildWhatsAppUrl(selectedSharingText, selectedHotelText)
      : '';
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">Select Room Sharing</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <p className="text-sm text-muted-foreground">
              Package: <strong className="text-foreground">{pkg.name}</strong>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {sharingEntries.map(([type, price]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setSelectedSharing(type); setSelectedPrice(price); }}
                  className={`rounded-xl border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                    selectedSharing === type
                      ? 'border-accent bg-accent/10 shadow-gold'
                      : 'border-border bg-secondary/50 hover:border-accent/50'
                  }`}
                >
                  <p className="text-xs text-muted-foreground mb-1">{sharingLabels[type] || type}</p>
                  <p className="text-lg font-bold text-accent">{formatPrice(price)}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">per person</p>
                </button>
              ))}
            </div>

            {selectedSharing && selectedPrice ? (
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Selected Plan</p>
                  <p className="font-bold text-foreground">{sharingLabels[selectedSharing] || selectedSharing}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Amount to Pay</p>
                  <p className="text-2xl font-bold text-accent">{formatPrice(selectedPrice)}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground italic">Select a sharing type above to see your bill</p>
            )}

            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={() => setStep('details')} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                type="button"
                variant="whatsapp"
                className="flex-1 gap-2"
                disabled={!selectedSharing || !selectedPrice}
                onClick={() => {
                  if (selectedWhatsAppUrl) window.open(selectedWhatsAppUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <Phone className="w-4 h-4" /> Book via WhatsApp
              </Button>
              <Button
                variant="gold"
                className="flex-1 shadow-gold"
                disabled={!selectedSharing}
                onClick={() => setStep('form')}
              >
                Proceed to Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'form') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">
              Apply for {pkg.name}
            </DialogTitle>
          </DialogHeader>
          {!user && !portalMode && (
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="flex-1">
                  Already have an applicant account? Log in first so this application stays linked to your existing portal.
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleClose();
                    navigate('/auth/sign-in');
                  }}
                >
                  Login First
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {user && !portalMode ? (
            <div className="space-y-4 mt-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  You already have a portal account. Please submit your next application from the dashboard so it stays linked to your existing user account.
                </AlertDescription>
              </Alert>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('sharing')} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="gold" className="flex-1" onClick={() => { handleClose(); navigate('/dashboard/apply'); }}>
                  Go to Dashboard Apply
                </Button>
              </div>
            </div>
          ) : pkg.type === 'hajj' ? (
            <HajjRegistrationForm
              packageId={pkg.id}
              packageName={pkg.name}
              sharingType={selectedSharing}
              amountPkr={selectedPrice}
              portalMode={portalMode}
              onBack={() => setStep('sharing')}
            />
          ) : (
            <UmrahRegistrationForm
              packageId={pkg.id}
              packageName={pkg.name}
              sharingType={selectedSharing}
              amountPkr={selectedPrice}
              portalMode={portalMode}
              onBack={() => setStep('sharing')}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  const priceEntries = Object.entries(pkg.prices).filter(([, v]) => v !== undefined);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            <Button variant="gold" className="flex-1 gap-2 shadow-gold" onClick={() => setStep('sharing')}>
              Apply Now
            </Button>
            <Button variant="whatsapp" className="flex-1 gap-2" onClick={() => setStep('sharing')}>
              <Phone className="w-4 h-4" /> Book via WhatsApp
            </Button>
            <a href={`tel:${SITE_CONTACT.primaryPhoneDial}`} className="flex-1">
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
