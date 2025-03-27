
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors.ts";

export type SaveTagsResult = {
  success: boolean;
  message: string;
  error?: string;
};

export async function saveTagsToDatabase(tags: string[], contentId: string): Promise<SaveTagsResult> {
  try {
    // Create Supabase client using env vars
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials not configured");
      return {
        success: false,
        message: "Tags generated but not saved due to missing Supabase credentials",
        error: "Missing Supabase credentials"
      };
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Prepare tags for insertion
    const tagsToInsert = tags.map(name => ({
      name,
      content_id: contentId
    }));
    
    // Insert tags into the database
    const { error } = await supabase
      .from("tags")
      .insert(tagsToInsert);
      
    if (error) {
      console.error("Error saving tags to database:", error);
      return {
        success: false,
        message: "Tags generated but could not be saved to database",
        error: error.message
      };
    } 
    
    console.log(`Successfully saved ${tagsToInsert.length} tags to database`);
    return {
      success: true,
      message: `${tagsToInsert.length} tags saved to database`
    };
  } catch (error: any) {
    console.error("Error in database operation:", error);
    return {
      success: false,
      message: "Tags generated but error occurred during database save operation",
      error: error.message
    };
  }
}
