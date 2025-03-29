
/**
 * Batch Processing Utilities
 * 
 * Provides utilities for reliable batch processing with:
 * - Chunking of large datasets
 * - Progress tracking and reporting
 * - Error recovery and partial success handling
 */

import { handleError } from "./errors";

/**
 * Options for batch processing
 */
export interface BatchProcessingOptions<T> {
  /** Items to process in batches */
  items: T[];
  /** Function to process a batch of items */
  processBatch: (batchItems: T[]) => Promise<any[]>;
  /** Size of each batch (default: 10) */
  batchSize?: number;
  /** Function to call with progress updates */
  onProgress?: (processed: number, total: number, results: any[]) => void;
  /** Whether to continue processing if a batch fails (default: true) */
  continueOnError?: boolean;
  /** Time to wait between batches in ms (default: 100) */
  batchDelayMs?: number;
}

/**
 * Result of batch processing
 */
export interface BatchProcessingResult<T> {
  /** Overall success status */
  success: boolean;
  /** Number of items processed successfully */
  successful: number;
  /** Number of items that failed */
  failed: number;
  /** Total number of items processed */
  total: number;
  /** Detailed results for each processed item */
  results: { item: T; success: boolean; result?: any; error?: Error }[];
  /** If the operation was interrupted */
  interrupted?: boolean;
}

/**
 * Processes items in batches with progress tracking and error handling
 */
export async function processBatch<T>(
  options: BatchProcessingOptions<T>
): Promise<BatchProcessingResult<T>> {
  const {
    items,
    processBatch,
    batchSize = 10,
    onProgress,
    continueOnError = true,
    batchDelayMs = 100,
  } = options;

  // Initialize tracking variables
  const total = items.length;
  let processed = 0;
  let successful = 0;
  let failed = 0;
  const results: BatchProcessingResult<T>["results"] = [];
  let interrupted = false;

  // Create a controller to allow interruptions
  const controller = new AbortController();

  // Helper to delay between batches
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    // Process in batches
    for (let i = 0; i < total; i += batchSize) {
      // Check if operation has been aborted
      if (controller.signal.aborted) {
        interrupted = true;
        break;
      }

      // Get current batch
      const batchItems = items.slice(i, i + batchSize);
      
      try {
        // Process current batch
        const batchResults = await processBatch(batchItems);
        
        // Update item results
        batchItems.forEach((item, index) => {
          const success = !!batchResults[index];
          results.push({
            item,
            success,
            result: batchResults[index],
            error: !success ? new Error("Item processing failed") : undefined,
          });

          if (success) successful++;
          else failed++;
        });
      } catch (error) {
        // Handle batch error
        console.error("Batch processing error:", error);
        
        // Mark all items in the failed batch
        batchItems.forEach(item => {
          results.push({
            item,
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
          failed += batchItems.length;
        });
        
        // Stop if configured to not continue on error
        if (!continueOnError) {
          interrupted = true;
          break;
        }
      }
      
      // Update progress
      processed += batchItems.length;
      if (onProgress) {
        onProgress(processed, total, results.map(r => r.result).filter(Boolean));
      }
      
      // Delay before next batch to avoid overwhelming resources
      if (i + batchSize < total) {
        await delay(batchDelayMs);
      }
    }
    
    return {
      success: failed === 0 && !interrupted,
      successful,
      failed,
      total,
      results,
      interrupted,
    };
  } catch (error) {
    // Handle unexpected errors
    handleError(
      error,
      "Batch processing failed unexpectedly",
      { level: "error", context: { processed, total } }
    );
    
    return {
      success: false,
      successful,
      failed: total - successful,
      total,
      results,
      interrupted: true,
    };
  }
}

/**
 * Creates a background batch processor that can be interrupted
 */
export function createBackgroundProcessor<T>() {
  const controller = new AbortController();
  let isRunning = false;
  
  return {
    /**
     * Starts processing in the background
     */
    async startProcessing(options: BatchProcessingOptions<T>): Promise<BatchProcessingResult<T>> {
      if (isRunning) {
        throw new Error("Background processor is already running");
      }
      
      isRunning = true;
      
      try {
        return await processBatch({
          ...options,
          onProgress: (processed, total, results) => {
            if (controller.signal.aborted) {
              throw new Error("Processing was cancelled");
            }
            if (options.onProgress) {
              options.onProgress(processed, total, results);
            }
          },
        });
      } finally {
        isRunning = false;
      }
    },
    
    /**
     * Cancels the current processing
     */
    cancel() {
      controller.abort();
    },
    
    /**
     * Whether processing is currently running
     */
    get isProcessing() {
      return isRunning;
    },
  };
}
