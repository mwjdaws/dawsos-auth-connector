
// OpenAI integration for tag generation
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const OPENAI_MODEL = "gpt-3.5-turbo"; // Using a more reliable model

interface TagGenerationResult {
  tags: string[];
  error: Error | null;
}

/**
 * Generates tags from content using OpenAI's API
 * @param content The content to generate tags from
 * @param useSimplePrompt Whether to use a simplified prompt for better reliability
 * @returns Array of tags
 */
export async function generateTagsWithOpenAI(
  content: string,
  useSimplePrompt = false
): Promise<TagGenerationResult> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const prompt = useSimplePrompt 
      ? "Extract 5-10 simple keywords from this text. Return only a JSON array of strings."
      : "Extract 5-10 relevant tags or keywords from this content. Focus on the main topics and themes. Return the result as a JSON array of strings.";

    // Add exponential backoff retry mechanism
    let retries = 0;
    const maxRetries = 2;
    let lastError = null;

    while (retries <= maxRetries) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              {
                role: "system",
                content: prompt
              },
              {
                role: "user",
                content: content.substring(0, 2000) // Limit content length for API
              }
            ],
            temperature: 0.3 // Lower temperature for more consistent results
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]?.message?.content) {
          throw new Error("Invalid response format from OpenAI");
        }

        const rawResponse = data.choices[0].message.content;
        console.log("Raw OpenAI response:", rawResponse);
        
        // Parse the tags with better error handling
        try {
          // First try to parse as JSON directly
          const parsedTags = JSON.parse(rawResponse);
          if (Array.isArray(parsedTags)) {
            console.log("Final parsed tags:", parsedTags);
            return { tags: parsedTags, error: null };
          }
          
          // If it's not an array, try to extract string array from text
          throw new Error("Response is not an array");
        } catch (parseError) {
          // Attempt to extract JSON array from text
          const arrayMatch = rawResponse.match(/\[([\s\S]*)\]/);
          if (arrayMatch) {
            try {
              const extractedArray = JSON.parse(`[${arrayMatch[1]}]`);
              if (Array.isArray(extractedArray)) {
                console.log("Final parsed tags:", extractedArray);
                return { tags: extractedArray, error: null };
              }
            } catch (e) {
              // Continue to fallback parsing if JSON extraction fails
            }
          }
          
          // Use regex to extract quoted strings as fallback
          const matches = rawResponse.match(/["']([^"']+)["']/g);
          if (matches) {
            const extractedTags = matches.map(m => m.replace(/["']/g, ''));
            console.log("Final parsed tags:", extractedTags);
            return { tags: extractedTags, error: null };
          }
          
          // If we can't extract tags, fall back to basic text splitting
          const words = rawResponse.split(/[,\n]/).map(w => w.trim()).filter(w => w.length > 0);
          if (words.length > 0) {
            console.log("Final parsed tags (fallback):", words);
            return { tags: words, error: null };
          }
          
          console.error("Failed to parse tags, using default tags");
          return { 
            tags: ["content", "document", "text", "analysis", "metadata"],
            error: new Error("Failed to parse OpenAI response") 
          };
        }
      } catch (error) {
        console.error(`OpenAI API error (attempt ${retries + 1}):`, error);
        lastError = error;
        retries++;
        
        if (retries <= maxRetries) {
          // Exponential backoff: wait 2^retries seconds
          const backoffMs = Math.pow(2, retries) * 1000;
          console.log(`Retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    // All retries failed
    return { 
      tags: ["content", "document", "text", "analysis", "metadata"],
      error: lastError 
    };
  } catch (error) {
    console.error("Error in generateTagsWithOpenAI:", error);
    return { 
      tags: ["content", "document", "text", "analysis", "metadata"],
      error 
    };
  }
}
