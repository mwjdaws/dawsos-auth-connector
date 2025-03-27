
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
              content: "You are a tag generation assistant. Extract 5-10 relevant tags from the provided content. Return ONLY a JSON array of string tags, nothing else."
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
      const parsedTags = parseTagsFromResponse(tagsContent);
      console.log("Final parsed tags:", parsedTags);
      
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

function parseTagsFromResponse(tagsContent: string): string[] {
  let tags: string[] = [];
  try {
    // Try to parse if response is a JSON array
    if (tagsContent.trim().startsWith("[") && tagsContent.trim().endsWith("]")) {
      tags = JSON.parse(tagsContent);
    } else if (tagsContent.trim().startsWith("{") && tagsContent.trim().endsWith("}")) {
      // Try to parse if response is a JSON object with a tags property
      const parsedObject = JSON.parse(tagsContent);
      if (Array.isArray(parsedObject.tags)) {
        tags = parsedObject.tags;
      } else {
        // Try to extract tags from object values
        tags = Object.values(parsedObject).filter(value => typeof value === 'string');
      }
    } else {
      // Otherwise, split by commas, newlines, or bullets
      tags = tagsContent
        .split(/[\n,•\-]+/)
        .map(tag => tag.trim())
        .filter(tag => tag && !tag.startsWith("[") && !tag.endsWith("]") && tag.length > 1);
    }
    
    // Deduplicate tags (case-insensitive)
    const uniqueTags: string[] = [];
    const seenTags = new Set<string>();
    
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (!seenTags.has(lowerTag)) {
        seenTags.add(lowerTag);
        uniqueTags.push(tag);
      }
    }
    
    tags = uniqueTags;
    
  } catch (parseError) {
    console.error("Error parsing tags:", parseError);
    // Fallback: split by commas or newlines
    tags = tagsContent
      .split(/[\n,]+/)
      .map(tag => tag.trim())
      .filter(tag => tag && tag.length > 1);
  }

  // If tags array is still empty, return a default set
  if (tags.length === 0) {
    console.warn("Failed to parse tags, using default tags");
    return getFallbackTags();
  }

  // Limit to 10 tags maximum
  return tags.slice(0, 10);
}

export function getFallbackTags(): string[] {
  return ["content", "document", "text", "analysis", "metadata"];
}
