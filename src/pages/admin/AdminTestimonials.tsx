import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, MessageSquare, Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import { mockTestimonials, type Testimonial } from "@/data/mockDashboard";
import { toast } from "sonner";

const statusConfig: Record<Testimonial['status'], { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  approved: { label: "Approved", className: "bg-green-50 text-green-700 border-green-200", icon: ThumbsUp },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200", icon: ThumbsDown },
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState(mockTestimonials);

  const updateStatus = (id: string, status: Testimonial['status']) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast.success(`Testimonial ${status}`);
  };

  const pending = testimonials.filter(t => t.status === 'pending').length;
  const approved = testimonials.filter(t => t.status === 'approved').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Testimonial Management</h1>
            <p className="text-muted-foreground text-sm mt-1">{pending} pending · {approved} approved</p>
          </div>
        </div>

        {/* Quick filter stats */}
        <div className="flex gap-3">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = testimonials.filter(t => t.status === key).length;
            return (
              <div key={key} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${config.className}`}>
                <config.icon className="h-4 w-4" />
                <span className="font-semibold text-sm">{count}</span>
                <span className="text-xs">{config.label}</span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4">
          {testimonials.map((t) => {
            const config = statusConfig[t.status];
            return (
              <Card key={t.id} className="shadow-sm border-0 hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-1 ${t.status === 'pending' ? 'bg-yellow-400' : t.status === 'approved' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* Avatar */}
                      <div className="h-11 w-11 rounded-full gradient-emerald flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-foreground">{t.name}</h3>
                          <Badge variant="outline" className={`${config.className} border text-xs gap-1`}>
                            <config.icon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{t.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted"}`} />
                          ))}
                        </div>
                        <div className="flex items-start gap-2 mt-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/80 italic">"{t.text}"</p>
                        </div>
                      </div>
                    </div>
                    {t.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={() => updateStatus(t.id, 'approved')}>
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 border-red-200 text-red-600 hover:bg-red-50" onClick={() => updateStatus(t.id, 'rejected')}>
                          <X className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
