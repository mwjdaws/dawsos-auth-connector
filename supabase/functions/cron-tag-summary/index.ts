
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Call a Postgres function or run raw SQL
    const { error } = await supabase.rpc("refresh_tag_summary_view");

    if (error) {
      console.error("Failed to refresh view:", error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ error: "Unhandled error" }), {
      status: 500,
    });
  }
});
