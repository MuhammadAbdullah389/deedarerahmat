import { PackageType, formatPrice } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";

interface PackageCardProps {
  pkg: PackageType;
  onViewDetails: (pkg: PackageType) => void;
}

const PackageCard = ({ pkg, onViewDetails }: PackageCardProps) => {
  const image = pkg.type === 'hajj' ? heroKaaba : masjidNabawi;

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-gold transition-all duration-500 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {pkg.featured && (
          <div className="absolute top-4 right-4 gradient-gold px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-primary-foreground">
            <Star className="w-3 h-3" /> Popular
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent h-20" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>{pkg.duration}</span>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-secondary rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Double</p>
            <p className="text-sm font-semibold text-foreground">{formatPrice(pkg.prices.double)}</p>
          </div>
          <div className="bg-secondary rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Triple</p>
            <p className="text-sm font-semibold text-foreground">{formatPrice(pkg.prices.triple)}</p>
          </div>
          <div className="bg-secondary rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Quad</p>
            <p className="text-sm font-semibold text-foreground">{formatPrice(pkg.prices.quad)}</p>
          </div>
          <div className="bg-secondary rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Quint</p>
            <p className="text-sm font-semibold text-foreground">{formatPrice(pkg.prices.quint)}</p>
          </div>
        </div>

        {/* Hotels Preview */}
        <div className="mb-4 flex-1">
          {pkg.hotels.map((h) => (
            <p key={h.name} className="text-xs text-muted-foreground">
              🏨 {h.name} – <span className="text-accent">{h.distance}</span>
            </p>
          ))}
        </div>

        <Button variant="gold" className="w-full" onClick={() => onViewDetails(pkg)}>
          View Full Details
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
