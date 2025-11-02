import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  return new Response(
    JSON.stringify({ 
      error: "Admin Copilot has been disabled",
      message: "This endpoint is no longer active" 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 410, // 410 Gone - resource permanently removed
    }
  );
});
