import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Props {
  packageName: string;
  onBack: () => void;
}

const UmrahRegistrationForm = ({ packageName, onBack }: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Umrah application submitted successfully! We will contact you shortly.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <p className="text-sm text-muted-foreground">Applying for: <strong className="text-foreground">{packageName}</strong></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>First Name *</Label><Input required placeholder="First name" className="mt-1" /></div>
        <div><Label>Last Name *</Label><Input required placeholder="Last name" className="mt-1" /></div>
        <div><Label>Email Address *</Label><Input type="email" required placeholder="your@email.com" className="mt-1" /></div>
        <div><Label>Phone Number *</Label><Input required placeholder="+92 300 1234567" className="mt-1" /></div>
        <div className="md:col-span-2"><Label>Passport Number *</Label><Input required placeholder="Enter your passport number" className="mt-1" /></div>
        <div className="md:col-span-2"><Label>Address *</Label><Textarea required placeholder="Enter your full address" className="mt-1" /></div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button type="submit" variant="gold" className="flex-1 shadow-gold">
          Submit Application
        </Button>
      </div>
    </form>
  );
};

export default UmrahRegistrationForm;
