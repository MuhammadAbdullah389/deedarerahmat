-- Booking closure audit trail

CREATE TABLE IF NOT EXISTS public.booking_closure_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  booking_code TEXT NOT NULL,
  user_id UUID NULL,
  applicant_email TEXT NULL,
  applicant_phone TEXT NULL,
  package_name_snapshot TEXT NOT NULL,
  package_type TEXT NOT NULL,
  status_at_closure TEXT NOT NULL,
  reason TEXT NOT NULL,
  closed_by UUID NULL,
  metadata JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_closure_logs_booking_id
  ON public.booking_closure_logs (booking_id);

CREATE INDEX IF NOT EXISTS idx_booking_closure_logs_created_at
  ON public.booking_closure_logs (created_at DESC);

ALTER TABLE public.booking_closure_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert closure logs" ON public.booking_closure_logs;
CREATE POLICY "Admins can insert closure logs"
ON public.booking_closure_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can view closure logs" ON public.booking_closure_logs;
CREATE POLICY "Admins can view closure logs"
ON public.booking_closure_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
