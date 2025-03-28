
// Deno Edge Function for tag generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from "./utils/cors.ts";
import { generateTagsWithOpenAI } from "./utils/openai.ts";
import { saveTagsToDatabase } from "./utils/database.ts";
import { 
  createErrorResponse, 
  validateRequestBody, 
  withErrorHandling,
  ErrorCode 
} from "./utils/error-handler.ts";

interface RequestBody {
  content: string;
  save?: boolean;
  contentId?: string;
  retryCount?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse and validate the request body
    let requestBody: RequestBody;
    try {
      requestBody = await req.json() as RequestBody;
    } catch (error) {
      return createErrorResponse(
        error, 
        "Invalid JSON in request body", 
        ErrorCode.VALIDATION_ERROR, 
        400
      );
    }

    // Validate required fields
    const { valid, error } = validateRequestBody(requestBody, ["content"]);
    if (!valid && error) {
      return createErrorResponse(
        error, 
        error.message, 
        error.code, 
        error.status
      );
    }

    const { content, save = false, contentId, retryCount = 0 } = requestBody;

    // Validate content length
    if (typeof content !== "string" || content.trim().length < 5) {
      return createErrorResponse(
        "Content is too short",
        "Content must be a string with at least 5 characters",
        ErrorCode.VALIDATION_ERROR,
        400
      );
    }

    // Validate contentId if save is true
    if (save && !contentId) {
      return createErrorResponse(
        "Missing contentId",
        "ContentId is required when save is true",
        ErrorCode.VALIDATION_ERROR,
        400
      );
    }

    console.log(`Generating tags for content: ${content.substring(0, 30)}...`);

    // Generate tags using OpenAI with error handling and retry mechanism
    let { tags, error: generationError } = await withErrorHandling(
      () => generateTagsWithOpenAI(content)
    );
    
    // If tag generation failed and this isn't a retry, attempt a simpler prompt
    if ((generationError || !tags || tags.length === 0) && retryCount === 0) {
      console.log("Initial tag generation failed, attempting with simpler prompt");
      const simplifiedResult = await withErrorHandling(
        () => generateTagsWithOpenAI(content, true) // true for simplified prompt
      );
      
      if (!simplifiedResult.error && simplifiedResult.tags && simplifiedResult.tags.length > 0) {
        tags = simplifiedResult.tags;
        generationError = null;
      }
    }
    
    // Ensure we always have some tags even if generation fails
    if (!tags || tags.length === 0) {
      console.log("Tag generation failed, using fallback tags");
      tags = ["content", "document", "text", "analysis", "metadata"];
    }
    
    // Save tags to database if requested
    let saveResult = { success: false, message: "", error: null };
    if (save && contentId) {
      console.log(`Saving ${tags.length} tags for contentId: ${contentId}`);
      saveResult = await withErrorHandling(
        () => saveTagsToDatabase(tags, contentId)
      );
    }
    
    return new Response(
      JSON.stringify({ 
        tags, 
        success: save ? saveResult.success : true,
        message: saveResult.message,
        error: generationError || saveResult.error,
        fallback: generationError !== null
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating tags:", error);
    
    // Return a fallback response with generic tags
    return new Response(
      JSON.stringify({ 
        tags: ["content", "text", "document", "analysis", "metadata"], 
        error: "An error occurred, returning fallback tags",
        fallback: true
      }),
      {
        status: 200, // Return 200 with fallback tags instead of error
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
