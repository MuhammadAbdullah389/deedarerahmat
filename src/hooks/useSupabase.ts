import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { PackageType } from '@/data/packages';

// ========== TYPES ==========
export interface SupabasePackage {
  id: string;
  name: string;
  slug: string;
  type: 'hajj' | 'umrah';
  duration_text: string;
  description: string;
  featured: boolean;
  active: boolean;
  image_url: string;
  flight_info: any;
  return_flight_info: any;
  itinerary: any[];
  package_details: string[];
  requirements: string[];
  notes: string[];
  overseas_discount: string | null;
}

export interface PackagePrice {
  id: string;
  package_id: string;
  sharing: 'double' | 'triple' | 'quad' | 'quint';
  price_pkr: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah' | 'Aziziya';
  distance_meters: number;
  active: boolean;
}

export interface Booking {
  id: string;
  booking_code: string;
  user_id: string | null;
  package_id: string | null;
  package_name_snapshot: string;
  package_type: 'hajj' | 'umrah' | 'visa';
  sharing_type: 'double' | 'triple' | 'quad' | 'quint' | null;
  amount_pkr: number | null;
  status: 'pending' | 'documents' | 'visa' | 'confirmed' | 'cancelled';
  travel_date: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  temp_password_token: string | null;
  temp_password_expires_at: string | null;
  password_reset_required: boolean;
  form_data: any;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string | null;
  name: string;
  location: string | null;
  rating: number;
  text: string;
  package_type: 'hajj' | 'umrah' | null;
  status: 'pending' | 'approved' | 'rejected';
  published_at: string | null;
  created_at: string;
}

export interface VisaInquiry {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  country: string;
  passport_no: string | null;
  travel_date: string | null;
  message: string | null;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  user_id: string | null;
  full_name: string;
  phone: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export interface BookingDocument {
  id: string;
  booking_id: string;
  document_type: 'passport' | 'cnic' | 'photo' | 'vaccination_certificate' | 'bank_statement' | 'travel_itinerary' | 'hotel_booking';
  file_path: string;
  file_url?: string | null;
  file_name?: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected' | 'requested';
  admin_notes: string | null;
  uploaded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequiredDocument {
  id: string;
  document_type: string;
  display_name: string;
  description: string | null;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  profile?: {
    id: string;
    full_name: string | null;
    phone: string | null;
  } | null;
  unread_count?: number;
  last_message_preview?: string | null;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'user' | 'admin';
  message_text: string;
  is_read: boolean;
  delivered_at: string | null;
  seen_at: string | null;
  created_at: string;
}

export interface PackageUpsertInput {
  id?: string;
  name: string;
  type: 'hajj' | 'umrah';
  duration_text: string;
  description?: string;
  featured?: boolean;
  active?: boolean;
  image_url?: string;
  flight_info?: any;
  return_flight_info?: any;
  itinerary?: any[];
  package_details?: string[];
  requirements?: string[];
  notes?: string[];
  overseas_discount?: string | null;
  prices: Partial<Record<'double' | 'triple' | 'quad' | 'quint', number>>;
  hotel_ids?: string[];
}

const mapDbPackageToUiPackage = (pkg: any): PackageType => {
  const prices = (pkg.package_prices || []).reduce((acc: Record<string, number>, p: any) => {
    if (p.sharing && p.price_pkr) acc[p.sharing] = p.price_pkr;
    return acc;
  }, {});

  return {
    id: pkg.id,
    name: pkg.name,
    type: pkg.type,
    duration: pkg.duration_text || '',
    prices,
    hotels: (pkg.package_hotels || []).map((ph: any) => ({
      name: ph.hotels?.name || 'Hotel',
      city: ph.hotels?.city || '',
      distance: ph.hotels?.distance_meters ? `${ph.hotels.distance_meters}m` : '',
    })),
    services: (pkg.package_services || []).map((s: any) => s.service_text),
    inclusions: (pkg.package_inclusions || []).map((i: any) => i.inclusion_text),
    image: pkg.image_url || 'default',
    featured: pkg.featured,
    itinerary: pkg.itinerary || [],
    flightInfo: pkg.flight_info || undefined,
    returnFlightInfo: pkg.return_flight_info || undefined,
    packageDetails: pkg.package_details || [],
    requirements: pkg.requirements || [],
    notes: pkg.notes || [],
    overseasDiscount: pkg.overseas_discount || undefined,
  };
};

// ========== PACKAGES ==========
export function usePackages(type?: 'hajj' | 'umrah') {
  return useQuery({
    queryKey: ['packages', type],
    queryFn: async () => {
      let query = supabase
        .from('packages')
        .select(`
          *,
          package_prices(sharing, price_pkr),
          package_hotels(sort_order, hotels(name, city, distance_meters)),
          package_services(service_text),
          package_inclusions(inclusion_text)
        `)
        .eq('active', true);
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapDbPackageToUiPackage) as PackageType[];
    },
  });
}

export function usePackageById(id: string) {
  return useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          package_prices(sharing, price_pkr),
          package_hotels(sort_order, hotels(name, city, distance_meters)),
          package_services(service_text),
          package_inclusions(inclusion_text)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return mapDbPackageToUiPackage(data) as PackageType;
    },
    enabled: !!id,
  });
}

