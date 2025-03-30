/**
 * Edge Function Reliability Utilities
 * 
 * Provides robust utilities for reliable edge function invocation including:
 * - Automatic retries with exponential backoff
 * - Request timeout handling
 * - Error classification and standardized handling
 * - Fallback mechanisms for graceful degradation
 * - Request deduplication
 * - Network resilience
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "../hooks/use-toast";
import { handleError } from "./errors";

/**
 * Configuration options for edge function invocation
 */
export interface EdgeFunctionOptions {
  /**
   * Maximum time (in milliseconds) to wait for function execution
   * @default 10000 (10 seconds)
   */
  timeoutMs?: number;
  
  /**
   * Maximum number of retry attempts if the function fails
   * @default 2
   */
  maxRetries?: number;
  
  /**
   * Base delay (in milliseconds) between retry attempts
   * This will be multiplied by 2^retryAttempt for exponential backoff
   * @default 1000 (1 second)
   */
  retryDelay?: number;
  
  /**
   * Whether to show error toast notifications to the user
   * @default true
   */
  showErrorToast?: boolean;
  
  /**
   * Optional fallback function to execute if all retries fail
   * Allows graceful degradation of functionality
   */
  fallbackFn?: () => any;
  
  /**
   * Request ID for deduplication
   * If provided, identical requests within the deduplication window will return cached results
   */
  requestId?: string;
  
  /**
   * Time window (in milliseconds) for request deduplication
   * @default 5000 (5 seconds)
   */
  deduplicationWindowMs?: number;
}

// Request deduplication cache
const requestCache = new Map<string, {
  timestamp: number;
  promise: Promise<any>;
  result?: any;
}>();

/**
 * Invokes a Supabase Edge Function with enhanced reliability features
 * 
 * @param functionName - The name of the edge function to invoke
 * @param payload - The payload to send to the function
 * @param options - Configuration options for reliability features
 * @returns Promise resolving to the function response data
 * @throws Error if all attempts fail and no fallback is provided
 * 
 * @example
 * ```typescript
 * try {
 *   const data = await invokeEdgeFunctionReliably('generate-tags', 
 *     { text: 'Sample content' },
 *     { maxRetries: 3 }
 *   );
 *   console.log('Generated tags:', data);
 * } catch (error) {
 *   console.error('Failed to generate tags:', error);
 * }
 * ```
 */
