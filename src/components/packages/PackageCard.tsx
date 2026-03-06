import { PackageType, formatPrice } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Clock, Star, ArrowRight } from "lucide-react";
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
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-primary-foreground/90">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{pkg.duration}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-4">{pkg.name}</h3>
        <div className={`grid grid-cols-${Math.min(priceEntries.length, 3)} gap-2 mb-4`}>
          {priceEntries.map(([label, price]) => (
            <div key={label} className="bg-secondary/50 backdrop-blur-sm rounded-lg p-2.5 text-center border border-border/50 group-hover:border-accent/20 transition-colors">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-foreground">{formatPrice(price!)}</p>
            </div>
          ))}
        </div>
        <div className="mb-5 flex-1 space-y-1">
          {pkg.hotels.map((h) => (
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
