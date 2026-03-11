import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateBooking } from "@/hooks/useSupabase";
import { useAuth } from "@/lib/authContext";
import { formatPrice } from "@/data/packages";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  packageName: string;
  sharingType?: string;
  amountPkr?: number | null;
  onBack: () => void;
}

const UmrahRegistrationForm = ({ packageName, sharingType, amountPkr, onBack }: Props) => {
  const [address, setAddress] = useState("");
  const { user } = useAuth();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    const firstName = String(fd.get("firstName") || "");
    const lastName = String(fd.get("lastName") || "");
    const fullName = `${firstName} ${lastName}`.trim();
    const email = String(fd.get("email") || "");
    const phone = String(fd.get("phone") || "");

    createBooking(
      {
        user_id: user?.id || null,
        package_id: null,
        package_name_snapshot: packageName,
        package_type: "umrah",
        sharing_type: sharingType || null,
        amount_pkr: amountPkr || null,
        status: "pending",
        travel_date: null,
        admin_notes: null,
        applicant_email: !user ? email : null,
        applicant_phone: !user ? phone : null,
        form_data: {
          firstName,
          lastName,
          fullName,
          email,
          phone,
          passportNumber: String(fd.get("passportNumber") || ""),
          address,
        },
      },
      {
        onSuccess: () => {
          toast.success("Umrah application submitted successfully! We will contact you shortly.");
          form.reset();
          setAddress("");
          onBack();
        },
        onError: (error: any) => {
          console.error("Booking submission error:", error);
          const errorMsg = error?.message || "Failed to submit application. Please try again.";
          toast.error(errorMsg);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <p className="text-sm text-muted-foreground">Applying for: <strong className="text-foreground">{packageName}</strong></p>

      {!user && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You're applying without an account. We'll send you a temporary password via WhatsApp to access your application portal and upload documents.
          </AlertDescription>
        </Alert>
      )}

      {/* Bill Summary */}
      {sharingType && amountPkr && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Room Sharing</p>
            <p className="font-bold text-foreground capitalize">{sharingType} Sharing</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Price per Person</p>
            <p className="text-2xl font-bold text-accent">{formatPrice(amountPkr)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>First Name *</Label><Input name="firstName" required placeholder="First name" className="mt-1" /></div>
        <div><Label>Last Name *</Label><Input name="lastName" required placeholder="Last name" className="mt-1" /></div>
        <div><Label>Email Address *</Label><Input name="email" type="email" required placeholder="your@email.com" className="mt-1" /></div>
        <div><Label>Phone Number *</Label><Input name="phone" required placeholder="+92 300 1234567" className="mt-1" /></div>
        <div className="md:col-span-2"><Label>Passport Number *</Label><Input name="passportNumber" required placeholder="Enter your passport number" className="mt-1" /></div>
        <div className="md:col-span-2"><Label>Address *</Label><Textarea required placeholder="Enter your full address" className="mt-1" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button type="submit" variant="gold" className="flex-1 shadow-gold" disabled={isPending}>
          Submit Application
        </Button>
      </div>
    </form>
  );
};

export default UmrahRegistrationForm;
