import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, XCircle, Clock, Eye, Download, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllBookingsWithDocuments, useUpdateDocumentStatus } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';

export default function AdminDocumentReview() {
  const { data: bookings = [], isLoading } = useGetAllBookingsWithDocuments();
  const { mutate: updateDocStatus, isPending } = useUpdateDocumentStatus();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject'>('approve');

  const handleDocumentAction = (docId: string, docAction: 'approve' | 'reject') => {
    setSelectedDocId(docId);
    setAction(docAction);
    setAdminNotes('');
  };

  const submitDocumentAction = () => {
    if (!selectedDocId) return;

    updateDocStatus(
      {
        documentId: selectedDocId,
        status: action === 'approve' ? 'approved' : 'rejected',
        adminNotes: adminNotes || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Document ${action === 'approve' ? 'approved' : 'rejected'}`);
          setSelectedDocId(null);
          setAdminNotes('');
        },
        onError: () => {
          toast.error('Failed to update document status');
        },
      }
    );
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

  // Filter bookings that have documents
  const bookingsWithDocs = bookings.filter((b: any) => b.booking_documents?.length > 0);

  // Group by status
  const pendingDocs = bookingsWithDocs.flatMap((b: any) =>
    b.booking_documents.map((d: any) => ({ ...d, booking: b }))
  ).filter((d: any) => d.status === 'uploaded');

  const approvedDocs = bookingsWithDocs.flatMap((b: any) =>
    b.booking_documents.map((d: any) => ({ ...d, booking: b }))
  ).filter((d: any) => d.status === 'approved');

  const rejectedDocs = bookingsWithDocs.flatMap((b: any) =>
    b.booking_documents.map((d: any) => ({ ...d, booking: b }))
  ).filter((d: any) => d.status === 'rejected');

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
                  <p className="text-3xl font-bold text-blue-600">{pendingDocs.length}</p>
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
                  <p className="text-3xl font-bold text-green-600">{approvedDocs.length}</p>
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
                  <p className="text-3xl font-bold text-red-600">{rejectedDocs.length}</p>
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
              Pending Review ({pendingDocs.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedDocs.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedDocs.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Documents */}
          <TabsContent value="pending" className="space-y-4">
            {pendingDocs.length === 0 ? (
              <Alert>
                <AlertDescription>No documents pending review</AlertDescription>
              </Alert>
            ) : (
              pendingDocs.map((doc: any) => (
                <Card key={doc.id} className={`border-2 ${getStatusColor(doc.status)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(doc.status)}
                          <CardTitle>
                            {doc.document_type.replace(/_/g, ' ').toUpperCase()}
                          </CardTitle>
                          <Badge variant="secondary" className="capitalize">
                            {doc.booking.package_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Application: {doc.booking.package_name_snapshot} | Applicant:{' '}
                          {doc.booking.form_data?.fullName || doc.booking.form_data?.firstName}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Uploaded</p>
                        <p className="font-medium">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">File Size</p>
                        <p className="font-medium">
                          {(doc.file_size_bytes / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc.file_path)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        View Document
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleDocumentAction(doc.id, 'approve')}
                            className="gap-2 flex-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Document</DialogTitle>
                            <DialogDescription>
                              Add optional notes before approving
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            placeholder="Add notes (optional)..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="min-h-24"
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSelectedDocId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant="gold"
                              disabled={isPending}
                              onClick={submitDocumentAction}
                            >
                              {isPending ? 'Approving...' : 'Approve Document'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDocumentAction(doc.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Document</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejection
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            placeholder="Reason for rejection..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            required
                            className="min-h-24"
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSelectedDocId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={isPending || !adminNotes.trim()}
                              onClick={submitDocumentAction}
                            >
                              {isPending ? 'Rejecting...' : 'Reject Document'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Approved Documents */}
          <TabsContent value="approved" className="space-y-4">
            {approvedDocs.length === 0 ? (
              <Alert>
                <AlertDescription>No approved documents yet</AlertDescription>
              </Alert>
            ) : (
              approvedDocs.map((doc: any) => (
                <Card key={doc.id} className={`border-2 ${getStatusColor(doc.status)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(doc.status)}
                          <CardTitle>
                            {doc.document_type.replace(/_/g, ' ').toUpperCase()}
                          </CardTitle>
                          <Badge variant="default" className="capitalize">
                            {doc.booking.package_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Application: {doc.booking.package_name_snapshot}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc.file_path)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Rejected Documents */}
          <TabsContent value="rejected" className="space-y-4">
            {rejectedDocs.length === 0 ? (
              <Alert>
                <AlertDescription>No rejected documents</AlertDescription>
              </Alert>
            ) : (
              rejectedDocs.map((doc: any) => (
                <Card key={doc.id} className={`border-2 ${getStatusColor(doc.status)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(doc.status)}
                          <CardTitle>
                            {doc.document_type.replace(/_/g, ' ').toUpperCase()}
                          </CardTitle>
                          <Badge variant="destructive" className="capitalize">
                            {doc.booking.package_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Application: {doc.booking.package_name_snapshot}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {doc.admin_notes && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          <strong>Reason:</strong> {doc.admin_notes}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc.file_path)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      View Rejected Document
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
