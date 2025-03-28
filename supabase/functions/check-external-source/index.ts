
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.168.0/encoding/hex.ts";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Fetches content from a URL with proper error handling
 */
async function fetchExternalContent(url: string): Promise<{ content: string | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ComplianceAgent/1.0 (Knowledge validation service)",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        content: null,
        error: `Failed to fetch content: ${response.status} ${response.statusText}`,
      };
    }

    const content = await response.text();
    return { content, error: null };
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return { 
      content: null, 
      error: `Network error: ${error.message}` 
    };
  }
}

/**
 * Generates a hash of content for change detection
 */
async function generateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return encodeHex(hashArray);
}

/**
 * Main function to check an external source
 */
async function checkExternalSource(knowledgeSourceId: string, supabaseClient: any): Promise<{
  success: boolean;
  message: string;
  needsReview: boolean;
  sourceId: string;
  auditRecord: Record<string, any>;
}> {
  // Audit record for logging the check process
  const auditRecord: Record<string, any> = {
    sourceId: knowledgeSourceId,
    timestamp: new Date().toISOString(),
    status: "started",
  };
  
  try {
    // Get the knowledge source record
    const { data: source, error: sourceError } = await supabaseClient
      .from("knowledge_sources")
      .select("id, title, external_source_url, external_content_hash")
      .eq("id", knowledgeSourceId)
      .single();
    
    if (sourceError) {
      auditRecord.status = "error";
      auditRecord.error = `Database error: ${sourceError.message}`;
      return {
        success: false,
        message: `Failed to retrieve knowledge source: ${sourceError.message}`,
        needsReview: false,
        sourceId: knowledgeSourceId,
        auditRecord
      };
    }
    
    // Validate that we have an external source URL
    if (!source.external_source_url) {
      auditRecord.status = "skipped";
      auditRecord.reason = "No external source URL defined";
      
      return {
        success: true,
        message: "No external source URL to check",
        needsReview: false,
        sourceId: knowledgeSourceId,
        auditRecord
      };
    }
    
    // Record the URL we're checking
    auditRecord.url = source.external_source_url;
    
    // Fetch content from the external source
    const { content, error: fetchError } = await fetchExternalContent(source.external_source_url);
    
    if (fetchError) {
      auditRecord.status = "error";
      auditRecord.error = fetchError;
      
      // Update the knowledge source to mark it for review
      await supabaseClient
        .from("knowledge_sources")
        .update({
          needs_external_review: true,
          external_source_checked_at: new Date().toISOString()
        })
        .eq("id", knowledgeSourceId);
      
      return {
        success: false,
        message: `Failed to fetch external content: ${fetchError}`,
        needsReview: true,
        sourceId: knowledgeSourceId,
        auditRecord
      };
    }
    
    // Generate a hash of the content for comparison
    const newContentHash = await generateContentHash(content!);
    auditRecord.newContentHash = newContentHash;
    auditRecord.previousContentHash = source.external_content_hash || "none";
    
    // Check if content has changed by comparing hashes
    const contentChanged = source.external_content_hash !== newContentHash;
    auditRecord.contentChanged = contentChanged;
    
    if (contentChanged) {
      // Update the knowledge source to mark it for review and update the hash
      await supabaseClient
        .from("knowledge_sources")
        .update({
          needs_external_review: true,
          external_content_hash: newContentHash,
          external_source_checked_at: new Date().toISOString()
        })
        .eq("id", knowledgeSourceId);
      
      auditRecord.status = "changed";
      
      return {
        success: true,
        message: "External source content has changed",
        needsReview: true,
        sourceId: knowledgeSourceId,
        auditRecord
      };
    } else {
      // Update the checked_at timestamp but don't flag for review
      await supabaseClient
        .from("knowledge_sources")
        .update({
          external_source_checked_at: new Date().toISOString()
        })
        .eq("id", knowledgeSourceId);
      
      auditRecord.status = "unchanged";
      
      return {
        success: true,
        message: "External source content has not changed",
        needsReview: false,
        sourceId: knowledgeSourceId,
        auditRecord
      };
    }
  } catch (error) {
    console.error("Unexpected error during external source check:", error);
    auditRecord.status = "error";
    auditRecord.error = `Unexpected error: ${error.message}`;
    
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      needsReview: false, // We don't know if review is needed in case of unexpected errors
      sourceId: knowledgeSourceId,
      auditRecord
    };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create authenticated Supabase client with Deno runtime
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the knowledge source ID from the request
    const { knowledgeSourceId } = await req.json();
    
    if (!knowledgeSourceId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameter: knowledgeSourceId" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check the external source
    const result = await checkExternalSource(knowledgeSourceId, supabaseClient);
    
    // Log the audit record to the database
    await supabaseClient
      .from("compliance_audit_logs")
      .insert({
        source_id: result.sourceId,
        check_type: "external_source",
        result: result.auditRecord,
        needs_review: result.needsReview
      })
      .select()
      .single()
      .then(({ error }) => {
        if (error && error.code === "42P01") {
          // Table doesn't exist, log this but continue
          console.log("Audit log table 'compliance_audit_logs' does not exist. Create it for audit logging.");
        } else if (error) {
          console.error("Error logging audit record:", error);
        }
      });
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
