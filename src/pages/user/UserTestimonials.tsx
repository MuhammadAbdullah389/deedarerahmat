import { useState } from "react";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCreateTestimonial, useUserTestimonials } from "@/hooks/useSupabase";
import { useAuth } from "@/lib/authContext";
import { PakistanCityCombobox } from "@/components/forms/PakistanCityCombobox";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const UserTestimonials = () => {
  const { user, profile } = useAuth();
  const { data: myTestimonials, isLoading } = useUserTestimonials(user?.id || "");
  const { mutate: createTestimonial, isPending } = useCreateTestimonial();
  const [addOpen, setAddOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [city, setCity] = useState(profile?.location || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !city) {
      toast.error("Please select your city and write your experience");
      return;
    }

    createTestimonial(
      {
        user_id: user?.id || null,
        name: profile?.full_name || user?.email?.split("@")[0] || "Anonymous",
        location: city,
        rating,
        text,
        package_type: null,
        status: "pending",
        published_at: null,
      },
      {
        onSuccess: () => {
          toast.success("Testimonial submitted for review!");
          setText("");
          setRating(5);
          setCity(profile?.location || "");
          setAddOpen(false);
        },
        onError: () => toast.error("Failed to submit testimonial"),
      }
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">My Testimonials</h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> Write Testimonial</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Share Your Experience</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>City</Label>
                  <PakistanCityCombobox
                    value={city}
                    onValueChange={setCity}
                    placeholder="Select your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} type="button" onClick={() => setRating(i)}>
                        <Star className={`h-6 w-6 cursor-pointer ${i <= rating ? "fill-accent text-accent" : "text-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your Experience</Label>
                  <Textarea placeholder="Share your journey with Deedar-e-Rahamat Travel..." rows={4} value={text} onChange={(e) => setText(e.target.value)} />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={isPending}>Submit for Review</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
              ))
            : (myTestimonials || []).map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-foreground">{t.text}</p>
                    <p className="text-xs text-muted-foreground">{t.location || 'Pakistan'} • {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={`${statusColors[t.status]} w-fit`}>{t.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserTestimonials;
