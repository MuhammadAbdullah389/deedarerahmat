import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, CheckCircle, Clock, FileText } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useUserBookings } from "@/hooks/useSupabase";

const UserOverview = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useUserBookings(user?.id || "");

  const total = bookings?.length || 0;
  const confirmed = bookings?.filter((b) => b.status === "confirmed").length || 0;
  const inProgress = bookings?.filter((b) => b.status === "documents" || b.status === "visa").length || 0;
  const pending = bookings?.filter((b) => b.status === "pending").length || 0;

  const stats = [
    { label: "Total Applications", value: String(total), icon: ClipboardList, color: "text-primary" },
    { label: "Confirmed", value: String(confirmed), icon: CheckCircle, color: "text-green-600" },
    { label: "In Progress", value: String(inProgress), icon: Clock, color: "text-accent" },
    { label: "Pending", value: String(pending), icon: FileText, color: "text-yellow-600" },
  ];

  const recentActivity = (bookings || []).slice(0, 5).map((b) => ({
    date: new Date(b.created_at).toLocaleDateString(),
    text: `${b.package_name_snapshot} status is ${b.status}`,
  }));

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back!</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
              ))
            : stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold font-display">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentActivity.length ? recentActivity : [{ date: "-", text: "No activity yet." }]).map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Badge variant="secondary" className="text-xs shrink-0 mt-0.5">{a.date}</Badge>
                  <p className="text-sm text-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserOverview;
