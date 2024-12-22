import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Quote {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  project: {
    name: string;
  };
  contractor: {
    company_name: string;
  };
}

const generatePDF = async (quotes: Quote[]) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  let yOffset = height - 50;
  const lineHeight = 20;

  // Add title
  page.drawText("Quote Analysis Report", {
    x: 50,
    y: yOffset,
    size: 20,
  });
  yOffset -= lineHeight * 2;

  // Add quotes
  for (const quote of quotes) {
    if (yOffset < 50) {
      // Add new page if we're running out of space
      const newPage = pdfDoc.addPage();
      yOffset = height - 50;
    }

    page.drawText(`Project: ${quote.project.name}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight;

    page.drawText(`Contractor: ${quote.contractor.company_name}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight;

    page.drawText(`Amount: $${quote.amount.toLocaleString()}`, {
      x: 50,
      y: yOffset,
      size: 12,
    });
    yOffset -= lineHeight * 2;
  }

  return await pdfDoc.save();
};

const generateCSV = (quotes: Quote[]) => {
  const headers = ["Project", "Contractor", "Amount", "Status", "Date"];
  const rows = quotes.map(quote => [
    quote.project.name,
    quote.contractor.company_name,
    quote.amount.toString(),
    quote.status,
    new Date(quote.created_at).toLocaleDateString(),
  ]);

  return [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quotes, type, name } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    let fileContent: Uint8Array | string;
    let contentType: string;
    let extension: string;

    if (type === "pdf") {
      fileContent = await generatePDF(quotes);
      contentType = "application/pdf";
      extension = "pdf";
    } else {
      fileContent = generateCSV(quotes);
      contentType = "text/csv";
      extension = "csv";
    }

    // Upload to Supabase Storage
    const fileName = `${name || 'report'}-${Date.now()}.${extension}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(fileName, fileContent, {
        contentType,
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ url: publicUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in generate-report function:", error);
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