import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, CheckCircle2, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { useRequiredDocuments, useBookingDocuments, useUploadBookingDocument } from '@/hooks/useSupabase';

interface BookingData {
  id: string;
  package_type: 'hajj' | 'umrah';
  package_name_snapshot: string;
  form_data: any;
}

export default function DocumentUploadPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingDocs, setUploadingDocs] = useState<Set<string>>(new Set());

  const bookingId = searchParams.get('booking_id') || '';
  const { data: requiredDocs = [] } = useRequiredDocuments(booking?.package_type || 'hajj');
  const { data: uploadedDocs = [], refetch: refetchDocs } = useBookingDocuments(bookingId);
  const { mutate: uploadDocument } = useUploadBookingDocument();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        setBooking(data as BookingData);
      } catch (err: any) {
        toast.error('Failed to load application');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  const handleFileUpload = (docType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingDocs(prev => new Set(prev).add(docType));

    uploadDocument(
      {
        bookingId,
        documentType: docType,
        file,
      },
      {
        onSuccess: () => {
          toast.success('Document uploaded successfully');
          refetchDocs();
          setUploadingDocs(prev => {
            const next = new Set(prev);
            next.delete(docType);
            return next;
          });
        },
        onError: (err: any) => {
          toast.error(`Failed to upload ${docType}`);
          setUploadingDocs(prev => {
            const next = new Set(prev);
            next.delete(docType);
            return next;
          });
        },
      }
    );
  };

  const getDocumentStatus = (docType: string) => {
    const uploaded = uploadedDocs.find(d => d.document_type === docType);
    if (!uploaded) return 'pending';
    return uploaded.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'requested':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-600" />;
      case 'uploaded':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const allDocsApproved = requiredDocs.length > 0 && requiredDocs.every(
    doc => getDocumentStatus(doc.document_type) === 'approved'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-muted-foreground">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find your application. Please check the link and try again.
          </p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-accent/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Document Upload Portal</h1>
          <p className="text-muted-foreground">
            Application: <strong className="text-foreground">{booking.package_name_snapshot}</strong>
          </p>
        </div>

        {/* Status Alert */}
        {allDocsApproved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              All documents have been approved! Your application is being processed.
            </AlertDescription>
          </Alert>
        )}

        {/* Documents Grid */}
        <div className="space-y-4">
          {requiredDocs.map((doc) => {
            const uploaded = uploadedDocs.find(d => d.document_type === doc.document_type);
            const status = getDocumentStatus(doc.document_type);
            const isUploading = uploadingDocs.has(doc.document_type);

            return (
              <Card key={doc.document_type} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{doc.display_name}</CardTitle>
                        <Badge
                          variant={
                            status === 'approved'
                              ? 'default'
                              : status === 'rejected'
                              ? 'destructive'
                              : status === 'uploaded'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="gap-1"
                        >
                          {getStatusIcon(status)}
                          <span className="capitalize">{status}</span>
                        </Badge>
                      </div>
                      {doc.description && (
                        <CardDescription className="mt-1">{doc.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {uploaded?.admin_notes && (
                    <Alert variant="destructive" className="text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Admin notes: {uploaded.admin_notes}
                      </AlertDescription>
                    </Alert>
                  )}

                  {status !== 'approved' && (
                    <div>
                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-accent/50 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {isUploading
                            ? 'Uploading...'
                            : uploaded
                            ? 'Click to replace'
                            : 'Click to upload'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={handleFileUpload(doc.document_type)}
                          disabled={isUploading || status === 'approved'}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Max file size: 5MB (JPG, PNG, PDF)
                      </p>
                    </div>
                  )}

                  {uploaded && (
                    <div className="text-xs text-muted-foreground">
                      <p>
                        Uploaded: {new Date(uploaded.uploaded_at).toLocaleDateString()}
                      </p>
                      <p>Size: {(uploaded.file_size_bytes / 1024).toFixed(2)} KB</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Please ensure all documents are clear and legible. 
            Once approved, your application will move to the next stage.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
          {user && (
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
