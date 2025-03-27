
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BatchInsertResult } from "./types";

export function useBatchProcessor() {
  const processBatch = useCallback(async (
    tagObjects: { name: string; content_id: string }[],
    batchSize: number = 50
  ): Promise<BatchInsertResult> => {
    // Use a batch size to prevent potential DB performance issues with large tag sets
    let allSuccess = true;
    let insertedCount = 0;
    
    for (let i = 0; i < tagObjects.length; i += batchSize) {
      const batch = tagObjects.slice(i, i + batchSize);
      
      // Track progress for large tag sets
      if (tagObjects.length > batchSize) {
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tagObjects.length / batchSize)}`);
      }
      
      const { error } = await supabase
        .from("tags")
        .insert(batch)
        .select();
        
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        allSuccess = false;
        return {
          success: false,
          count: insertedCount,
          error
        };
      }
      
      insertedCount += batch.length;
    }
    
    return {
      success: true,
      count: insertedCount
    };
  }, []);

  return { processBatch };
}
