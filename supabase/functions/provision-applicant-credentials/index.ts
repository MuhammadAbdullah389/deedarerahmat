import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const randomPassword = (length = 12) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#%*";
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }
  return output;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUserClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user: requester },
      error: requesterError,
    } = await supabaseUserClient.auth.getUser();

    if (requesterError || !requester) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: requesterProfile, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", requester.id)
      .maybeSingle();

    if (roleError || requesterProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("id, user_id, applicant_email, form_data")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = booking.applicant_email || booking.form_data?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "Applicant email is missing" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullName = booking.form_data?.fullName || booking.form_data?.name || "Applicant";
    const tempPassword = randomPassword(12);
    let userId: string | null = booking.user_id;
    let created = false;

    if (!userId) {
      const createdUser = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          source: "booking-provision",
        },
      });

      if (createdUser.error || !createdUser.data.user) {
        return new Response(JSON.stringify({ error: createdUser.error?.message || "Failed to create user" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      userId = createdUser.data.user.id;
      created = true;

      await supabaseAdmin.from("profiles").upsert(
        [
          {
            id: userId,
            full_name: fullName,
            phone: booking.form_data?.phone || null,
            role: "user",
          },
        ],
        { onConflict: "id" },
      );
    } else {
      const resetUser = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword,
      });

      if (resetUser.error) {
        return new Response(JSON.stringify({ error: resetUser.error.message || "Failed to reset user password" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    const { error: bookingUpdateError } = await supabaseAdmin
      .from("bookings")
      .update({
        user_id: userId,
        applicant_email: email,
        temp_password_token: token,
        temp_password_expires_at: expiresAt,
        password_reset_required: true,
      })
      .eq("id", bookingId);

    if (bookingUpdateError) {
      return new Response(JSON.stringify({ error: bookingUpdateError.message || "Failed to update booking" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        created,
        email,
        userId,
        tempPassword,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