export function usePackagePrices(packageId: string) {
  return useQuery({
    queryKey: ['package-prices', packageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('package_prices')
        .select('*')
        .eq('package_id', packageId);
      if (error) throw error;
      return data as PackagePrice[];
    },
    enabled: !!packageId,
  });
}

export function usePackageHotels(packageId: string) {
  return useQuery({
    queryKey: ['package-hotels', packageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('package_hotels')
        .select('*, hotel_id(*)')
        .eq('package_id', packageId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!packageId,
  });
}

export function usePackageServices(packageId: string) {
  return useQuery({
    queryKey: ['package-services', packageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('package_services')
        .select('*')
        .eq('package_id', packageId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!packageId,
  });
}

export function usePackageInclusions(packageId: string) {
  return useQuery({
    queryKey: ['package-inclusions', packageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('package_inclusions')
        .select('*')
        .eq('package_id', packageId)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    enabled: !!packageId,
  });
}

// ========== HOTELS ==========
export function useHotels(city?: string) {
  return useQuery({
    queryKey: ['hotels', city],
    queryFn: async () => {
      let query = supabase.from('hotels').select('*').eq('active', true);
      if (city) query = query.eq('city', city);
      const { data, error } = await query;
      if (error) throw error;
      return data as Hotel[];
    },
  });
}

export function useCreateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (hotel: Omit<Hotel, 'id'>) => {
      const { data, error } = await supabase.from('hotels').insert([hotel]).select().single();
      if (error) throw error;
      return data as Hotel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (hotelId: string) => {
      const { error } = await supabase.from('hotels').delete().eq('id', hotelId);
      if (error) throw error;
      return hotelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Hotel> & { id: string }) => {
      const { data, error } = await supabase.from('hotels').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Hotel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
}

// ========== BOOKINGS ==========
export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!userId,
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ['all-bookings'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('useAllBookings error:', error);
          throw error;
        }
        return data as Booking[];
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.error('useAllBookings caught error:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Booking['status'] }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
    },
  });
}

export function useProvisionApplicantCredentials() {
  return useMutation({
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data, error } = await supabase.functions.invoke('provision-applicant-credentials', {
        body: { bookingId },
      });

      if (error) {
        const maybeResponse = (error as any)?.context;
        if (maybeResponse && typeof maybeResponse.json === 'function') {
          try {
            const body = await maybeResponse.json();
            throw new Error(body?.error || body?.message || error.message || 'Provision failed');
          } catch {
            throw new Error((error as any)?.message || 'Provision failed');
          }
        }
        throw new Error((error as any)?.message || 'Provision failed');
      }
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to provision credentials');
      }

      return data as {
        success: boolean;
        created: boolean;
        email: string;
        userId: string;
        tempPassword: string;
      };
    },
  });
}

export function useCheckAccountByEmail() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { data, error } = await supabase.functions.invoke('check-account-by-email', {
        body: { email },
      });

      if (error) {
        const maybeResponse = (error as any)?.context;
        if (maybeResponse && typeof maybeResponse.json === 'function') {
          try {
            const body = await maybeResponse.json();
            throw new Error(body?.error || body?.message || error.message || 'Account check failed');
          } catch {
            throw new Error((error as any)?.message || 'Account check failed');
          }
        }

        throw new Error((error as any)?.message || 'Account check failed');
      }

      return (data || { exists: false }) as {
        exists: boolean;
        email: string;
      };
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'booking_code' | 'created_at' | 'updated_at'>) => {
      // Ensure all required fields are present
      const bookingPayload = {
        ...booking,
        password_reset_required: booking.password_reset_required ?? false,
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select();
      
      if (error) {
        console.error('Booking creation error:', error);
        throw new Error(`Failed to create booking: ${error.message}`);
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
    },
  });
}