export async function invokeEdgeFunctionReliably<T = any>(
  functionName: string,
  payload: any = {},
  options: EdgeFunctionOptions = {}
): Promise<T> {
  const {
    timeoutMs = 10000,
    maxRetries = 2,
    retryDelay = 1000,
    showErrorToast = true,
    fallbackFn,
    requestId,
    deduplicationWindowMs = 5000
  } = options;

  // Handle request deduplication if requestId is provided
  if (requestId) {
    const cacheKey = `${functionName}:${requestId}`;
    const cachedRequest = requestCache.get(cacheKey);
    
    // Return cached result if it's still valid
    if (cachedRequest && (Date.now() - cachedRequest.timestamp) < deduplicationWindowMs) {
      console.log(`Using cached result for edge function ${functionName} (requestId: ${requestId})`);
      
      if (cachedRequest.result) {
        return cachedRequest.result;
      }
      
      // If still in progress, wait for the existing promise
      return cachedRequest.promise;
    }
    
    // Clean up expired cache entries
    for (const [key, value] of requestCache.entries()) {
      if (Date.now() - value.timestamp > deduplicationWindowMs) {
        requestCache.delete(key);
      }
    }
  }

  // Function to make a single attempt
  const makeAttempt = async (attempt: number): Promise<T> => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Edge function ${functionName} timed out after ${timeoutMs}ms`)), timeoutMs);
      });

      // Create the function call promise
      const functionPromise = supabase.functions.invoke(functionName, {
        body: payload
      });

      // Race the function call against the timeout
      const { data, error } = await Promise.race([
        functionPromise,
        timeoutPromise
      ]) as any;

      // Handle Supabase error
      if (error) {
        // Check if it's a network error (common in unstable connections)
        const isNetworkError = error.message?.includes('NetworkError') || 
                              error.message?.includes('Failed to fetch');
        
        // For network errors, we can be more aggressive with retries
        if ((isNetworkError || error.status >= 500) && attempt < maxRetries) {
          console.warn(`Network or server error calling edge function ${functionName} (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
          
          // Use shorter delays for network errors since they might resolve quicker
          const delay = isNetworkError ? 
            retryDelay * Math.pow(1.5, attempt) : 
            retryDelay * Math.pow(2, attempt);
            
          await new Promise(resolve => setTimeout(resolve, delay));
          return makeAttempt(attempt + 1);
        }
        
        throw error;
      }

      // Return the data on success
      return data as T;
    } catch (error) {
      if (attempt < maxRetries) {
        console.warn(`Error in edge function ${functionName} (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return makeAttempt(attempt + 1);
      }
      throw error;
    }
  };

  // Create a wrapper promise to handle result caching
  const executeWithCaching = async (): Promise<T> => {
    try {
      // Make the first attempt
      const result = await makeAttempt(0);
      
      // Store the result in cache if using request deduplication
      if (requestId) {
        const cacheKey = `${functionName}:${requestId}`;
        const existing = requestCache.get(cacheKey);
        if (existing) {
          existing.result = result;
        }
      }
      
      return result;
    } catch (error) {
      // All retries failed, use fallback if provided
      if (fallbackFn) {
        try {
          console.log(`Using fallback for edge function ${functionName}`);
          return await fallbackFn();
        } catch (fallbackError) {
          console.error(`Fallback for edge function ${functionName} failed:`, fallbackError);
          // Continue to error handling
        }
      }

      // Show toast if enabled
      if (showErrorToast) {
        toast({
          title: "Operation Failed",
          description: `The operation couldn't be completed. Please try again later.`,
          variant: "destructive",
        });
      }

      // Log detailed error with context
      handleError(
        error,
        `Edge function ${functionName} failed after ${maxRetries} retries`,
        {
          level: "error",
          context: { functionName, payload }
        }
      );

      throw error;
    }
  };

  // If using request deduplication, cache the promise and return
  if (requestId) {
    const cacheKey = `${functionName}:${requestId}`;
    const promise = executeWithCaching();
    
    requestCache.set(cacheKey, {
      timestamp: Date.now(),
      promise
    });
    
    return promise;
  }
  
  // Otherwise just execute directly
  return executeWithCaching();
}

/**
 * Batch multiple edge function calls with a single promise
 * 
 * This is useful for making multiple related calls where you want a single
 * success/failure result and don't want to bombard the user with multiple
 * error messages if they fail.
 * 
 * @param batches - Array of function call configurations
 * @param options - Global options that apply to all calls
 * @returns Promise resolving to array of results or errors
 */
export async function batchEdgeFunctionCalls<T = any>(
  batches: Array<{
    functionName: string;
    payload: any;
    options?: EdgeFunctionOptions;
  }>,
  options: EdgeFunctionOptions = {}
): Promise<Array<{ success: boolean; data?: T; error?: any }>> {
  const globalOptions: EdgeFunctionOptions = {
    showErrorToast: false, // Don't show individual toasts
    ...options
  };
  
  const results = await Promise.all(
    batches.map(async ({ functionName, payload, options = {} }) => {
      try {
        const mergedOptions: EdgeFunctionOptions = {
          ...globalOptions,
          ...options,
          showErrorToast: false // Ensure no toasts for individual calls
        };
        
        const data = await invokeEdgeFunctionReliably<T>(
          functionName,
          payload,
          mergedOptions
        );
        
        return { success: true, data };
      } catch (error) {
        console.error(`Batch call to ${functionName} failed:`, error);
        return { success: false, error };
      }
    })
  );
  
  // Show a single toast for the entire batch if any failed
  const failures = results.filter(r => !r.success).length;
  
  if (failures > 0 && globalOptions.showErrorToast !== false) {
    toast({
      title: `${failures} operation${failures > 1 ? 's' : ''} failed`,
      description: `${failures} out of ${results.length} operations couldn't be completed.`,
      variant: "destructive",
    });
  }
  
  return results;
}
