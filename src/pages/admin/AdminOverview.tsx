import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useAllBookings } from "@/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(155 50% 20%)", "hsl(42 85% 52%)", "hsl(200 70% 50%)"];

const AdminOverview = () => {
  const { data: bookings, isLoading: loadingBookings } = useAllBookings();
  const { data: closureLogs = [], isLoading: loadingClosures } = useQuery({
    queryKey: ['booking-closure-logs-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_closure_logs')
        .select('id');
      if (error) throw error;
      return data || [];
    },
  });

  const statusCounts = (bookings || []).reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, { pending: 0, documents: 0, visa: 0, confirmed: 0, cancelled: 0 });

  const cancelledTotal = (statusCounts.cancelled || 0) + (closureLogs?.length || 0);
  const statusCountsWithClosures = { ...statusCounts, cancelled: cancelledTotal };

  const totalRevenue = (bookings || [])
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.amount_pkr || 0), 0);

  const stats = [
    { label: "Total Bookings", value: String(bookings?.length || 0), icon: Users, color: "text-primary" },
    { label: "Pending", value: String(statusCountsWithClosures.pending || 0), icon: Clock, color: "text-amber-600" },
    { label: "Revenue", value: `PKR ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-light" },
    { label: "Confirmed", value: String(statusCountsWithClosures.confirmed || 0), icon: CheckCircle, color: "text-green-600" },
  ];

  const monthlyMap = new Map<string, { month: string; bookings: number; revenue: number }>();
  (bookings || []).forEach((b) => {
    const d = new Date(b.created_at);
    const month = d.toLocaleString("en-US", { month: "short" });
    if (!monthlyMap.has(month)) monthlyMap.set(month, { month, bookings: 0, revenue: 0 });
    const row = monthlyMap.get(month)!;
    row.bookings += 1;
    row.revenue += b.status === 'cancelled' ? 0 : (b.amount_pkr || 0);
  });
  const monthlyBookingsData = Array.from(monthlyMap.values());

  const packageTypeData = [
    { name: "Hajj", value: (bookings || []).filter((b) => b.package_type === "hajj").length },
    { name: "Umrah", value: (bookings || []).filter((b) => b.package_type === "umrah").length },
    { name: "Visa", value: (bookings || []).filter((b) => b.package_type === "visa").length },
  ];

  const isLoading = loadingBookings || loadingClosures;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-5"><Skeleton className="h-12 w-full" /></CardContent></Card>
              ))
            : stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`p-3 rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold font-display">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 88%)" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="hsl(155 50% 20%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bookings by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={packageTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {packageTypeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statusCountsWithClosures).map(([status, count]) => (
                <div key={status} className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize mt-1">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
