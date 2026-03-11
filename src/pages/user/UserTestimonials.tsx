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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please write your experience");
      return;
    }

    createTestimonial(
      {
        user_id: user?.id || null,
        name: profile?.full_name || user?.email?.split("@")[0] || "Anonymous",
        location: profile?.location || null,
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
          setAddOpen(false);
        },
        onError: () => toast.error("Failed to submit testimonial"),
      }
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">My Testimonials</h1>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="h-4 w-4" /> Write Testimonial</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Share Your Experience</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                  <Textarea placeholder="Share your journey with Alhabib Travel..." rows={4} value={text} onChange={(e) => setText(e.target.value)} />
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
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-foreground">{t.text}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusColors[t.status]}>{t.status}</Badge>
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
