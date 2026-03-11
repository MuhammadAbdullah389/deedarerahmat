import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
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

const HajjRegistrationForm = ({ packageName, sharingType, amountPkr, onBack }: Props) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [isShia, setIsShia] = useState("");
  const [hajjBadal, setHajjBadal] = useState("");
  const { user } = useAuth();
  const { mutate: createBooking, isPending } = useCreateBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    const fullName = String(fd.get("fullName") || "");
    const email = String(fd.get("email") || "");
    const phone = String(fd.get("phone") || "");

    createBooking(
      {
        user_id: user?.id || null,
        package_id: null,
        package_name_snapshot: packageName,
        package_type: "hajj",
        sharing_type: sharingType || null,
        amount_pkr: amountPkr || null,
        status: "pending",
        travel_date: null,
        admin_notes: null,
        applicant_email: !user ? email : null,
        applicant_phone: !user ? phone : null,
        form_data: {
          fullName,
          email,
          phone,
          mobile: String(fd.get("mobile") || ""),
          passportNumber: String(fd.get("passportNumber") || ""),
          numberOfPersons: Number(fd.get("numberOfPersons") || 1),
          bloodGroup,
          gender,
          maritalStatus,
          isShia,
          postalCode: String(fd.get("postalCode") || ""),
          mehramName: String(fd.get("mehramName") || ""),
          nomineeName: String(fd.get("nomineeName") || ""),
          nomineeRelation: String(fd.get("nomineeRelation") || ""),
          nomineeCnic: String(fd.get("nomineeCnic") || ""),
          nomineePhone: String(fd.get("nomineePhone") || ""),
          hajjBadal,
          photoFileName: photo?.name || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Hajj application submitted successfully! We will contact you shortly.");
          form.reset();
          setPhoto(null);
          setBloodGroup("");
          setGender("");
          setMaritalStatus("");
          setIsShia("");
          setHajjBadal("");
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
      <div>
        <Label>Upload Picture (Blue Background)</Label>
        <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-accent/50 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{photo ? photo.name : "Click to upload"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Full Name *</Label><Input name="fullName" required placeholder="Enter your full name" className="mt-1" /></div>
        <div><Label>Email *</Label><Input name="email" type="email" required placeholder="your@email.com" className="mt-1" /></div>
        <div><Label>Phone Number *</Label><Input name="phone" required placeholder="+92 300 1234567" className="mt-1" /></div>
        <div><Label>Mobile Number</Label><Input name="mobile" placeholder="+92 300 1234567" className="mt-1" /></div>
        <div><Label>Passport Number *</Label><Input name="passportNumber" required placeholder="Enter passport number" className="mt-1" /></div>
        <div><Label>Number of Persons *</Label><Input name="numberOfPersons" type="number" min={1} required placeholder="1" className="mt-1" /></div>
        <div>
          <Label>Blood Group *</Label>
          <Select required value={bloodGroup} onValueChange={setBloodGroup}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Gender *</Label>
          <Select required value={gender} onValueChange={setGender}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Marital Status *</Label>
          <Select required value={maritalStatus} onValueChange={setMaritalStatus}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Are you Shia?</Label>
          <Select value={isShia} onValueChange={setIsShia}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Present Postal Code</Label><Input name="postalCode" placeholder="Enter postal code" className="mt-1" /></div>
        <div><Label>Mehram's Name (Ladies)</Label><Input name="mehramName" placeholder="Mehram's full name" className="mt-1" /></div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-display text-base font-bold text-foreground mb-3">Nominee Details (In case of death)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Nominee Name *</Label><Input name="nomineeName" required placeholder="Nominee full name" className="mt-1" /></div>
          <div><Label>Relation with Nominee *</Label><Input name="nomineeRelation" required placeholder="e.g. Father, Wife" className="mt-1" /></div>
          <div><Label>Nominee CNIC Number *</Label><Input name="nomineeCnic" required placeholder="XXXXX-XXXXXXX-X" className="mt-1" /></div>
          <div><Label>Nominee Phone *</Label><Input name="nomineePhone" required placeholder="+92 300 1234567" className="mt-1" /></div>
        </div>
      </div>

      <div>
        <Label>Want to Perform Hajj-e-Badal?</Label>
        <Select value={hajjBadal} onValueChange={setHajjBadal}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
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

export default HajjRegistrationForm;
