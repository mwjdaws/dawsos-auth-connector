
/**
 * Edge Function Reliability Utilities
 * 
 * These utilities help improve reliability when working with Supabase Edge Functions
 * by adding retry logic, timeout handling, and fallback options.
 */

import { toast } from "@/hooks/use-toast";

/**
 * Timeout wrapper for edge function calls
 * Prevents hanging UI if an edge function doesn't respond in a reasonable time
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs = 10000,
  fallbackValue?: T
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    // Set timeout to reject or return fallback
    const timeoutId = setTimeout(() => {
      if (fallbackValue !== undefined) {
        console.warn(`Edge function call timed out after ${timeoutMs}ms, using fallback value`);
        resolve(fallbackValue);
      } else {
        reject(new Error(`Edge function call timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    // Try to execute the actual promise
    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

/**
 * Retry wrapper for edge function calls
 * Automatically retries failed calls with exponential backoff
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    onRetry?: (attempt: number, error: Error) => void;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 5000,
    onRetry = (attempt, error) => console.warn(`Retry attempt ${attempt} after error: ${error.message}`),
    shouldRetry = () => true
  } = options;

  let lastError: Error;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // First attempt or retry
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we should retry
      if (attempt >= maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      // Log retry
      onRetry(attempt + 1, lastError);
      
      // Wait before next retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelayMs);
    }
  }

  // This should never be reached, but TypeScript requires a return value
  throw lastError!;
};

/**
 * Enhances supabase.functions.invoke with reliability features
 * - Adds timeout protection
 * - Adds automatic retry with exponential backoff
 * - Provides fallback mechanisms
 */
export const invokeEdgeFunctionReliably = async <T>(
  functionName: string,
  payload?: any,
  options?: {
    timeoutMs?: number;
    maxRetries?: number;
    fallbackFn?: () => Promise<T> | T;
    showErrorToast?: boolean;
  }
): Promise<T> => {
  const { 
    timeoutMs = 10000,
    maxRetries = 2,
    fallbackFn,
    showErrorToast = true 
  } = options || {};
  
  try {
    // Import supabase dynamically to avoid issues with edge functions
    const { supabase } = await import("@/integrations/supabase/client");
    
    // Call with retry and timeout protection
    return await withRetry(
      async () => {
        const response = await withTimeout(
          supabase.functions.invoke<T>(functionName, {
            body: payload
          }),
          timeoutMs
        );
        
        if (response.error) {
          throw new Error(`Edge function ${functionName} failed: ${response.error.message}`);
        }
        
        return response.data as T;
      },
      { maxRetries }
    );
  } catch (error) {
    console.error(`Failed to call edge function ${functionName}:`, error);
    
    if (showErrorToast) {
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Failed to complete operation",
        variant: "destructive",
      });
    }
    
    // Use fallback function if provided
    if (fallbackFn) {
      console.log(`Using fallback for edge function ${functionName}`);
      return await Promise.resolve(fallbackFn());
    }
    
    throw error;
  }
};
