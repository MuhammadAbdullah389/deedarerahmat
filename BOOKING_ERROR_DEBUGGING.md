# Booking Submission Error - Troubleshooting Guide

## Problem
Users are seeing "Failed to upload" error when submitting Hajj/Umrah applications.

## Root Causes

### 1. **RLS Policy Issue (Most Common)**
The bookings table has RLS policies that might be blocking inserts from unauthenticated users.

**Current Policy:**
```sql
-- This policy allows but may fail for unauthenticated users
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);
```

**Issue:** Even though it says `true`, if other policies exist with `user_id = auth.uid()`, and the table has RLS enabled, the insert might fail.

### 2. **Missing booking_code**
If the bookings table has a NOT NULL constraint on `booking_code` and it's not auto-generated, the insert will fail.

### 3. **Missing Required Fields**
Some fields like `form_data` might not be properly serialized as JSON.

## Solutions Applied

### 1. **Enhanced Error Logging**
The error hook now logs the actual Supabase error:
```typescript
if (error) {
  console.error('Booking creation error:', error);
  throw new Error(`Failed to create booking: ${error.message}`);
}
```

**To Debug:** Open browser console (F12 → Console tab) and look for:
- `Booking creation error: ...`
- The actual error message from Supabase

### 2. **Default Value for password_reset_required**
```typescript
const bookingPayload = {
  ...booking,
  password_reset_required: booking.password_reset_required ?? false,
};
```

### 3. **Improved RLS Policies**
Updated migration to support unauthenticated inserts:
```sql
-- Allow anyone to insert (for unauthenticated users)
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Allow unauthenticated users to view (after applying)
CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT
USING (user_id = auth.uid() OR auth.uid() IS NULL);
```

## Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try submitting the form
4. Look for error messages starting with "Booking creation error:"
5. Copy the full error message

### Step 2: Check Supabase Settings
1. Go to Supabase Dashboard
2. Navigate to: SQL Editor
3. Run this query to check if bookings table exists:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'bookings';
```

4. Check if RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings';
```
(Result should show `t` for rowsecurity if RLS is enabled)

### Step 3: Test RLS Policies
Run this in Supabase SQL Editor:
```sql
-- Check if bookings table has INSERT policy
SELECT * FROM pg_policies 
WHERE tablename = 'bookings' AND cmd = 'INSERT';
```

### Step 4: Verify booking_code Column
```sql
-- Check if booking_code has a default or is auto-generated
SELECT column_name, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name = 'booking_code';
```

If `column_default` is NULL and `is_nullable` is NO, that's the problem!

## Solutions to Apply

### If booking_code is the issue:
```sql
-- Option 1: Make it nullable
ALTER TABLE public.bookings ALTER COLUMN booking_code DROP NOT NULL;

-- Option 2: Add default value
ALTER TABLE public.bookings 
ALTER COLUMN booking_code 
SET DEFAULT 'BK' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('booking_code_seq')::TEXT, 6, '0');
```

### If RLS policies are blocking:
```sql
-- Disable RLS temporarily to test (NOT for production!)
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Then re-enable with proper policies:
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create new policy that explicitly allows unauthenticated inserts
CREATE POLICY "Allow all inserts"
ON public.bookings FOR INSERT
WITH CHECK (TRUE);
```

### If form_data serialization is the issue:
The form is sending:
```typescript
form_data: {
  fullName,
  email,
  // ... other fields
}
```

This should be automatically serialized to JSON by Supabase, but if it's not:
```typescript
// Explicitly convert to JSON string
form_data: JSON.stringify({
  fullName,
  email,
  // ... other fields
})
```

## Testing Procedure

1. **Clear browser cache:** Ctrl+Shift+Delete
2. **Rebuild the project:** `npm run build`
3. **Start dev server:** `npm run dev`
4. **Open browser console:** F12
5. **Try submitting form without login**
6. **Check console for error message**
7. **Copy error and check against this list**

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `null value in column "booking_code"` | booking_code not auto-generated | Add default value to column |
| `violates row level security policy` | RLS policy blocking insert | Update INSERT policy to allow unauthenticated |
| `relation "bookings" does not exist` | Table not created | Run migration in Supabase |
| `permission denied for schema public` | Role permissions issue | Check Supabase role permissions |
| `new row violates check constraint` | Field value invalid | Check form data types |

## Quick Fix Commands

**Run these in Supabase SQL Editor:**

```sql
-- 1. Ensure RLS allows inserts
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 2. Verify booking_code column
SELECT column_name, column_default, is_nullable, data_type
FROM information_schema.columns 
WHERE table_name = 'bookings';

-- 3. If booking_code has no default, add one:
ALTER TABLE public.bookings 
ALTER COLUMN booking_code 
SET DEFAULT 'BK' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('booking_code_seq')::TEXT, 6, '0');

-- 4. Re-enable RLS with safe policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enable_insert" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "enable_select_authenticated" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "enable_select_unauthenticated" 
ON public.bookings FOR SELECT 
USING (user_id IS NULL);
```

## Next Steps if Still Failing

1. Check Supabase logs: Supabase Dashboard → Logs
2. Verify table structure matches interface
3. Check auth context is not throwing errors
4. Ensure Supabase client is properly initialized
5. Test with admin account to see if it's auth-specific
6. Check if booking table has triggers that might fail

## Contact Information
If error persists after trying above steps, provide:
1. Full error message from browser console
2. Screenshot of the error
3. Supabase project URL (sanitized)
4. Browser and OS information
