import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Star } from "lucide-react";
import { useAllTestimonials, useUpdateTestimonial, type Testimonial } from "@/hooks/useSupabase";
import { toast } from "sonner";

const statusColors: Record<Testimonial['status'], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminTestimonials = () => {
  const { data: testimonials, isLoading } = useAllTestimonials();
  const { mutate: updateTestimonial, isPending } = useUpdateTestimonial();

  const updateStatus = (id: string, status: Testimonial['status']) => {
    updateTestimonial(
      { id, status },
      {
        onSuccess: () => toast.success(`Testimonial ${status}`),
        onError: () => toast.error("Failed to update testimonial"),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Testimonial Management</h1>

        <div className="grid gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            : (testimonials || []).map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{t.name}</h3>
                      <Badge className={statusColors[t.status]}>{t.status}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.location || 'Pakistan'}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-foreground">{t.text}</p>
                  </div>
                  {t.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="default" className="gap-1" onClick={() => updateStatus(t.id, 'approved')} disabled={isPending}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateStatus(t.id, 'rejected')} disabled={isPending}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
