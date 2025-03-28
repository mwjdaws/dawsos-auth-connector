
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/error-handling";

interface TagListProps {
  tags: string[]; // Direct tags
  isLoading: boolean; // Loading state for direct tags
  knowledgeSourceId?: string; // Optional ID for fetching related tags
  onTagClick?: (tag: string) => void; // Callback for tag clicks
}

export function TagList({ 
  tags, 
  isLoading, 
  knowledgeSourceId,
  onTagClick = (tag) => console.log(`Tag clicked: ${tag}`)
}: TagListProps) {
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState<boolean>(false);
  
  // Calculate expected tag count based on content length or complexity
  // This is a placeholder implementation - in a real app, this could be based on content analysis
  const expectedTagCount = tags.length > 0 ? tags.length : Math.floor(Math.random() * 4) + 3;

  // Fetch related tags based on ontology relationships
  useEffect(() => {
    if (!knowledgeSourceId || knowledgeSourceId.startsWith("temp-")) return;

    const fetchRelatedTags = async () => {
      setIsRelatedLoading(true);
      try {
        const response = await fetch(`/api/ontology-relationships?knowledgeSourceId=${knowledgeSourceId}`);
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        setRelatedTags(data.relatedTags || []);
        
        console.log(`Related tags fetched for source ID ${knowledgeSourceId}:`, data.relatedTags);
      } catch (error) {
        console.error("Failed to fetch related tags:", error);
        handleError(error, "Failed to fetch related tags. Please try again later.", {
          level: "error",
          title: "Error Loading Related Tags"
        });
      } finally {
        setIsRelatedLoading(false);
      }
    };

    fetchRelatedTags();
  }, [knowledgeSourceId]);

  // Render skeleton loader with dynamic count
  const renderSkeletons = (count: number) => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-xl" />
      ))}
    </div>
  );

  // Click handler for tags with interactivity
  const handleTagClick = (tag: string) => {
    onTagClick(tag);
  };

  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Generating Tags...</h3>
        {renderSkeletons(expectedTagCount)}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Direct Tags */}
      <h3 className="text-sm font-medium mb-2">Generated Tags:</h3>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 rounded-xl text-sm cursor-pointer hover:bg-blue-200 transition-colors"
              onClick={() => handleTagClick(tag)}
              role="button"
              tabIndex={0}
              aria-label={`Tag: ${tag}. Click to filter or navigate.`}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No tags available. Generate tags by adding content above.</p>
      )}

      {/* Related Tags */}
      {knowledgeSourceId && !knowledgeSourceId.startsWith("temp-") && (
        <>
          <h3 className="text-sm font-medium mt-4 mb-2">Related Tags:</h3>
          {isRelatedLoading ? (
            renderSkeletons(3)
          ) : relatedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 rounded-xl text-sm cursor-pointer hover:bg-green-200 transition-colors"
                  onClick={() => handleTagClick(tag)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Related tag: ${tag}. Click to filter or navigate.`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No related tags found for this content.</p>
          )}
        </>
      )}
    </div>
  );
}
