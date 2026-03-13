import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAllBookings, useCreateBooking, usePackages, useProvisionApplicantCredentials, useUpdateBookingStatus, type Booking } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { Search, Filter, Plus, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type BookingClosureLog = {
  id: string;
  booking_id: string;
  booking_code: string;
  user_id: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  package_name_snapshot: string;
  package_type: 'hajj' | 'umrah' | 'visa' | string;
  status_at_closure: string;
  reason: string;
  closed_by: string | null;
  metadata: any;
  created_at: string;
};

const statusColors: Record<Booking['status'], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  documents: "bg-blue-100 text-blue-800 border-blue-300",
  visa: "bg-purple-100 text-purple-800 border-purple-300",
  confirmed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusNext: Record<Booking['status'], Booking['status'] | null> = {
  pending: 'documents',
  documents: null,
  visa: 'confirmed',
  confirmed: null,
  cancelled: null,
};

const formatPrice = (amount: number | null) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
};

const formatVisaType = (value?: string | null) => {
  if (!value) return "N/A";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const AdminBookings = () => {
  const { data: bookings, isLoading, refetch } = useAllBookings();
  const { data: closureLogs = [], isLoading: isLoadingClosureLogs } = useQuery({
    queryKey: ['booking-closure-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_closure_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as BookingClosureLog[];
    },
  });
  const { mutate: updateBookingStatus, isPending } = useUpdateBookingStatus();
  const { mutateAsync: createBooking, isPending: isCreatingBooking } = useCreateBooking();
  const { mutateAsync: provisionCredentials, isPending: isProvisioning } = useProvisionApplicantCredentials();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [rejectCloseOpen, setRejectCloseOpen] = useState(false);
  const [bookingToClose, setBookingToClose] = useState<Booking | null>(null);
  const [closeReason, setCloseReason] = useState("");
  const [isClosingBooking, setIsClosingBooking] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    applicantEmail: "",
    applicantPhone: "",
    sharingType: "double" as "double" | "triple" | "quad" | "quint",
    amountPkr: "",
    travelDate: "",
    adminNotes: "",
  });
  const [initiateOpen, setInitiateOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [initForm, setInitForm] = useState({
    packageType: "hajj" as "hajj" | "umrah",
    packageId: "",
    fullName: "",
    phone: "",
    email: "",
    sharingType: "double" as "double" | "triple" | "quad" | "quint",
    travelDate: "",
    notes: "",
  });
  const { data: packageOptions = [] } = usePackages(initForm.packageType);

  const normalizePhone = (phone?: string | null) => {
    if (!phone) return "";
    let digits = phone.replace(/[^\d]/g, "");

    // Convert 00-prefixed international format -> plain country code format
    if (digits.startsWith("00")) {
      digits = digits.slice(2);
    }

    // Pakistan common formats:
    // 03001234567 -> 923001234567
    // 3001234567  -> 923001234567
    if (digits.startsWith("0") && digits.length === 11) {
      digits = `92${digits.slice(1)}`;
    } else if (digits.startsWith("3") && digits.length === 10) {
      digits = `92${digits}`;
    }

    return digits;
  };

  const openWhatsAppForDocRequest = (
    booking: Booking,
    options: { email: string; tempPassword?: string; existingPortalUser?: boolean },
    targetWindow?: Window | null
  ) => {
    const phoneRaw = (booking.form_data as any)?.phone || booking.applicant_phone || "";
    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      toast.error("Applicant phone is missing");
      return false;
    }

    const email = options.email || booking.applicant_email || (booking.form_data as any)?.email || "";
    const portalLink = `${window.location.origin}/portal/upload-documents?booking_id=${booking.id}`;
    const signInLink = `${window.location.origin}/auth/sign-in?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(`/portal/upload-documents?booking_id=${booking.id}`)}`;
    const singleLink = options.tempPassword
      ? `${window.location.origin}/portal/password-change?email=${encodeURIComponent(email)}&tmp=${encodeURIComponent(options.tempPassword)}&booking_id=${booking.id}`
      : portalLink;

    const message = options.existingPortalUser
      ? [
          `Assalam o Alaikum! 🕌`,
          ``,
          `Your application *${booking.booking_code}* (${booking.package_name_snapshot}) has been moved to the *Document Request* stage.`,
          ``,
          `Please log in to your existing portal account using your password and email below:`,
          `Email: ${email}`,
          ``,
          `Open your document portal here:`,
          `🔗`,
          `${signInLink}`,
          ``,
          `JazakAllah Khair 🤲`,
        ].join("\n")
      : [
          `Assalam o Alaikum! 🕌`,
          ``,
          `Your application *${booking.booking_code}* (${booking.package_name_snapshot}) has been moved to the *Document Request* stage.`,
          ``,
          `Please click the link below to set your password and upload your required documents:`,
          ``,
          `🔗`,
          `${singleLink}`,
          ``,
          `JazakAllah Khair 🤲`,
        ].join("\n");

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    if (targetWindow && !targetWindow.closed) {
      targetWindow.location.href = waUrl;
      targetWindow.focus();
      return true;
    }

    const opened = window.open(waUrl, "_blank");
    if (!opened) {
      toast.error("Popup blocked. Please allow popups and try again.");
      return false;
    }

    return true;
  };

  const openWhatsAppForBookingRejectionAndClosure = (
    booking: Booking,
    reason: string,
    targetWindow?: Window | null
  ) => {
    const phoneRaw = (booking.form_data as any)?.phone || booking.applicant_phone || "";
    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      toast.error("Applicant phone is missing");
      return false;
    }

    const message = [
      `Assalam o Alaikum! 🕌`,
      ``,
      `Your application *${booking.booking_code}* (${booking.package_name_snapshot}) has been *rejected and closed* by admin.`,
      ``,
      `❌ *Reason:*`,
      `${reason}`,
      ``,
      `If you want to re-apply, please contact our support team on WhatsApp.`,
      ``,
      `JazakAllah Khair 🤲`,
    ].join("\n");

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    if (targetWindow && !targetWindow.closed) {
      targetWindow.location.href = waUrl;
      targetWindow.focus();
      return true;
    }

    const opened = window.open(waUrl, "_blank");
    if (!opened) {
      toast.error("Popup blocked. Please allow popups and try again.");
      return false;
    }

    return true;
  };

  const selectedPackage = packageOptions.find((pkg) => pkg.id === initForm.packageId);
  const sharingKeys: Array<"double" | "triple" | "quad" | "quint"> = ["double", "triple", "quad", "quint"];
  const availableSharingOptions = sharingKeys.filter((key) => {
    const value = selectedPackage?.prices?.[key];
    return typeof value === "number" && value > 0;
  });

  const suggestedAmount = selectedPackage?.prices?.[initForm.sharingType];

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

  const activeBookings = filtered.filter((b) => b.status !== 'cancelled' && b.status !== 'confirmed');
  const completedBookings = filtered.filter((b) => b.status === 'confirmed');
  const rejectedHistoryBookings = filtered.filter((b) => b.status === 'cancelled');
  const filteredClosureLogs = useMemo(() => {
    const q = search.toLowerCase().trim();
    const allowByStatus = filterStatus === 'all' || filterStatus === 'cancelled';
    if (!allowByStatus) return [] as BookingClosureLog[];

    return closureLogs.filter((log) => {
      if (filterType !== 'all' && log.package_type !== filterType) return false;
      if (!q) return true;

      const haystack = [
        log.booking_code,
        log.package_name_snapshot,
        log.applicant_phone || '',
        log.applicant_email || '',
        log.reason || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [closureLogs, filterStatus, filterType, search]);

  const advanceStatus = (id: string) => {
    const booking = (bookings || []).find((b) => b.id === id);
    if (!booking) return;
    const next = statusNext[booking.status];
    if (!next) return;

    // Requested flow: pending -> documents must be confirmed via popup first.
    if (booking.status === 'pending' && next === 'documents') {
      setSelectedBooking(booking);
      setConfirmOpen(true);
      return;
    }

    // When confirming, send a WhatsApp congratulations message.
    if (next === 'confirmed') {
      const popup = window.open("", "_blank");
      updateBookingStatus(
        { id, status: 'confirmed' },
        {
          onSuccess: () => {
            toast.success(`${booking.booking_code}: visa → confirmed`);
            const phoneRaw = (booking.form_data as any)?.phone || booking.applicant_phone || "";
            const phone = normalizePhone(phoneRaw);
            if (phone) {
              const msg = [
                `Assalam o Alaikum! 🕌`,
                ``,
                `✅ *Mubarak!* Your application *${booking.booking_code}* for *${booking.package_name_snapshot}* has been *Confirmed*.`,
                ``,
                `We will share your travel tickets and complete journey guide with you shortly, In sha Allah. 🤲`,
                ``,
                `Please stay in touch and feel free to reach out if you have any questions.`,
                ``,
                `JazakAllah Khair 🤲`,
              ].join("\n");
              const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
              if (popup && !popup.closed) {
                popup.location.href = waUrl;
                popup.focus();
              } else {
                window.open(waUrl, "_blank");
              }
            } else {
              if (popup && !popup.closed) popup.close();
              toast.warning("Booking confirmed but applicant phone is missing — WhatsApp not sent.");
            }
          },
          onError: () => {
            if (popup && !popup.closed) popup.close();
            toast.error("Failed to update booking status");
          },
        }
      );
      return;
    }

    updateBookingStatus(
      { id, status: next },
      {
        onSuccess: () => toast.success(`${booking.booking_code}: ${booking.status} → ${next}`),
        onError: () => toast.error("Failed to update booking status"),
      }
    );
  };

  const confirmMoveToDocuments = async () => {
    if (!selectedBooking) return;
    const booking = selectedBooking;
    const popup = window.open("", "_blank");

    try {
      const existingPortalUser = Boolean(booking.user_id);
      const email = booking.applicant_email || (booking.form_data as any)?.email || "";
      const credentials = existingPortalUser ? null : await provisionCredentials({ bookingId: booking.id });

      updateBookingStatus(
        { id: booking.id, status: 'documents' },
        {
          onSuccess: () => {
            toast.success(`${booking.booking_code}: pending → documents`);
            openWhatsAppForDocRequest(booking, {
              email: credentials?.email || email,
              tempPassword: credentials?.tempPassword,
              existingPortalUser,
            }, popup);
            setConfirmOpen(false);
            setSelectedBooking(null);
          },
          onError: () => {
            if (popup && !popup.closed) popup.close();
            toast.error("Failed to update booking status");
          },
        }
      );
    } catch (error: any) {
      if (popup && !popup.closed) popup.close();
      toast.error(error?.message || "Failed to generate applicant credentials. Ensure Edge Function is deployed.");
    }
  };

  const updateStatusAsync = (id: string, status: Booking['status']) =>
    new Promise<void>((resolve, reject) => {
      updateBookingStatus(
        { id, status },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      );
    });

  const resetInitForm = () => {
    setInitForm({
      packageType: "hajj",
      packageId: "",
      fullName: "",
      phone: "",
      email: "",
      sharingType: "double",
      travelDate: "",
      notes: "",
    });
  };

  const handleInitiateApplication = async () => {
    if (!initForm.packageId || !selectedPackage || !initForm.fullName || !initForm.phone || !initForm.email) {
      toast.error("Please select package and fill name, phone and email");
      return;
    }

    if (!availableSharingOptions.includes(initForm.sharingType)) {
      toast.error("Selected sharing option is not available in this package");
      return;
    }

    const popup = window.open("", "_blank");

    try {
      const booking = await createBooking({
        user_id: null,
        package_id: selectedPackage.id,
        package_name_snapshot: selectedPackage.name,
        package_type: initForm.packageType,
        sharing_type: initForm.sharingType,
        amount_pkr: typeof suggestedAmount === "number" ? suggestedAmount : null,
        status: 'pending',
        travel_date: initForm.travelDate || null,
        applicant_email: initForm.email,
        applicant_phone: initForm.phone,
        temp_password_token: null,
        temp_password_expires_at: null,
        password_reset_required: false,
        form_data: {
          fullName: initForm.fullName,
          phone: initForm.phone,
          email: initForm.email,
          notes: initForm.notes || undefined,
          source: 'admin_initiated',
        },
        admin_notes: initForm.notes || null,
      });

      const credentials = await provisionCredentials({ bookingId: booking.id });
      await updateStatusAsync(booking.id, 'documents');

      openWhatsAppForDocRequest(booking as Booking, {
        email: credentials.email,
        tempPassword: credentials.tempPassword,
      }, popup);

      toast.success(`Application ${booking.booking_code} initiated and onboarding sent`);
      setInitiateOpen(false);
      resetInitForm();
    } catch (error: any) {
      if (popup && !popup.closed) popup.close();
      toast.error(error?.message || "Failed to initiate application");
    }
  };

  const openBookingDetails = (booking: Booking) => {
    setDetailsBooking(booking);
    setDetailsOpen(true);
  };

  const openEditDetails = () => {
    if (!detailsBooking) return;
    setEditForm({
      fullName: String((detailsBooking.form_data as any)?.fullName || (detailsBooking.form_data as any)?.name || ""),
      applicantEmail: detailsBooking.applicant_email || String((detailsBooking.form_data as any)?.email || ""),
      applicantPhone: detailsBooking.applicant_phone || String((detailsBooking.form_data as any)?.phone || ""),
      sharingType: (detailsBooking.sharing_type || "double") as "double" | "triple" | "quad" | "quint",
      amountPkr: detailsBooking.amount_pkr != null ? String(detailsBooking.amount_pkr) : "",
      travelDate: detailsBooking.travel_date || "",
      adminNotes: detailsBooking.admin_notes || "",
    });
    setEditOpen(true);
  };

  const openRejectCloseDialog = (booking: Booking) => {
    setBookingToClose(booking);
    setCloseReason("");
    setRejectCloseOpen(true);
  };

  const handleRejectAndCloseBooking = async () => {
    if (!bookingToClose) return;
    if (!closeReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    const popup = window.open("", "_blank");
    setIsClosingBooking(true);

    try {
      const whatsappOpened = openWhatsAppForBookingRejectionAndClosure(bookingToClose, closeReason.trim(), popup);
      if (!whatsappOpened) {
        if (popup && !popup.closed) popup.close();
        return;
      }

      const {
        data: { user: actingUser },
      } = await supabase.auth.getUser();

      const { error: auditError } = await supabase
        .from('booking_closure_logs')
        .insert([
          {
            booking_id: bookingToClose.id,
            booking_code: bookingToClose.booking_code,
            user_id: bookingToClose.user_id,
            applicant_email: bookingToClose.applicant_email || (bookingToClose.form_data as any)?.email || null,
            applicant_phone: bookingToClose.applicant_phone || (bookingToClose.form_data as any)?.phone || null,
            package_name_snapshot: bookingToClose.package_name_snapshot,
            package_type: bookingToClose.package_type,
            status_at_closure: bookingToClose.status,
            reason: closeReason.trim(),
            closed_by: actingUser?.id || null,
            metadata: {
              form_data: bookingToClose.form_data || {},
              sharing_type: bookingToClose.sharing_type,
              amount_pkr: bookingToClose.amount_pkr,
              travel_date: bookingToClose.travel_date,
              admin_notes: bookingToClose.admin_notes,
            },
          },
        ]);

      if (auditError) {
        const auditDebug = {
          code: (auditError as any)?.code,
          message: (auditError as any)?.message,
          details: (auditError as any)?.details,
          hint: (auditError as any)?.hint,
        };
        console.error('booking_closure_logs insert failed:', auditDebug);
        toast.error(
          `Audit log failed (${auditDebug.code || 'no-code'}): ${auditDebug.message || 'Unknown error'}`
        );
        return;
      }

      const { error: docsDeleteError } = await supabase
        .from('booking_documents')
        .delete()
        .eq('booking_id', bookingToClose.id);

      if (docsDeleteError) throw docsDeleteError;

      const { error: bookingDeleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingToClose.id);

      if (bookingDeleteError) throw bookingDeleteError;

      toast.success(`Booking ${bookingToClose.booking_code} rejected, notified, and closed`);
      setRejectCloseOpen(false);
      setBookingToClose(null);
      setCloseReason("");
      await refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject and close booking");
    } finally {
      setIsClosingBooking(false);
    }
  };

  const handleSaveBookingDetails = async () => {
    if (!detailsBooking) return;

    setIsSavingEdit(true);
    try {
      const baseFormData = detailsBooking.form_data && typeof detailsBooking.form_data === 'object'
        ? detailsBooking.form_data
        : {};

      const nextFormData = {
        ...baseFormData,
        fullName: editForm.fullName,
        name: editForm.fullName,
        email: editForm.applicantEmail,
        phone: editForm.applicantPhone,
      };

      const amountValue = editForm.amountPkr.trim() === "" ? null : Number(editForm.amountPkr);
      if (amountValue !== null && Number.isNaN(amountValue)) {
        toast.error("Amount must be a valid number");
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({
          applicant_email: editForm.applicantEmail || null,
          applicant_phone: editForm.applicantPhone || null,
          sharing_type: editForm.sharingType,
          amount_pkr: amountValue,
          travel_date: editForm.travelDate || null,
          admin_notes: editForm.adminNotes || null,
          form_data: nextFormData,
        })
        .eq('id', detailsBooking.id)
        .select()
        .single();

      if (error) throw error;

      setDetailsBooking(data as Booking);
      await refetch();
      setEditOpen(false);
      toast.success("Booking details updated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update booking details");
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="font-display text-2xl font-bold text-foreground">Booking Management</h1>
          <Button variant="gold" className="gap-2" onClick={() => setInitiateOpen(true)}>
            <Plus className="h-4 w-4" /> Initiate Application
          </Button>
        </div>

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
              <SelectItem value="confirmed">Completed</SelectItem>
              <SelectItem value="cancelled">Rejected/Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <div className="px-6 pt-5 pb-2">
            <h2 className="text-lg font-semibold text-foreground">Active Applications</h2>
          </div>
          <CardContent className="p-0">
            <div className="hidden md:block">
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
                  ) : activeBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.booking_code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p>{b.package_name_snapshot}</p>
                          {b.package_type === 'visa' && (
                            <p className="text-xs text-muted-foreground">Visa Type: {formatVisaType((b.form_data as any)?.visaType)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[b.status]} border capitalize`}>{b.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatPrice(b.amount_pkr)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 items-start">
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => openBookingDetails(b)}>
                            <Eye className="h-4 w-4" /> View More
                          </Button>

                          {b.status === 'documents' ? (
                            <span className="text-xs text-muted-foreground">Waiting for docs approval</span>
                          ) : statusNext[b.status] ? (
                            <Button size="sm" variant="outline" onClick={() => advanceStatus(b.id)} disabled={isPending}>
                              → {statusNext[b.status]}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Done</span>
                          )}

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRejectCloseDialog(b)}
                            disabled={isClosingBooking}
                          >
                            Reject & Close
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 w-full" />)
                : activeBookings.map((b) => (
                    <div key={b.id} className="rounded-lg border p-4 bg-card space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{b.booking_code}</p>
                          <p className="font-semibold">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                        </div>
                        <Badge className={`${statusColors[b.status]} border capitalize`}>{b.status}</Badge>
                      </div>

                      <div className="text-sm">
                        <p>{b.package_name_snapshot}</p>
                        {b.package_type === 'visa' && (
                          <p className="text-xs text-muted-foreground">Visa Type: {formatVisaType((b.form_data as any)?.visaType)}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Amount: {formatPrice(b.amount_pkr)}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openBookingDetails(b)}>
                          <Eye className="h-4 w-4" /> View More
                        </Button>
                        {b.status === 'documents' ? (
                          <span className="text-xs text-muted-foreground">Waiting for docs approval</span>
                        ) : statusNext[b.status] ? (
                          <Button size="sm" variant="outline" onClick={() => advanceStatus(b.id)} disabled={isPending}>
                            → {statusNext[b.status]}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Done</span>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => openRejectCloseDialog(b)} disabled={isClosingBooking}>
                          Reject & Close
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>

            {!isLoading && activeBookings.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No active applications found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 pt-5 pb-2">
            <h2 className="text-lg font-semibold text-foreground">Completed Applications</h2>
            <p className="text-xs text-muted-foreground mt-1">Applications that have completed all workflow stages.</p>
          </div>
          <CardContent className="p-0">
            <div className="hidden md:block">
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
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : completedBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.booking_code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p>{b.package_name_snapshot}</p>
                          {b.package_type === 'visa' && (
                            <p className="text-xs text-muted-foreground">Visa Type: {formatVisaType((b.form_data as any)?.visaType)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors.confirmed} border capitalize`}>completed</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatPrice(b.amount_pkr)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => openBookingDetails(b)}>
                          <Eye className="h-4 w-4" /> View More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
                : completedBookings.map((b) => (
                    <div key={b.id} className="rounded-lg border p-4 bg-card space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{b.booking_code}</p>
                          <p className="font-semibold">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                        </div>
                        <Badge className={`${statusColors.confirmed} border capitalize`}>completed</Badge>
                      </div>
                      <p className="text-sm">{b.package_name_snapshot}</p>
                      <p className="text-xs text-muted-foreground">Amount: {formatPrice(b.amount_pkr)}</p>
                      <Button size="sm" variant="outline" className="w-full gap-1" onClick={() => openBookingDetails(b)}>
                        <Eye className="h-4 w-4" /> View More
                      </Button>
                    </div>
                  ))}
            </div>

            {!isLoading && completedBookings.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No completed applications found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 pt-5 pb-2">
            <h2 className="text-lg font-semibold text-foreground">Cancellation History</h2>
            <p className="text-xs text-muted-foreground mt-1">These applications are closed and have no active actions.</p>
          </div>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || isLoadingClosureLogs ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      {rejectedHistoryBookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-mono text-xs">{b.booking_code}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              <p>{b.package_name_snapshot}</p>
                              {b.package_type === 'visa' && (
                                <p className="text-xs text-muted-foreground">Visa Type: {formatVisaType((b.form_data as any)?.visaType)}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[b.status]} border capitalize`}>{b.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{formatPrice(b.amount_pkr)}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[280px] truncate" title={b.admin_notes || ''}>
                            {b.admin_notes || '—'}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => openBookingDetails(b)}>
                              <Eye className="h-4 w-4" /> View More
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {filteredClosureLogs.map((log) => (
                        <TableRow key={`log-${log.id}`}>
                          <TableCell className="font-mono text-xs">{log.booking_code}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{log.metadata?.form_data?.fullName || log.metadata?.form_data?.name || log.applicant_email || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">{log.applicant_phone || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              <p>{log.package_name_snapshot}</p>
                              {log.package_type === 'visa' && (
                                <p className="text-xs text-muted-foreground">Visa Type: {formatVisaType(log.metadata?.form_data?.visaType)}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors.cancelled} border capitalize`}>cancelled</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{formatPrice(log.metadata?.amount_pkr ?? null)}</TableCell>
                          <TableCell className="hidden md:table-cell max-w-[280px] truncate" title={log.reason || ''}>
                            {log.reason || '—'}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">Archived</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {isLoading || isLoadingClosureLogs ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
              ) : (
                <>
                  {rejectedHistoryBookings.map((b) => (
                    <div key={b.id} className="rounded-lg border p-4 bg-card space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{b.booking_code}</p>
                          <p className="font-semibold">{(b.form_data as any)?.fullName || (b.form_data as any)?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{(b.form_data as any)?.phone || '-'}</p>
                        </div>
                        <Badge className={`${statusColors[b.status]} border capitalize`}>{b.status}</Badge>
                      </div>
                      <p className="text-sm">{b.package_name_snapshot}</p>
                      <p className="text-xs text-muted-foreground">Amount: {formatPrice(b.amount_pkr)}</p>
                      <p className="text-xs text-muted-foreground">Reason: {b.admin_notes || '—'}</p>
                      <Button size="sm" variant="outline" className="w-full gap-1" onClick={() => openBookingDetails(b)}>
                        <Eye className="h-4 w-4" /> View More
                      </Button>
                    </div>
                  ))}

                  {filteredClosureLogs.map((log) => (
                    <div key={`mobile-log-${log.id}`} className="rounded-lg border p-4 bg-card space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{log.booking_code}</p>
                          <p className="font-semibold">{log.metadata?.form_data?.fullName || log.metadata?.form_data?.name || log.applicant_email || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{log.applicant_phone || '-'}</p>
                        </div>
                        <Badge className={`${statusColors.cancelled} border capitalize`}>cancelled</Badge>
                      </div>
                      <p className="text-sm">{log.package_name_snapshot}</p>
                      <p className="text-xs text-muted-foreground">Amount: {formatPrice(log.metadata?.amount_pkr ?? null)}</p>
                      <p className="text-xs text-muted-foreground">Reason: {log.reason || '—'}</p>
                      <span className="text-xs text-muted-foreground">Archived</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {!isLoading && !isLoadingClosureLogs && rejectedHistoryBookings.length === 0 && filteredClosureLogs.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No cancellation history found.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Document Request</DialogTitle>
              <DialogDescription>
                Do you confirm changing status from pending to documents request? A pre-filled WhatsApp message will open for sending credentials/login links.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={confirmMoveToDocuments} disabled={isPending || isProvisioning}>
                {isProvisioning ? "Generating credentials..." : isPending ? "Updating..." : "Yes, Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={initiateOpen} onOpenChange={setInitiateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Initiate Hajj/Umrah Application</DialogTitle>
              <DialogDescription>
                Create an application on behalf of a WhatsApp lead and send portal onboarding credentials.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Package Type *</Label>
                <Select value={initForm.packageType} onValueChange={(v: "hajj" | "umrah") => setInitForm((p) => ({ ...p, packageType: v, packageId: "", sharingType: "double", amountPkr: "" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hajj">Hajj</SelectItem>
                    <SelectItem value="umrah">Umrah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Package *</Label>
                <Select
                  value={initForm.packageId}
                  onValueChange={(v) => setInitForm((p) => ({ ...p, packageId: v, sharingType: "double" }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select existing package" /></SelectTrigger>
                  <SelectContent>
                    {packageOptions.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>{pkg.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Applicant Name *</Label>
                <Input
                  value={initForm.fullName}
                  onChange={(e) => setInitForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={initForm.phone}
                  onChange={(e) => setInitForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="03XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={initForm.email}
                  onChange={(e) => setInitForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="applicant@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Sharing Type</Label>
                <Select value={initForm.sharingType} onValueChange={(v: "double" | "triple" | "quad" | "quint") => setInitForm((p) => ({ ...p, sharingType: v }))} disabled={!initForm.packageId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableSharingOptions.length > 0 ? (
                      availableSharingOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__none" disabled>No options - select package first</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount (PKR)</Label>
                <Input
                  value={typeof suggestedAmount === "number" ? suggestedAmount.toLocaleString() : "Select package and sharing first"}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Travel Date</Label>
                <Input
                  type="date"
                  value={initForm.travelDate}
                  onChange={(e) => setInitForm((p) => ({ ...p, travelDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Input
                value={initForm.notes}
                onChange={(e) => setInitForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Optional notes from WhatsApp discussion"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setInitiateOpen(false); resetInitForm(); }}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleInitiateApplication} disabled={isCreatingBooking || isProvisioning || isPending}>
                {isCreatingBooking || isProvisioning || isPending ? "Processing..." : "Create & Send Onboarding"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                {detailsBooking ? `Complete details for ${detailsBooking.booking_code}` : "Complete booking details"}
              </DialogDescription>
            </DialogHeader>

            {detailsBooking && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Booking Code:</span> <span className="font-medium">{detailsBooking.booking_code}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{detailsBooking.status}</span></div>
                  <div><span className="text-muted-foreground">Package:</span> <span className="font-medium">{detailsBooking.package_name_snapshot}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{detailsBooking.package_type}</span></div>
                  {detailsBooking.package_type === 'visa' && (
                    <div><span className="text-muted-foreground">Visa Type:</span> <span className="font-medium">{formatVisaType((detailsBooking.form_data as any)?.visaType)}</span></div>
                  )}
                  <div><span className="text-muted-foreground">Sharing:</span> <span className="font-medium capitalize">{detailsBooking.sharing_type || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{formatPrice(detailsBooking.amount_pkr)}</span></div>
                  <div><span className="text-muted-foreground">Travel Date:</span> <span className="font-medium">{detailsBooking.travel_date || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground">Applicant Email:</span> <span className="font-medium">{detailsBooking.applicant_email || (detailsBooking.form_data as any)?.email || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground">Applicant Phone:</span> <span className="font-medium">{detailsBooking.applicant_phone || (detailsBooking.form_data as any)?.phone || 'N/A'}</span></div>
                  <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{new Date(detailsBooking.created_at).toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Updated:</span> <span className="font-medium">{new Date(detailsBooking.updated_at).toLocaleString()}</span></div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Admin Notes</p>
                  <div className="rounded-md border p-3 bg-muted/30">
                    {detailsBooking.admin_notes || '—'}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1">Form Data</p>
                  <pre className="rounded-md border p-3 bg-muted/30 overflow-x-auto text-xs whitespace-pre-wrap break-words">
{JSON.stringify(detailsBooking.form_data || {}, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="gold" onClick={openEditDetails}>Edit Details</Button>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Booking Details</DialogTitle>
              <DialogDescription>
                Update applicant and booking details for {detailsBooking?.booking_code || "this booking"}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Applicant Name</Label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editForm.applicantEmail}
                  onChange={(e) => setEditForm((p) => ({ ...p, applicantEmail: e.target.value }))}
                  placeholder="applicant@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editForm.applicantPhone}
                  onChange={(e) => setEditForm((p) => ({ ...p, applicantPhone: e.target.value }))}
                  placeholder="03XXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label>Sharing Type</Label>
                <Select
                  value={editForm.sharingType}
                  onValueChange={(v: "double" | "triple" | "quad" | "quint") => setEditForm((p) => ({ ...p, sharingType: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="triple">Triple</SelectItem>
                    <SelectItem value="quad">Quad</SelectItem>
                    <SelectItem value="quint">Quint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount (PKR)</Label>
                <Input
                  value={editForm.amountPkr}
                  onChange={(e) => setEditForm((p) => ({ ...p, amountPkr: e.target.value.replace(/[^\d]/g, "") }))}
                  placeholder="e.g. 450000"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Travel Date</Label>
                <Input
                  type="date"
                  value={editForm.travelDate}
                  onChange={(e) => setEditForm((p) => ({ ...p, travelDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm((p) => ({ ...p, adminNotes: e.target.value }))}
                  placeholder="Internal notes"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSavingEdit}>Cancel</Button>
              <Button variant="gold" onClick={handleSaveBookingDetails} disabled={isSavingEdit}>
                {isSavingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={rejectCloseOpen} onOpenChange={setRejectCloseOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Reject & Close Booking</DialogTitle>
              <DialogDescription>
                {bookingToClose
                  ? `Provide a reason to reject and close booking ${bookingToClose.booking_code}. A pre-filled WhatsApp message will open, then this booking will be deleted.`
                  : "Provide reason to reject and close this booking."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label>Reason *</Label>
              <Textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="Write rejection/closure reason for the applicant"
                rows={5}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectCloseOpen(false);
                  setBookingToClose(null);
                  setCloseReason("");
                }}
                disabled={isClosingBooking}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectAndCloseBooking}
                disabled={isClosingBooking || !closeReason.trim()}
              >
                {isClosingBooking ? "Closing..." : "Reject & Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
