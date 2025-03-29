
import { corsHeaders } from "./cors.ts";
import { ErrorCode } from "./error-handler.ts";

type TagsResult = {
  tags: string[];
  error?: string;
  fallback?: boolean;
  tag_types?: Record<string, string[]>;
};

// Rate limiting and retry configuration 
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const MAX_TOKENS = 350; // Increased token limit for more detailed responses with categorization

// Main function to generate tags using OpenAI
export async function generateTagsWithOpenAI(content: string): Promise<TagsResult> {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries <= MAX_RETRIES) {
    try {
      const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openaiApiKey) {
        console.error("OpenAI API key not configured");
        return { 
          tags: getFallbackTags(),
          error: "OpenAI API key not configured",
          fallback: true
        };
      }

      // Truncate content for logging
      const truncatedContent = content.length > 150 
        ? content.substring(0, 150) + "..." 
        : content;
      
      console.log(`Generating tags for content: ${truncatedContent}`);
      console.log(`Attempt ${retries + 1} of ${MAX_RETRIES + 1}`);

      // Create a more structured prompt for better tag categorization
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a tag generation assistant that categorizes tags into predefined types. 
              Extract 5-15 relevant tags from the provided content and categorize them by type.
              Available tag types: Topic, System, Debug, Error, Process, Compliance.
              Return ONLY a JSON object with a "tags" array for uncategorized tags and properties for each applicable tag type.
              Example format: {"tags": ["general_tag1", "general_tag2"], "Topic": ["topic1", "topic2"], "System": ["system1"]}`
            },
            {
              role: "user",
              content
            }
          ],
          temperature: 0.2, // Lower temperature for more consistent results
          max_tokens: MAX_TOKENS,
          response_format: { type: "json_object" } // Enforce JSON response format
        })
      });

      // Handle rate limiting with exponential backoff
      if (openaiResponse.status === 429) {
        const retryAfter = openaiResponse.headers.get("retry-after");
        const waitTime = retryAfter 
          ? parseInt(retryAfter, 10) * 1000 
          : RETRY_DELAY_MS * Math.pow(2, retries);
        
        console.warn(`Rate limited by OpenAI. Retrying after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        continue;
      }

      // Handle other API errors
      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error("OpenAI API error:", errorData);
        
        if (retries < MAX_RETRIES) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries - 1)));
          continue;
        }
        
        return { 
          tags: getFallbackTags(),
          error: `Used fallback tags due to API error: ${JSON.stringify(errorData)}`,
          fallback: true
        };
      }

      const openaiData = await openaiResponse.json();
      const responseContent = openaiData.choices[0].message.content;
      console.log("Raw OpenAI response:", responseContent);
      
      // Process and parse the response
      const result = parseTagsResponse(responseContent);
      console.log("Final processed tags:", result);
      
      return result;
    } catch (error) {
      console.error(`Error generating tags with OpenAI (attempt ${retries + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (retries < MAX_RETRIES) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries - 1)));
        continue;
      }
      
      return { 
        tags: getFallbackTags(),
        error: `An error occurred, returning fallback tags: ${lastError.message}`,
        fallback: true
      };
    }
  }

  // This should never be reached if the loop works correctly, but is here as a safety fallback
  return { 
    tags: getFallbackTags(),
    error: lastError ? lastError.message : "Maximum retries exceeded",
    fallback: true
  };
}

/**
 * Parse and process the OpenAI response, extracting tags and tag types
 */
function parseTagsResponse(responseContent: string): TagsResult {
  if (!responseContent || typeof responseContent !== 'string') {
    console.error("Invalid response format, received:", responseContent);
    return { tags: getFallbackTags(), fallback: true };
  }

  try {
    // Parse JSON response
    const parsedResponse = JSON.parse(responseContent);
    
    // Extract general tags
    let allTags: string[] = [];
    if (Array.isArray(parsedResponse.tags)) {
      allTags = cleanTagArray(parsedResponse.tags);
    }
    
    // Create tag_types object for categorized tags
    const tagTypes: Record<string, string[]> = {};
    const validTagTypes = ["Topic", "System", "Debug", "Error", "Process", "Compliance"];
    
    // Process each tag type
    validTagTypes.forEach(tagType => {
      if (parsedResponse[tagType] && Array.isArray(parsedResponse[tagType])) {
        const cleanedTypeTags = cleanTagArray(parsedResponse[tagType]);
        if (cleanedTypeTags.length > 0) {
          tagTypes[tagType] = cleanedTypeTags;
          
          // Add to the overall tags array if not already included
          cleanedTypeTags.forEach(tag => {
            if (!allTags.includes(tag)) {
              allTags.push(tag);
            }
          });
        }
      }
    });
    
    // Ensure we have at least some tags
    if (allTags.length === 0) {
      console.warn("No valid tags found in response, using fallback");
      return { tags: getFallbackTags(), fallback: true };
    }
    
    return { 
      tags: allTags,
      tag_types: Object.keys(tagTypes).length > 0 ? tagTypes : undefined
    };
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error);
    return { tags: getFallbackTags(), fallback: true };
  }
}

/**
 * Clean and deduplicate a tag array
 */
function cleanTagArray(tags: any[]): string[] {
  if (!Array.isArray(tags)) {
    console.error("Expected array input for cleanTagArray, got:", typeof tags);
    return [];
  }
  
  // Filter and clean tags
  const cleanedTags = tags
    .map(tag => {
      // Ensure tag is a string
      const tagStr = String(tag).trim();
      
      // Remove quotes, backticks, etc.
      return tagStr
        .replace(/^["'`]|["'`]$/g, '')
        .replace(/\\n/g, '')
        .trim();
    })
    .filter(tag => {
      // Filter out invalid tags
      return (
        tag && 
        tag.length > 1 && 
        !tag.includes('```') &&
        !tag.startsWith('[') &&
        !tag.endsWith(']') &&
        tag !== 'undefined' &&
        tag !== 'null'
      );
    });
  
  // Deduplicate tags (case-insensitive)
  const uniqueTags: string[] = [];
  const seenTags = new Set<string>();
  
  for (const tag of cleanedTags) {
    const lowerTag = tag.toLowerCase();
    if (!seenTags.has(lowerTag)) {
      seenTags.add(lowerTag);
      uniqueTags.push(tag);
    }
  }
  
  // Limit to 15 tags maximum
  return uniqueTags.slice(0, 15);
}

/**
 * Provide fallback tags when tag generation fails
 */
export function getFallbackTags(): string[] {
  return ["content", "document", "text", "analysis", "metadata"];
}
