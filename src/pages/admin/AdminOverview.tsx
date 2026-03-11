import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, TrendingUp, CheckCircle, ArrowUpRight } from "lucide-react";
import { monthlyBookingsData, packageTypeData, statusCounts } from "@/data/mockDashboard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(155 50% 20%)", "hsl(42 85% 52%)", "hsl(200 70% 50%)"];

const stats = [
  { label: "Total Bookings", value: "100", icon: Users, trend: "+12%", gradient: "from-[hsl(155,50%,20%)] to-[hsl(155,40%,32%)]" },
  { label: "Active Packages", value: "13", icon: Package, trend: "+3", gradient: "from-[hsl(42,85%,52%)] to-[hsl(42,75%,68%)]" },
  { label: "Revenue (M)", value: "PKR 86.6M", icon: TrendingUp, trend: "+18%", gradient: "from-[hsl(200,70%,40%)] to-[hsl(200,60%,55%)]" },
  { label: "Confirmed", value: String(statusCounts.confirmed), icon: CheckCircle, trend: "45%", gradient: "from-[hsl(155,50%,20%)] to-[hsl(42,85%,52%)]" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-500" },
  documents: { label: "Documents", color: "bg-blue-500" },
  visa: { label: "Visa Processing", color: "bg-purple-500" },
  confirmed: { label: "Confirmed", color: "bg-green-500" },
};

const AdminOverview = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${s.gradient} text-primary-foreground shadow-md`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
                    <p className="text-2xl font-bold font-display mt-0.5">{s.value}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3" />
                    {s.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Monthly Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 20% 90%)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(40 25% 99%)",
                        border: "1px solid hsl(40 20% 88%)",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar dataKey="bookings" fill="hsl(155 50% 20%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Bookings by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageTypeData}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={100}
                      dataKey="value"
                      strokeWidth={3}
                      stroke="hsl(40 25% 99%)"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {packageTypeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: "13px" }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Pipeline */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Booking Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statusCounts).map(([status, count]) => {
                const info = statusLabels[status];
                return (
                  <div key={status} className="relative overflow-hidden text-center p-6 rounded-xl bg-muted/60 hover:bg-muted transition-colors">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${info.color}`} />
                    <p className="text-3xl font-bold font-display text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground mt-1">{info.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
