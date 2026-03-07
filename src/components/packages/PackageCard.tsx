import { PackageType, formatPrice } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Clock, Star, ArrowRight, Plane } from "lucide-react";
import { motion } from "framer-motion";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import masjidNabawi from "@/assets/masjid-nabawi.jpg";

interface PackageCardProps {
  pkg: PackageType;
  onViewDetails: (pkg: PackageType) => void;
}

const PackageCard = ({ pkg, onViewDetails }: PackageCardProps) => {
  const image = pkg.type === 'hajj' ? heroKaaba : masjidNabawi;
  const priceEntries = Object.entries(pkg.prices).filter(([, v]) => v !== undefined);
  const lowestPrice = Math.min(...priceEntries.map(([, v]) => v!));

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group glass-card rounded-2xl overflow-hidden shimmer-hover hover:shadow-gold transition-all duration-500 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {pkg.featured && (
          <div className="absolute top-4 right-4 gradient-gold px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-primary-foreground shadow-gold">
            <Star className="w-3 h-3 fill-current" /> Popular
          </div>
        )}
        {pkg.maktab && (
          <div className="absolute top-4 left-4 bg-accent/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold">
            Maktab {pkg.maktab}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent h-24" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-primary-foreground/90">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{pkg.duration}</span>
          </div>
          {pkg.flightInfo?.flight && (
            <div className="flex items-center gap-1">
              <Plane className="w-3 h-3" />
              <span className="text-xs">{pkg.flightInfo.flight}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2">{pkg.name}</h3>
        
        {pkg.nightsBreakup && (
          <p className="text-xs text-muted-foreground mb-3">Nights Breakup: {pkg.nightsBreakup}</p>
        )}

        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Starting from</p>
          <p className="text-xl font-bold text-accent">{formatPrice(lowestPrice)}</p>
        </div>

        <div className="mb-5 flex-1 space-y-1">
          {pkg.hotels.slice(0, 3).map((h) => (
            <p key={h.name} className="text-xs text-muted-foreground">
              🏨 {h.name} – <span className="text-accent font-medium">{h.distance}</span>
            </p>
          ))}
        </div>
        <Button variant="gold" className="w-full gap-2 shadow-gold group/btn" onClick={() => onViewDetails(pkg)}>
          View Full Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PackageCard;
