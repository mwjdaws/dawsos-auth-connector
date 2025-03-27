
import { corsHeaders } from "./cors.ts";

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  OPENAI_API_ERROR = "OPENAI_API_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: unknown;
  status: number;
}

/**
 * Creates a standardized error response object
 */
export function createErrorResponse(
  error: unknown, 
  defaultMessage = "An unexpected error occurred", 
  code = ErrorCode.UNKNOWN_ERROR,
  status = 500
): Response {
  // Extract error details
  let message = defaultMessage;
  let details = undefined;
  
  console.error(`Error (${code}):`, error);
  
  if (error instanceof Error) {
    message = error.message || defaultMessage;
    details = error.stack;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object") {
    if ("message" in error) {
      message = String(error.message);
    }
    details = error;
  }
  
  // Create standardized error response
  const errorResponse: ApiError = {
    code,
    message,
    details,
    status
  };
  
  return new Response(
    JSON.stringify(errorResponse),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Validates that required fields exist in the request body
 */
export function validateRequestBody(
  body: unknown, 
  requiredFields: string[]
): { valid: boolean; error?: ApiError } {
  if (!body || typeof body !== "object") {
    return { 
      valid: false, 
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Request body must be a valid JSON object",
        status: 400
      }
    };
  }
  
  const missingFields = requiredFields.filter(field => !(field in body));
  
  if (missingFields.length > 0) {
    return { 
      valid: false, 
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        details: { missingFields },
        status: 400
      }
    };
  }
  
  return { valid: true };
}

/**
 * Global error handler for edge functions
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    console.error("Unhandled error in edge function:", error);
    throw error; // Re-throw to be caught by the main handler
  }
}
