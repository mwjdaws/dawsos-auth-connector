
import { corsHeaders } from "./cors.ts";
import { ErrorCode } from "./error-handler.ts";

type TagsResult = {
  tags: string[];
  error?: string;
  fallback?: boolean;
};

// Rate limiting and retry configuration 
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

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

      console.log("Generating tags for content:", content.substring(0, 100) + "...");
      console.log(`Attempt ${retries + 1} of ${MAX_RETRIES + 1}`);

      // Call OpenAI API to generate tags
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
              content: "You are a tag generation assistant. Extract 5-10 relevant tags from the provided content. Return ONLY a JSON array of string tags, nothing else. Do not include any markdown formatting, backticks, or explanations."
            },
            {
              role: "user",
              content
            }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      });

      // Handle rate limiting
      if (openaiResponse.status === 429) {
        const retryAfter = openaiResponse.headers.get("retry-after");
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS * (retries + 1);
        
        console.warn(`Rate limited by OpenAI. Retrying after ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        continue;
      }

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error("OpenAI API error:", errorData);
        
        // If we have retries left, try again
        if (retries < MAX_RETRIES) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * retries));
          continue;
        }
        
        return { 
          tags: getFallbackTags(),
          error: `Used fallback tags due to API error: ${JSON.stringify(errorData)}`,
          fallback: true
        };
      }

      const openaiData = await openaiResponse.json();
      const tagsContent = openaiData.choices[0].message.content;
      console.log("Raw OpenAI response:", tagsContent);
      
      // Process and return the tags
      const parsedTags = sanitizeTagsResponse(tagsContent);
      console.log("Final sanitized tags:", parsedTags);
      
      return { tags: parsedTags };
    } catch (error) {
      console.error(`Error generating tags with OpenAI (attempt ${retries + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If we have retries left, try again
      if (retries < MAX_RETRIES) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * retries));
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
 * Sanitizes and cleans the tags response from OpenAI
 * Handles various response formats and removes markdown artifacts
 */
function sanitizeTagsResponse(rawResponse: string): string[] {
  if (!rawResponse || typeof rawResponse !== 'string') {
    console.error("Invalid response format, received:", rawResponse);
    return getFallbackTags();
  }

  // Log the original response for debugging
  console.log("Sanitizing raw response:", rawResponse);
  
  // Step 1: Remove markdown code block syntax
  let cleanedResponse = rawResponse
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
  
  console.log("After removing markdown:", cleanedResponse);
  
  try {
    // Step 2: Try to parse as JSON if it looks like JSON
    if (
      (cleanedResponse.startsWith('[') && cleanedResponse.endsWith(']')) || 
      (cleanedResponse.startsWith('{') && cleanedResponse.endsWith('}'))
    ) {
      const parsedJson = JSON.parse(cleanedResponse);
      
      // Handle array format
      if (Array.isArray(parsedJson)) {
        console.log("Parsed JSON array successfully");
        return cleanTagArray(parsedJson);
      }
      
      // Handle object format with a tags property
      if (parsedJson && typeof parsedJson === 'object' && parsedJson.tags && Array.isArray(parsedJson.tags)) {
        console.log("Parsed JSON object with tags property");
        return cleanTagArray(parsedJson.tags);
      }
      
      // Handle object format where values are the tags
      if (parsedJson && typeof parsedJson === 'object') {
        console.log("Parsed JSON object, extracting values");
        const tagValues = Object.values(parsedJson)
          .filter(val => typeof val === 'string')
          .map(val => String(val));
        return cleanTagArray(tagValues);
      }
    }
  } catch (parseError) {
    console.error("JSON parsing failed:", parseError);
    // Continue to alternative parsing methods
  }
  
  // Step 3: Try to parse as a line-by-line list
  console.log("Trying line-by-line parsing");
  const lineBasedTags = cleanedResponse
    .split(/[\n,]+/)
    .map(line => {
      // Remove list markers, quotes and trim
      return line
        .replace(/^[-*•]/, '')
        .replace(/["'`]/g, '')
        .trim();
    })
    .filter(tag => tag && tag.length > 1);

  if (lineBasedTags.length > 0) {
    console.log("Line-based parsing successful");
    return cleanTagArray(lineBasedTags);
  }
  
  // Step 4: Last resort - split by spaces and hope for the best
  console.log("Using last resort space-based parsing");
  const wordBasedTags = cleanedResponse
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 2 && !word.includes('[') && !word.includes(']'));
  
  if (wordBasedTags.length > 0) {
    return cleanTagArray(wordBasedTags);
  }
  
  console.warn("All parsing methods failed, returning fallback tags");
  return getFallbackTags();
}

/**
 * Clean and deduplicate a tag array
 */
function cleanTagArray(tags: any[]): string[] {
  if (!Array.isArray(tags)) {
    console.error("Expected array input for cleanTagArray, got:", typeof tags);
    return getFallbackTags();
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
  
  // Limit to 10 tags maximum
  return uniqueTags.slice(0, 10);
}

export function getFallbackTags(): string[] {
  return ["content", "document", "text", "analysis", "metadata"];
}
