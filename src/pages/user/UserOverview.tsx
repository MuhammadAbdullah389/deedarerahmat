import { useNavigate } from "react-router-dom";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, Clock, FileText, Upload, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useUserBookings, useBookingDocuments, useRequiredDocuments, type Booking } from "@/hooks/useSupabase";

// Per-booking alert: checks uploaded docs and shows banner if action needed
function DocUploadAlert({ booking }: { booking: Pick<Booking, 'id' | 'booking_code' | 'package_name_snapshot' | 'package_type'> }) {
  const navigate = useNavigate();
  const { data: uploadedDocs = [] } = useBookingDocuments(booking.id);
  const packageType = booking.package_type === "visa" ? "visa" : booking.package_type === "umrah" ? "umrah" : "hajj";
  const { data: requiredDocs = [] } = useRequiredDocuments(packageType);

  const hasRejected = uploadedDocs.some(d => d.status === 'rejected');
  const requiredTypes = requiredDocs.map((d) => d.document_type);
  const uploadedNonRejectedTypes = new Set(
    uploadedDocs
      .filter((d) => d.status !== 'rejected')
      .map((d) => d.document_type)
  );
  const missingCount = requiredTypes.filter((t) => !uploadedNonRejectedTypes.has(t)).length;
  const uploadedCount = Math.max(requiredTypes.length - missingCount, 0);

  if (!hasRejected && missingCount <= 0) return null;

  return (
    <Alert className="border-amber-300 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 font-semibold">
        {hasRejected ? "Action Required: Document(s) Rejected" : "Action Required: Upload Your Documents"}
      </AlertTitle>
      <AlertDescription className="text-amber-700 mt-1 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="flex-1">
          {hasRejected
            ? `One or more documents for application ${booking.booking_code} (${booking.package_name_snapshot}) were rejected. Please re-upload them.`
            : `Your application ${booking.booking_code} (${booking.package_name_snapshot}) is waiting for documents. Uploaded ${uploadedCount}/${requiredTypes.length}. Please upload remaining documents to proceed.`}
        </span>
        <Button
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 gap-2"
          onClick={() => navigate(`/portal/upload-documents?booking_id=${booking.id}`)}
        >
          <Upload className="w-4 h-4" />
          Upload Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}

const UserOverview = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useUserBookings(user?.id || "");

  const total = bookings?.length || 0;
  const confirmed = bookings?.filter((b) => b.status === "confirmed").length || 0;
  const inProgress = bookings?.filter((b) => b.status === "documents" || b.status === "visa").length || 0;
  const pending = bookings?.filter((b) => b.status === "pending").length || 0;

  // Bookings awaiting document uploads
  const docPendingBookings = (bookings || []).filter(b => b.status === "documents");

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back!</h1>
          <Button variant="gold" className="w-full sm:w-auto" onClick={() => navigate('/dashboard/apply')}>
            Apply Again
          </Button>
        </div>

        {/* Document upload notifications */}
        {!isLoading && docPendingBookings.map(b => (
          <DocUploadAlert key={b.id} booking={b} />
        ))}

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
                <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start">
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
