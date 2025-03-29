
import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration (in-memory for demo)
const RATE_LIMIT = 10; // requests per minute
const rateLimits = new Map<string, { count: number, resetTime: number }>();

// Retry configuration
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1000;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || "unknown-ip";
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      // Log rate limit exceeded to agent_actions
      await logAgentAction(supabase, {
        agent_name: "batch-ontology-enrichment",
        action: "rate-limit-exceeded",
        success: false,
        error: "Rate limit exceeded",
        metadata: { clientIP }
      });
      
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later.",
          rateLimit: {
            limit: RATE_LIMIT,
            remaining: 0,
            reset: getRateLimitReset(clientIP)
          }
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((getRateLimitReset(clientIP) - Date.now()) / 1000))
          } 
        }
      );
    }
    
    // Parse request body
    const { batchSize = 10, sourceIds = [], filter = {} } = await req.json();
    
    console.log(`Starting batch ontology enrichment: batchSize=${batchSize}, specificSourceIds=${sourceIds.length}`);
    
    // Increment rate limit counter
    incrementRateLimit(clientIP);
    
    // Determine which sources to process
    let sourcesToProcess = [];
    
    // If specific source IDs were provided, use those
    if (sourceIds && sourceIds.length > 0) {
      console.log(`Processing specific sources: ${sourceIds.join(', ')}`);
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title, content')
        .in('id', sourceIds);
        
      if (error) {
        throw new Error(`Failed to fetch specific sources: ${error.message}`);
      }
      
      sourcesToProcess = data || [];
    } 
    // Otherwise, get sources that need enrichment based on filter criteria
    else {
      let query = supabase
        .from('knowledge_sources')
        .select('id, title, content');
      
      // Apply filters
      if (filter.published !== undefined) {
        query = query.eq('published', filter.published);
      }
      
      if (filter.needsEnrichment) {
        query = query.or('metadata.is.null,not.metadata->enriched.eq.true');
      }
      
      // Apply limit
      query = query.limit(batchSize);
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch sources: ${error.message}`);
      }
      
      sourcesToProcess = data || [];
    }
    
    if (sourcesToProcess.length === 0) {
      // Log empty batch event
      await logAgentAction(supabase, {
        agent_name: "batch-ontology-enrichment",
        action: "empty-batch",
        success: true,
        metadata: { sourceIds, filter }
      });
      
      return new Response(
        JSON.stringify({ message: "No sources to process" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Found ${sourcesToProcess.length} sources to process`);
    
    // Prepare the sources array for batch processing
    const sourcesForBatch = sourcesToProcess.map(source => ({
      id: source.id,
      content: source.content,
      title: source.title
    }));
    
    // Initialize result tracking
    let result;
    let retryCount = 0;
    
    // Implement retry logic with exponential backoff
    while (retryCount <= MAX_RETRIES) {
      try {
        // Call the suggest-ontology-terms function with retry logic
        const response = await fetchWithTimeout(
          `${supabaseUrl}/functions/v1/suggest-ontology-terms`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ sources: sourcesForBatch })
          },
          30000 // 30 second timeout
        );
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter 
            ? parseInt(retryAfter, 10) * 1000 
            : BASE_DELAY_MS * Math.pow(2, retryCount);
            
          console.log(`Rate limited by downstream service. Retrying after ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
          continue;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to process batch: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        result = await response.json();
        break; // Success, exit the retry loop
      } catch (error) {
        console.error(`Error in attempt ${retryCount + 1}/${MAX_RETRIES + 1}:`, error);
        
        if (retryCount >= MAX_RETRIES) {
          throw error; // Rethrow after max retries
        }
        
        // Calculate backoff delay with jitter
        const delay = BASE_DELAY_MS * Math.pow(2, retryCount) * (0.5 + Math.random() * 0.5);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
      }
    }
    
    // Log successful processing to agent_actions
    await logAgentAction(supabase, {
      agent_name: "batch-ontology-enrichment",
      action: "process-batch",
      success: true,
      metadata: { 
        sourceCount: sourcesToProcess.length,
        resultCount: result?.results?.length || 0,
        errorCount: result?.errors?.length || 0
      }
    });
    
    // Log individual source results
    if (result?.results) {
      for (const sourceResult of result.results) {
        await logAgentAction(supabase, {
          agent_name: "ontology-enrichment",
          action: "enrich-source",
          knowledge_source_id: sourceResult.id,
          success: true,
          confidence: 0.9, // Example confidence value
          metadata: { 
            termCount: sourceResult.terms?.length || 0,
            noteCount: sourceResult.notes?.length || 0
          }
        });
      }
    }
    
    // Log individual errors
    if (result?.errors) {
      for (const errorItem of result.errors) {
        await logAgentAction(supabase, {
          agent_name: "ontology-enrichment",
          action: "enrich-source",
          knowledge_source_id: errorItem.id,
          success: false,
          error: errorItem.error,
          metadata: { error: errorItem.error }
        });
      }
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in batch-ontology-enrichment:", error);
    
    try {
      // Create a supabase client for error logging
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Log the error to agent_actions
        await logAgentAction(supabase, {
          agent_name: "batch-ontology-enrichment",
          action: "global-error",
          success: false,
          error: error.message || "Unknown error",
          metadata: { stack: error.stack }
        });
      }
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        results: [],
        errors: [{ global: error.message }]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to log agent actions
async function logAgentAction(supabase: any, action: {
  agent_name: string;
  action: string;
  knowledge_source_id?: string;
  success?: boolean;
  confidence?: number;
  error?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const { data, error } = await supabase
      .from('agent_actions')
      .insert({
        agent_name: action.agent_name,
        action: action.action,
        knowledge_source_id: action.knowledge_source_id,
        success: action.success !== undefined ? action.success : true,
        confidence: action.confidence,
        error: action.error,
        metadata: action.metadata || {}
      });
      
    if (error) {
      console.error('Error logging agent action:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Exception logging agent action:', error);
    return { data: null, error };
  }
}

// Helper function to check rate limit
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const minute = 60 * 1000;
  
  // Clean up expired rate limits
  for (const [ip, limit] of rateLimits.entries()) {
    if (limit.resetTime < now) {
      rateLimits.delete(ip);
    }
  }
  
  // Check if client has a rate limit entry
  if (!rateLimits.has(clientIP)) {
    rateLimits.set(clientIP, {
      count: 0,
      resetTime: now + minute
    });
    return true;
  }
  
  // Get the client's current limit
  const limit = rateLimits.get(clientIP)!;
  
  // Reset if expired
  if (limit.resetTime < now) {
    limit.count = 0;
    limit.resetTime = now + minute;
    return true;
  }
  
  // Check if limit exceeded
  return limit.count < RATE_LIMIT;
}

// Helper function to increment rate limit counter
function incrementRateLimit(clientIP: string): void {
  const limit = rateLimits.get(clientIP);
  if (limit) {
    limit.count++;
  }
}

// Helper function to get rate limit reset time
function getRateLimitReset(clientIP: string): number {
  return rateLimits.get(clientIP)?.resetTime || Date.now() + 60000;
}

// Helper function for fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}
