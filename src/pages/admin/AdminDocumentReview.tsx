import { useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, Download, MessageSquare, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllBookingsWithDocuments, useUpdateBookingStatus } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';

export default function AdminDocumentReview() {
  const { data: bookings = [], isLoading } = useGetAllBookingsWithDocuments();
  const { mutate: updateBookingStatus } = useUpdateBookingStatus();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const normalizePhone = (phone?: string | null) => (phone || '').replace(/[^\d]/g, '');

  const openWhatsApp = (phoneRaw: string | null | undefined, message: string) => {
    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      toast.error('Applicant phone is missing');
      return;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const downloadDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('booking-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download document');
    }
  };

  const resolveDocPath = (doc: any) => doc?.file_path || doc?.file_url || '';

  const bookingsWithDocs = useMemo(
    () => bookings.filter((b: any) => (b.booking_documents || []).length > 0),
    [bookings]
  );

  const getBookingReviewState = (booking: any) => {
    const docs = booking.booking_documents || [];
    const hasPending = docs.some((doc: any) => ['pending', 'requested', 'uploaded'].includes(doc.status));
    const hasRejected = docs.some((doc: any) => doc.status === 'rejected');
    const allApproved = docs.length > 0 && docs.every((doc: any) => doc.status === 'approved');

    if (hasPending) return 'pending';
    if (hasRejected) return 'rejected';
    if (allApproved) return 'approved';
    return 'pending';
  };

  const bookingSummaries = useMemo(
    () =>
      bookingsWithDocs.map((booking: any) => ({
        ...booking,
        reviewState: getBookingReviewState(booking),
        totalDocs: (booking.booking_documents || []).length,
        approvedCount: (booking.booking_documents || []).filter((doc: any) => doc.status === 'approved').length,
        rejectedCount: (booking.booking_documents || []).filter((doc: any) => doc.status === 'rejected').length,
      })),
    [bookingsWithDocs]
  );

  const pendingBookings = bookingSummaries.filter((booking: any) => booking.reviewState === 'pending');
  const approvedBookings = bookingSummaries.filter((booking: any) => booking.reviewState === 'approved');
  const rejectedBookings = bookingSummaries.filter((booking: any) => booking.reviewState === 'rejected');

  const selectedBooking = bookingSummaries.find((booking: any) => booking.id === selectedBookingId) || null;

  const openReviewDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setAdminNotes('');
    setIsDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setIsDialogOpen(false);
    setSelectedBookingId(null);
    setAdminNotes('');
  };

  const submitBookingReview = async (action: 'approve' | 'reject') => {
    if (!selectedBooking) return;
    if (action === 'reject' && !adminNotes.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setIsSubmitting(true);

    try {
      const docIds = (selectedBooking.booking_documents || []).map((doc: any) => doc.id);
      const applicantPhone = selectedBooking?.form_data?.phone || selectedBooking?.applicant_phone;
      const uploadLink = `${window.location.origin}/portal/upload-documents?booking_id=${selectedBooking.id}`;

      const { error: docsError } = await supabase
        .from('booking_documents')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_notes: action === 'reject' ? adminNotes.trim() : null,
          updated_at: new Date().toISOString(),
        })
        .in('id', docIds);

      if (docsError) throw docsError;

      if (action === 'approve') {
        await new Promise<void>((resolve, reject) => {
          updateBookingStatus(
            { id: selectedBooking.id, status: 'visa' },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });

        const approvedMsg = [
          `Assalam o Alaikum! 🕌`,
          ``,
          `✅ Your documents for application *${selectedBooking.booking_code}* have been approved.`,
          ``,
          `Your visa is now *applied / in process* for package *${selectedBooking.package_name_snapshot}*.`,
          ``,
          `We will update you with the next step soon, In sha Allah.`,
          ``,
          `JazakAllah Khair 🤲`,
        ].join('\n');

        openWhatsApp(applicantPhone, approvedMsg);
        toast.success('Application approved and moved to visa stage');
      } else {
        const rejectionMsg = [
          `Assalam o Alaikum! 🕌`,
          ``,
          `Your documents for application *${selectedBooking.booking_code}* need correction before visa processing.`,
          ``,
          `❌ *Reason:*`,
          `${adminNotes.trim()}`,
          ``,
          `Please upload the corrected documents here:`,
          `${uploadLink}`,
          ``,
          `JazakAllah Khair 🤲`,
        ].join('\n');

        openWhatsApp(applicantPhone, rejectionMsg);
        toast.success('Application rejected and applicant notified');
      }

      closeReviewDialog();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update application review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'uploaded':
        return 'bg-blue-50 border-blue-200';
      case 'requested':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'uploaded':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'requested':
        return <MessageSquare className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout sidebar={<AdminSidebar />}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="mt-4 text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Review</h1>
          <p className="text-muted-foreground">Review and approve applicant documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold text-blue-600">{pendingBookings.length}</p>
                </div>
                <Clock className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedBookings.length}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedBookings.length}</p>
                </div>
                <XCircle className="w-10 h-10 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different statuses */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Review ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedBookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Applications */}
          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length === 0 ? (
              <Alert>
                <AlertDescription>No applications pending review</AlertDescription>
              </Alert>
            ) : (
              pendingBookings.map((booking: any) => (
                <Card key={booking.id} className="border-2 border-blue-200 bg-blue-50/40">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <CardTitle>{booking.package_name_snapshot}</CardTitle>
                          <Badge variant="secondary" className="capitalize">
                            {booking.package_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Applicant: {booking.form_data?.fullName || booking.form_data?.firstName || booking.applicant_email}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Booking Code</p>
                        <p className="font-medium">{booking.booking_code}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Documents</p>
                        <p className="font-medium">{booking.totalDocs}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Approved</p>
                        <p className="font-medium">{booking.approvedCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rejected</p>
                        <p className="font-medium">{booking.rejectedCount}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => openReviewDialog(booking.id)}
                        className="gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Check Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Approved Applications */}
          <TabsContent value="approved" className="space-y-4">
            {approvedBookings.length === 0 ? (
              <Alert>
                <AlertDescription>No approved applications yet</AlertDescription>
              </Alert>
            ) : (
              approvedBookings.map((booking: any) => (
                <Card key={booking.id} className="border-2 border-green-200 bg-green-50/40">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <CardTitle>{booking.package_name_snapshot}</CardTitle>
                          <Badge variant="default" className="capitalize">
                            {booking.package_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Application {booking.booking_code} has all documents approved.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewDialog(booking.id)}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Documents
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Rejected Applications */}
          <TabsContent value="rejected" className="space-y-4">
            {rejectedBookings.length === 0 ? (
              <Alert>
                <AlertDescription>No rejected applications</AlertDescription>
              </Alert>
            ) : (
              rejectedBookings.map((booking: any) => (
                <Card key={booking.id} className="border-2 border-red-200 bg-red-50/40">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <CardTitle>{booking.package_name_snapshot}</CardTitle>
                          <Badge variant="destructive" className="capitalize">
                            {booking.package_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Application {booking.booking_code} has rejected documents.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {booking.booking_documents?.some((doc: any) => doc.admin_notes) && (
                      <Alert variant="destructive">
                        <AlertTitle>Latest admin note</AlertTitle>
                        <AlertDescription>
                          {booking.booking_documents.find((doc: any) => doc.admin_notes)?.admin_notes}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewDialog(booking.id)}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Check Docs
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeReviewDialog())}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedBooking ? `Review Documents — ${selectedBooking.booking_code}` : 'Review Documents'}
              </DialogTitle>
              <DialogDescription>
                Review all uploaded documents for this application, then approve or reject the application in one action.
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Applicant</p>
                    <p className="font-medium">{selectedBooking.form_data?.fullName || selectedBooking.form_data?.firstName || selectedBooking.applicant_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Package</p>
                    <p className="font-medium">{selectedBooking.package_name_snapshot}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Status</p>
                    <p className="font-medium capitalize">{selectedBooking.status}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedBooking.booking_documents.map((doc: any) => (
                    <Card key={doc.id} className={`border ${getStatusColor(doc.status)}`}>
                      <CardContent className="pt-5 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(doc.status)}
                              <p className="font-semibold capitalize">{doc.document_type.replace(/_/g, ' ')}</p>
                              <Badge variant="outline" className="capitalize">{doc.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Uploaded {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : '—'}
                            </p>
                            {doc.admin_notes && (
                              <p className="text-sm text-red-700 mt-2">Reason: {doc.admin_notes}</p>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(resolveDocPath(doc))}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            View Document
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Textarea
                  placeholder="Write rejection reason here if you want to reject this application..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="min-h-28"
                />

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={closeReviewDialog} disabled={isSubmitting}>
                    Close
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => submitBookingReview('reject')}
                    disabled={isSubmitting || !adminNotes.trim()}
                  >
                    {isSubmitting ? 'Saving...' : 'Reject Application'}
                  </Button>
                  <Button
                    type="button"
                    variant="gold"
                    onClick={() => submitBookingReview('approve')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Approve Application'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