export function useAdminPackages(type?: 'hajj' | 'umrah') {
  return useQuery({
    queryKey: ['admin-packages', type],
    queryFn: async () => {
      let query = supabase
        .from('packages')
        .select(`
          *,
          package_prices(sharing, price_pkr),
          package_hotels(sort_order, hotels(name, city, distance_meters)),
          package_services(service_text),
          package_inclusions(inclusion_text)
        `);
      if (type) query = query.eq('type', type);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapDbPackageToUiPackage) as PackageType[];
    },
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PackageUpsertInput) => {
      const slug = payload.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const inferredImage = payload.type === 'hajj' ? 'hajj' : 'umrah';

      const { data: pkg, error: pkgError } = await supabase
        .from('packages')
        .insert([
          {
            name: payload.name,
            slug,
            type: payload.type,
            duration_text: payload.duration_text,
            description: payload.description || '',
            featured: payload.featured ?? false,
            active: payload.active ?? true,
            image_url: payload.image_url || inferredImage,
            flight_info: payload.flight_info || {},
            return_flight_info: payload.return_flight_info || {},
            itinerary: payload.itinerary || [],
            package_details: payload.package_details || [],
            requirements: payload.requirements || [],
            notes: payload.notes || [],
            overseas_discount: payload.overseas_discount ?? null,
          },
        ])
        .select('id')
        .single();

      if (pkgError) throw pkgError;

      const priceRows = Object.entries(payload.prices)
        .filter(([, value]) => typeof value === 'number' && Number(value) > 0)
        .map(([sharing, price_pkr]) => ({
          package_id: pkg.id,
          sharing,
          price_pkr,
        }));

      if (priceRows.length) {
        const { error: pricesError } = await supabase.from('package_prices').insert(priceRows as any[]);
        if (pricesError) throw pricesError;
      }

      const hotelRows = (payload.hotel_ids || []).map((hotelId, i) => ({
        package_id: pkg.id,
        hotel_id: hotelId,
        sort_order: i,
      }));

      if (hotelRows.length) {
        const { error: hotelsError } = await supabase.from('package_hotels').insert(hotelRows);
        if (hotelsError) throw hotelsError;
      }

      return pkg.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (packageId: string) => {
      await supabase.from('package_prices').delete().eq('package_id', packageId);
      await supabase.from('package_hotels').delete().eq('package_id', packageId);
      await supabase.from('package_services').delete().eq('package_id', packageId);
      await supabase.from('package_inclusions').delete().eq('package_id', packageId);

      const { error } = await supabase.from('packages').delete().eq('id', packageId);
      if (error) throw error;
      return packageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SupabasePackage> & { id: string }) => {
      const { data, error } = await supabase.from('packages').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as SupabasePackage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
    },
  });
}

// ========== TESTIMONIALS ==========
export function useApprovedTestimonials() {
  return useQuery({
    queryKey: ['testimonials-approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

export function useUserTestimonials(userId: string) {
  return useQuery({
    queryKey: ['testimonials', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
    enabled: !!userId,
  });
}

export function useAllTestimonials() {
  return useQuery({
    queryKey: ['all-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (testimonial: Omit<Testimonial, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['all-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials-approved'] });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Testimonial> & { id: string }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['all-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials-approved'] });
    },
  });
}

// ========== VISA INQUIRIES ==========
export function useCreateVisaInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inquiry: Omit<VisaInquiry, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('visa_inquiries')
        .insert([inquiry])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa-inquiries'] });
    },
  });
}

export function useAllVisaInquiries() {
  return useQuery({
    queryKey: ['visa-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as VisaInquiry[];
    },
  });
}

// ========== CONTACT MESSAGES ==========
export function useCreateContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: Omit<ContactMessage, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([message])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });
}

export function useAllContactMessages() {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    },
  });
}

// ========== CHAT ==========

