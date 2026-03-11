import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/authContext";
import { useUserBookings } from "@/hooks/useSupabase";

const statusSteps = ['pending', 'documents', 'visa', 'confirmed'] as const;
const stepLabels = { pending: 'Applied', documents: 'Documents', visa: 'Visa Processing', confirmed: 'Confirmed' };

const getProgress = (status: typeof statusSteps[number]) => {
  const idx = statusSteps.indexOf(status);
  return ((idx + 1) / statusSteps.length) * 100;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  documents: "bg-blue-100 text-blue-800",
  visa: "bg-purple-100 text-purple-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const UserBookings = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useUserBookings(user?.id || '');

  if (!user) {
    return (
      <UserLayout>
        <div className="text-center py-12">Please sign in to view your bookings.</div>
      </UserLayout>
    );
  }
  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">My Bookings</h1>

        <div className="grid gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ))
            : bookings && bookings.length > 0
            ? bookings.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg">{b.package_name_snapshot}</CardTitle>
                  <Badge className={`${statusColors[b.status]} capitalize`}>{b.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{b.booking_code}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{b.package_type}</span></div>
                  <div><span className="text-muted-foreground">Sharing:</span> {b.sharing_type}</div>
                  <div><span className="text-muted-foreground">Amount:</span> Rs. {b.amount_pkr?.toLocaleString()}</div>
                </div>

                {/* Progress Tracker */}
                <div className="space-y-2">
                  <Progress value={statusSteps.includes(b.status as typeof statusSteps[number]) ? getProgress(b.status as typeof statusSteps[number]) : 0} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {statusSteps.map((step) => (
                      <span key={step} className={statusSteps.includes(b.status as typeof statusSteps[number]) && statusSteps.indexOf(step) <= statusSteps.indexOf(b.status as typeof statusSteps[number]) ? "text-primary font-medium" : ""}>
                        {stepLabels[step]}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
            : <div className="text-center py-12 text-muted-foreground">No bookings yet</div>}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserBookings;
