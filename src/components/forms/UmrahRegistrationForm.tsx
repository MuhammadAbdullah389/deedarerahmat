import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateBooking, useCheckAccountByEmail } from "@/hooks/useSupabase";
import { useAuth } from "@/lib/authContext";
import { formatPrice } from "@/data/packages";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface Props {
  packageId?: string;
  packageName: string;
  sharingType?: string;
  amountPkr?: number | null;
  portalMode?: boolean;
  onBack: () => void;
}

const UmrahRegistrationForm = ({ packageId, packageName, sharingType, amountPkr, portalMode = false, onBack }: Props) => {
  const [address, setAddress] = useState("");
  const [existingAccountBlocked, setExistingAccountBlocked] = useState(false);
  const [blockedEmail, setBlockedEmail] = useState("");
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { mutateAsync: checkAccountByEmail } = useCheckAccountByEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    const firstName = String(fd.get("firstName") || "");
    const lastName = String(fd.get("lastName") || "");
    const fullName = `${firstName} ${lastName}`.trim();
    const email = String(fd.get("email") || "");
    const phone = String(fd.get("phone") || "");

    if (!user) {
      try {
        const result = await checkAccountByEmail({ email });
        if (result.exists) {
          setExistingAccountBlocked(true);
          setBlockedEmail(email);
          toast.error("You already have an account. Please log in to apply again from your dashboard.");
          return;
        }
      } catch (error: any) {
        toast.error(error?.message || "Unable to verify account status");
        return;
      }
    }

    setExistingAccountBlocked(false);
  setBlockedEmail("");

    createBooking(
      {
        user_id: user?.id || null,
        package_id: packageId || null,
        package_name_snapshot: packageName,
        package_type: "umrah",
        sharing_type: sharingType || null,
        amount_pkr: amountPkr || null,
        status: "pending",
        travel_date: null,
        admin_notes: null,
        applicant_email: email || user?.email || null,
        applicant_phone: phone || profile?.phone || null,
        form_data: {
          firstName,
          lastName,
          fullName,
          email,
          phone,
          passportNumber: String(fd.get("passportNumber") || ""),
          address,
          source: user ? 'portal_reapply' : 'public_apply',
        },
      },
      {
        onSuccess: () => {
          toast.success(user ? "Application submitted successfully. It is now visible in your portal." : "Umrah application submitted successfully! We will contact you shortly.");
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

      {existingAccountBlocked && !user && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="flex-1">You already have an applicant account. Please log in and submit your next application from the dashboard.</span>
            <Button type="button" size="sm" variant="outline" onClick={() => navigate(`/auth/sign-in?email=${encodeURIComponent(blockedEmail)}`)}>
              Go to Login
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {user && portalMode && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            You're applying from your portal account. No temporary password will be sent for this application.
          </AlertDescription>
        </Alert>
      )}

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
        <div><Label>First Name *</Label><Input name="firstName" required placeholder="First name" className="mt-1" defaultValue={profile?.full_name?.split(' ')[0] || ""} /></div>
        <div><Label>Last Name *</Label><Input name="lastName" required placeholder="Last name" className="mt-1" defaultValue={profile?.full_name?.split(' ').slice(1).join(' ') || ""} /></div>
        <div><Label>Email Address *</Label><Input name="email" type="email" required placeholder="your@email.com" className="mt-1" defaultValue={user?.email || ""} /></div>
        <div><Label>Phone Number *</Label><Input name="phone" required placeholder="+92 300 1234567" className="mt-1" defaultValue={profile?.phone || ""} /></div>
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
