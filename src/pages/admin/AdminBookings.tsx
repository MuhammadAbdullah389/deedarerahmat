import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllBookings, useUpdateBookingStatus, type Booking } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";

const statusColors: Record<Booking['status'], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  documents: "bg-blue-100 text-blue-800 border-blue-300",
  visa: "bg-purple-100 text-purple-800 border-purple-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusNext: Record<Booking['status'], Booking['status'] | null> = {
  pending: 'documents',
  documents: 'visa',
  visa: 'confirmed',
  confirmed: null,
  cancelled: null,
};

const formatPrice = (amount: number | null) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
};

const AdminBookings = () => {
  const { data: bookings, isLoading } = useAllBookings();
  const { mutate: updateBookingStatus, isPending } = useUpdateBookingStatus();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = (bookings || []).filter(b => {
    if (filterType !== "all" && b.package_type !== filterType) return false;
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search) {
      const formName = String((b.form_data as any)?.fullName || (b.form_data as any)?.name || "").toLowerCase();
      const phone = String((b.form_data as any)?.phone || "").toLowerCase();
      const q = search.toLowerCase();
      if (!formName.includes(q) && !phone.includes(q) && !b.package_name_snapshot.toLowerCase().includes(q) && !b.booking_code.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const advanceStatus = (id: string) => {
    const booking = (bookings || []).find((b) => b.id === id);
    if (!booking) return;
    const next = statusNext[booking.status];
    if (!next) return;

    updateBookingStatus(
      { id, status: next },
      {
        onSuccess: () => toast.success(`${booking.booking_code}: ${booking.status} → ${next}`),
        onError: () => toast.error("Failed to update booking status"),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Booking Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search booking, package, name, phone..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hajj">Hajj</SelectItem>
              <SelectItem value="umrah">Umrah</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.booking_code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{b.package_name_snapshot}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[b.status]} border capitalize`}>{b.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatPrice(b.amount_pkr)}</TableCell>
                    <TableCell>
                      {statusNext[b.status] ? (
                        <Button size="sm" variant="outline" onClick={() => advanceStatus(b.id)} disabled={isPending}>
                          → {statusNext[b.status]}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Done</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
