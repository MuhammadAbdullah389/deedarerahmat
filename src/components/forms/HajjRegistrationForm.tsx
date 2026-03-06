import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

interface Props {
  packageName: string;
  onBack: () => void;
}

const HajjRegistrationForm = ({ packageName, onBack }: Props) => {
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hajj application submitted successfully! We will contact you shortly.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <p className="text-sm text-muted-foreground">Applying for: <strong className="text-foreground">{packageName}</strong></p>

      {/* Photo Upload */}
      <div>
        <Label>Upload Picture (Blue Background)</Label>
        <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-accent/50 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{photo ? photo.name : "Click to upload"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Full Name *</Label><Input required placeholder="Enter your full name" className="mt-1" /></div>
        <div><Label>Email *</Label><Input type="email" required placeholder="your@email.com" className="mt-1" /></div>
        <div><Label>Phone Number *</Label><Input required placeholder="+92 300 1234567" className="mt-1" /></div>
        <div><Label>Mobile Number</Label><Input placeholder="+92 300 1234567" className="mt-1" /></div>
        <div><Label>Passport Number *</Label><Input required placeholder="Enter passport number" className="mt-1" /></div>
        <div><Label>Number of Persons *</Label><Input type="number" min={1} required placeholder="1" className="mt-1" /></div>
        <div>
          <Label>Blood Group *</Label>
          <Select required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Gender *</Label>
          <Select required>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Marital Status *</Label>
          <Select required>
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
          <Select>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Present Postal Code</Label><Input placeholder="Enter postal code" className="mt-1" /></div>
        <div><Label>Mehram's Name (Ladies)</Label><Input placeholder="Mehram's full name" className="mt-1" /></div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-display text-base font-bold text-foreground mb-3">Nominee Details (In case of death)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Nominee Name *</Label><Input required placeholder="Nominee full name" className="mt-1" /></div>
          <div><Label>Relation with Nominee *</Label><Input required placeholder="e.g. Father, Wife" className="mt-1" /></div>
          <div><Label>Nominee CNIC Number *</Label><Input required placeholder="XXXXX-XXXXXXX-X" className="mt-1" /></div>
          <div><Label>Nominee Phone *</Label><Input required placeholder="+92 300 1234567" className="mt-1" /></div>
        </div>
      </div>

      <div>
        <Label>Want to Perform Hajj-e-Badal?</Label>
        <Select>
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
        <Button type="submit" variant="gold" className="flex-1 shadow-gold">
          Submit Application
        </Button>
      </div>
    </form>
  );
};

export default HajjRegistrationForm;