export function useUserChatConversation(userId: string) {
  return useQuery({
    queryKey: ['chat-conversation', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return (data as ChatConversation | null) ?? null;
    },
    enabled: !!userId,
    retry: false,
  });
}

export function useEnsureUserChatConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('chat_conversations')
        .upsert({ user_id: userId }, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error) throw error;
      return data as ChatConversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversation', conversation.user_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-chat-conversations'] });
    },
  });
}

export function useChatMessages(conversationId: string) {
  return useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as ChatMessage[];
    },
    enabled: !!conversationId,
    retry: false,
    refetchInterval: conversationId ? 5000 : false,
    refetchIntervalInBackground: false,
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      senderRole,
      messageText,
    }: {
      conversationId: string;
      senderId: string;
      senderRole: 'user' | 'admin';
      messageText: string;
    }) => {
      const cleanedMessage = messageText.trim();
      if (!cleanedMessage) throw new Error('Message cannot be empty');

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          sender_role: senderRole,
          message_text: cleanedMessage,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data as ChatMessage;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', message.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-chat-conversations'] });
    },
  });
}

export function useMarkConversationMessagesDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      receiverRole,
    }: {
      conversationId: string;
      receiverRole: 'user' | 'admin';
    }) => {
      const senderRoleToMark = receiverRole === 'admin' ? 'user' : 'admin';

      const { error } = await supabase
        .from('chat_messages')
        .update({ delivered_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('sender_role', senderRoleToMark)
        .is('delivered_at', null)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['admin-chat-conversations'] });
    },
  });
}

export function useMarkConversationMessagesSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      readerRole,
    }: {
      conversationId: string;
      readerRole: 'user' | 'admin';
    }) => {
      const senderRoleToMark = readerRole === 'admin' ? 'user' : 'admin';

      const { error } = await supabase
        .from('chat_messages')
        .update({
          is_read: true,
          seen_at: new Date().toISOString(),
          delivered_at: new Date().toISOString(),
        })
        .eq('conversation_id', conversationId)
        .eq('sender_role', senderRoleToMark)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['admin-chat-conversations'] });
    },
  });
}

export function useAdminChatConversations() {
  return useQuery({
    queryKey: ['admin-chat-conversations'],
    queryFn: async () => {
      const { data: conversations, error: conversationError } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (conversationError) throw conversationError;

      const typedConversations = (conversations || []) as ChatConversation[];
      if (!typedConversations.length) return [] as ChatConversation[];

      const userIds = [...new Set(typedConversations.map((c) => c.user_id))];

      const [
        { data: profiles, error: profileError },
        { data: lastMessages, error: messageError },
        { data: bookings, error: bookingError },
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', userIds),
        supabase
          .from('chat_messages')
          .select('conversation_id, message_text, sender_role, is_read, created_at')
          .in('conversation_id', typedConversations.map((c) => c.id))
          .order('created_at', { ascending: false }),
        supabase
          .from('bookings')
          .select('user_id, applicant_email, applicant_phone')
          .in('user_id', userIds),
      ]);

      if (profileError) throw profileError;
      if (messageError) throw messageError;

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      const bookingMap = new Map<string, any>();
      (bookings || []).forEach((booking: any) => {
        if (booking.user_id && !bookingMap.has(booking.user_id)) {
          bookingMap.set(booking.user_id, booking);
        }
      });

      return typedConversations.map((conversation) => {
        const conversationMessages = (lastMessages || []).filter(
          (m: any) => m.conversation_id === conversation.id,
        );

        const latestMessage = conversationMessages[0] as any;
        const unreadCount = conversationMessages.filter(
          (m: any) => m.sender_role === 'user' && !m.is_read,
        ).length;

        const profile = profileMap.get(conversation.user_id);
        const booking = bookingMap.get(conversation.user_id);

        // Fallback to booking data if profile is incomplete
        const fullName = profile?.full_name || booking?.applicant_email?.split('@')[0] || null;
        const phone = profile?.phone || booking?.applicant_phone || null;

        return {
          ...conversation,
          profile: { id: conversation.user_id, full_name: fullName, phone },
          unread_count: unreadCount,
          last_message_preview: latestMessage?.message_text || null,
        } as ChatConversation;
      });
    },
    retry: false,
  });
}

// ========== DOCUMENT MANAGEMENT ==========

