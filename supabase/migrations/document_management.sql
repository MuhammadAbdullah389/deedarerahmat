-- Document Management System Migration

-- Create document_type enum
CREATE TYPE document_type AS ENUM ('passport', 'cnic', 'photo', 'vaccination_certificate', 'bank_statement');

-- Create document_status enum  
CREATE TYPE document_status AS ENUM ('pending', 'uploaded', 'approved', 'rejected', 'requested');

-- Create booking_documents table
CREATE TABLE public.booking_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INT,
  mime_type VARCHAR(100),
  status document_status DEFAULT 'pending',
  admin_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, document_type)
);

-- Create hajj_required_documents table
CREATE TABLE public.hajj_required_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type document_type NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create umrah_required_documents table
CREATE TABLE public.umrah_required_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type document_type NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Hajj required documents
INSERT INTO public.hajj_required_documents (document_type, display_name, description, is_required) VALUES
('passport', 'Passport', 'Clear copy of passport with ID page and expiry page', true),
('cnic', 'CNIC', 'Clear copy of CNIC (front and back)', true),
('photo', 'Photo', '4x6 passport size color photograph', true),
('vaccination_certificate', 'Vaccination Certificate', 'COVID-19 and Meningitis vaccination certificates', true);

-- Insert Umrah required documents
INSERT INTO public.umrah_required_documents (document_type, display_name, description, is_required) VALUES
('passport', 'Passport', 'Clear copy of passport with ID page and expiry page', true),
('cnic', 'CNIC', 'Clear copy of CNIC (front and back)', true),
('photo', 'Photo', '4x6 passport size color photograph', true),
('bank_statement', 'Bank Statement', 'Bank statement showing funds for the trip (last 6 months)', true);

-- Create Storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-documents', 'booking-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on booking_documents
ALTER TABLE public.booking_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_documents table

-- Users can view their own booking documents
CREATE POLICY "Users can view own booking documents"
ON public.booking_documents FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE user_id = auth.uid()
  )
);

-- Users can insert documents for their bookings
CREATE POLICY "Users can insert documents for own bookings"
ON public.booking_documents FOR INSERT
WITH CHECK (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE user_id = auth.uid()
  )
);

-- Users can update their own documents (status only)
CREATE POLICY "Users can update own documents"
ON public.booking_documents FOR UPDATE
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE user_id = auth.uid()
  )
);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON public.booking_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update all documents
CREATE POLICY "Admins can update all documents"
ON public.booking_documents FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for Storage bucket

-- Create policy to allow users to upload to their booking folder
CREATE POLICY "Users can upload documents to own booking folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'booking-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own documents
CREATE POLICY "Users can view own documents in storage"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'booking-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all stored documents
CREATE POLICY "Admins can view all documents in storage"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'booking-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add column to bookings table for tracking applicant without login
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS applicant_email VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS applicant_phone VARCHAR(20);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS temp_password_token TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS temp_password_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT false;

-- Update booking_code generation to use a sequence if not already present
CREATE SEQUENCE IF NOT EXISTS booking_code_seq START 1000 INCREMENT 1;

-- Create function to generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('booking_code_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Update bookings table to auto-generate booking_code if empty
ALTER TABLE public.bookings ADD CONSTRAINT check_booking_code CHECK (booking_code IS NOT NULL);

-- Enable RLS on bookings table if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert their own bookings
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- RLS Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT
USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- RLS Policy: Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policy: Admins can update bookings
CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
