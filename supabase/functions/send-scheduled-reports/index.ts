import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get all scheduled reports
    const { data: reports, error: reportsError } = await supabase
      .from('custom_reports')
      .select(`
        *,
        profiles:user_id (
          email
        )
      `);

    if (reportsError) throw reportsError;

    for (const report of reports) {
      try {
        // Generate report using the generate-report function
        const reportResponse = await fetch(`${SUPABASE_URL}/functions/v1/generate-report`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: report.config.format,
            name: report.name,
          }),
        });

        if (!reportResponse.ok) continue;

        const { url } = await reportResponse.json();

        // Send email with report
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Quota <notifications@quota.canopyfitouts.com.au>",
            to: report.config.recipients,
            subject: `Scheduled Report: ${report.name}`,
            html: `
              <p>Your scheduled report is ready.</p>
              <p><a href="${url}">Download Report</a></p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          throw new Error(`Failed to send email: ${await emailResponse.text()}`);
        }

        // Update last_run timestamp
        await supabase
          .from('custom_reports')
          .update({ last_run: new Date().toISOString() })
          .eq('id', report.id);

      } catch (error) {
        console.error(`Error processing report ${report.id}:`, error);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-scheduled-reports function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);