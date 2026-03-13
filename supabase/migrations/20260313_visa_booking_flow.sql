-- Visa booking + document flow support

-- 1) Ensure package_type enum supports 'visa' (if package_type is enum)
DO $$
DECLARE
  enum_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'package_type'
      AND e.enumlabel = 'visa'
  ) INTO enum_exists;

  IF NOT enum_exists THEN
    BEGIN
      ALTER TYPE package_type ADD VALUE 'visa';
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END $$;

-- 2) Ensure document_type enum supports visa-specific docs
DO $$
BEGIN
  BEGIN
    ALTER TYPE document_type ADD VALUE 'travel_itinerary';
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER TYPE document_type ADD VALUE 'hotel_booking';
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- 3) Visa required documents table
CREATE TABLE IF NOT EXISTS public.visa_required_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type document_type NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4) Seed visa required docs (upsert)
INSERT INTO public.visa_required_documents (document_type, display_name, description, is_required)
VALUES
  ('passport', 'Passport Copy', 'Clear copy of passport ID + expiry page', true),
  ('photo', 'Photograph', 'Recent passport-size photo with white background', true),
  ('bank_statement', 'Bank Statement', 'Latest bank statement as required by embassy', true),
  ('travel_itinerary', 'Travel Itinerary', 'Tentative itinerary / ticket reservation', true),
  ('hotel_booking', 'Hotel Booking', 'Proof of accommodation / hotel reservation', true)
ON CONFLICT (document_type)
DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_required = EXCLUDED.is_required;
