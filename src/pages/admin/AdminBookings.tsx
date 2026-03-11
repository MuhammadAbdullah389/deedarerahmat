import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockBookings, type Booking } from "@/data/mockDashboard";
import { formatPrice } from "@/data/packages";
import { toast } from "sonner";
import { Search, Filter, ArrowRight, Users, Clock, CheckCircle, FileText } from "lucide-react";

const statusConfig: Record<Booking['status'], { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  documents: { label: "Documents", className: "bg-blue-50 text-blue-700 border-blue-200", icon: FileText },
  visa: { label: "Visa", className: "bg-purple-50 text-purple-700 border-purple-200", icon: Users },
  confirmed: { label: "Confirmed", className: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
};

const statusNext: Record<Booking['status'], Booking['status'] | null> = {
  pending: 'documents',
  documents: 'visa',
  visa: 'confirmed',
  confirmed: null,
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(b => {
    if (filterType !== "all" && b.packageType !== filterType) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search && !b.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const advanceStatus = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== id) return b;
      const next = statusNext[b.status];
      if (!next) return b;
      toast.success(`${b.customerName}: ${b.status} → ${next}`);
      return { ...b, status: next };
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Booking Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} bookings found</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = bookings.filter(b => b.status === key).length;
            return (
              <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border ${config.className}`}>
                <config.icon className="h-4 w-4" />
                <div>
                  <p className="text-lg font-bold font-display">{count}</p>
                  <p className="text-xs">{config.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customer..." className="pl-9 bg-card" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] bg-card"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hajj">Hajj</SelectItem>
              <SelectItem value="umrah">Umrah</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-md border-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Package</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => {
                  const config = statusConfig[b.status];
                  return (
                    <TableRow key={b.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">{b.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                            {b.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{b.customerName}</p>
                            <p className="text-xs text-muted-foreground">{b.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{b.packageName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${config.className} border text-xs gap-1`}>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium text-sm">{formatPrice(b.amount)}</TableCell>
                      <TableCell>
                        {statusNext[b.status] ? (
                          <Button size="sm" variant="outline" className="gap-1 text-xs hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => advanceStatus(b.id)}>
                            {statusNext[b.status]} <ArrowRight className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">✓ Done</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
