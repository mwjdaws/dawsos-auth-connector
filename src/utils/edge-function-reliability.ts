
/**
 * Edge Function Reliability Utilities
 * 
 * Provides utilities for reliable edge function invocation:
 * - Automatic retries with exponential backoff
 * - Timeout handling
 * - Error classification
 * - Fallback mechanisms
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "../hooks/use-toast";
import { handleError } from "./errors";

/**
 * Options for edge function invocation
 */
export interface EdgeFunctionOptions {
  timeoutMs?: number;
  maxRetries?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  fallbackFn?: () => any;
}

/**
 * Invokes a Supabase Edge Function with reliability enhancements
 * 
 * @param functionName The name of the edge function to invoke
 * @param payload The payload to send to the function
 * @param options Configuration options for reliability features
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
    fallbackFn
  } = options;

  let retries = 0;
  let lastError: any = null;

  // Attempt with retries
  while (retries <= maxRetries) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Function ${functionName} timed out after ${timeoutMs}ms`)), timeoutMs);
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
        lastError = error;
        console.error(`Edge function ${functionName} error (attempt ${retries + 1}/${maxRetries + 1}):`, error);
        
        // If it's a server error (5xx), retry
        if (error.status >= 500 && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retries)));
          retries++;
          continue;
        }
        
        throw error;
      }

      // Return the data
      return data as T;
    } catch (error) {
      lastError = error;
      console.error(`Edge function ${functionName} exception (attempt ${retries + 1}/${maxRetries + 1}):`, error);
      
      // Check if we should retry
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retries)));
        retries++;
      } else {
        break;
      }
    }
  }

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
    lastError,
    `Edge function ${functionName} failed after ${retries} retries`,
    {
      level: "error",
      context: { functionName, payload }
    }
  );

  throw lastError;
}