const FALLBACK_REQUIRED_DOCS: Record<'hajj' | 'umrah' | 'visa', RequiredDocument[]> = {
  hajj: [
    { id: 'f1', document_type: 'passport', display_name: 'Passport', description: 'Clear copy of passport (ID page + expiry page)', created_at: '' },
    { id: 'f2', document_type: 'cnic', display_name: 'CNIC', description: 'Clear copy of CNIC (front and back)', created_at: '' },
    { id: 'f3', document_type: 'photo', display_name: 'Passport Size Photo', description: '4x6 passport size color photograph', created_at: '' },
    { id: 'f4', document_type: 'vaccination_certificate', display_name: 'Vaccination Certificate', description: 'COVID-19 and Meningitis vaccination certificates', created_at: '' },
  ],
  umrah: [
    { id: 'f1', document_type: 'passport', display_name: 'Passport', description: 'Clear copy of passport (ID page + expiry page)', created_at: '' },
    { id: 'f2', document_type: 'cnic', display_name: 'CNIC', description: 'Clear copy of CNIC (front and back)', created_at: '' },
    { id: 'f3', document_type: 'photo', display_name: 'Passport Size Photo', description: '4x6 passport size color photograph', created_at: '' },
    { id: 'f4', document_type: 'bank_statement', display_name: 'Bank Statement', description: 'Bank statement showing funds for the trip (last 6 months)', created_at: '' },
  ],
  visa: [
    { id: 'f1', document_type: 'passport', display_name: 'Passport Copy', description: 'Clear copy of passport ID + expiry page', created_at: '' },
    { id: 'f2', document_type: 'photo', display_name: 'Photograph', description: 'Recent passport-size photo with white background', created_at: '' },
    { id: 'f3', document_type: 'bank_statement', display_name: 'Bank Statement', description: 'Latest bank statement as required by embassy', created_at: '' },
    { id: 'f4', document_type: 'travel_itinerary', display_name: 'Travel Itinerary', description: 'Tentative travel plan / ticket reservation', created_at: '' },
    { id: 'f5', document_type: 'hotel_booking', display_name: 'Hotel Booking', description: 'Proof of accommodation / hotel reservation', created_at: '' },
  ],
};

export function useRequiredDocuments(packageType: 'hajj' | 'umrah' | 'visa') {
  return useQuery({
    queryKey: ['required-documents', packageType],
    queryFn: async () => {
      const tableName = packageType === 'hajj'
        ? 'hajj_required_documents'
        : packageType === 'umrah'
          ? 'umrah_required_documents'
          : 'visa_required_documents';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: true });
      if (error || !data || data.length === 0) {
        // Fallback to hardcoded list if DB table is empty or unreachable
        return FALLBACK_REQUIRED_DOCS[packageType];
      }
      return data as RequiredDocument[];
    },
    enabled: !!packageType,
  });
}

export function useBookingDocuments(bookingId: string) {
  return useQuery({
    queryKey: ['booking-documents', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_documents')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BookingDocument[];
    },
    enabled: !!bookingId,
  });
}

export function useUploadBookingDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      documentType,
      file,
    }: {
      bookingId: string;
      documentType: string;
      file: File;
    }) => {
      // Use current session user ID directly (not booking.user_id which may be null)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('You must be logged in to upload documents');

      const filePath = `${user.id}/${bookingId}/${documentType}/${Date.now()}-${file.name}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('booking-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Insert or replace existing document record for this type
      const { data, error } = await supabase
        .from('booking_documents')
        .upsert(
          {
            booking_id: bookingId,
            document_type: documentType,
            file_path: uploadData.path,
            file_url: uploadData.path,
            file_name: file.name,
            file_size_bytes: file.size,
            mime_type: file.type,
            status: 'pending',
            admin_notes: null,
            uploaded_at: new Date().toISOString(),
          },
          { onConflict: 'booking_id,document_type' }
        )
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking-documents', variables.bookingId] });
    },
  });
}

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      documentId,
      status,
      adminNotes,
    }: {
      documentId: string;
      status: 'approved' | 'rejected' | 'requested';
      adminNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('booking_documents')
        .update({
          status,
          admin_notes: adminNotes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-documents'] });
    },
  });
}

export function useGetAllBookingsWithDocuments() {
  return useQuery({
    queryKey: ['bookings-with-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_documents (*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
