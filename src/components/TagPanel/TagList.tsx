
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface TagListProps {
  tags: string[]; // Direct tags
  isLoading: boolean; // Loading state for direct tags
  knowledgeSourceId?: string; // Optional ID for fetching related tags
}

export function TagList({ tags, isLoading, knowledgeSourceId }: TagListProps) {
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [isRelatedLoading, setIsRelatedLoading] = useState<boolean>(false);

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
        toast({
          title: "Error",
          description: "Failed to fetch related tags. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsRelatedLoading(false);
      }
    };

    fetchRelatedTags();
  }, [knowledgeSourceId]);

  // Render skeleton loader
  const renderSkeletons = (count: number) => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-xl" />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Generating Tags...</h3>
        {renderSkeletons(5)}
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
              className="px-2 py-1 bg-blue-100 rounded-xl text-sm cursor-pointer hover:bg-blue-200"
              onClick={() => console.log(`Tag clicked: ${tag}`)}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No tags available.</p>
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
                  className="px-2 py-1 bg-green-100 rounded-xl text-sm cursor-pointer hover:bg-green-200"
                  onClick={() => console.log(`Related tag clicked: ${tag}`)}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No related tags found.</p>
          )}
        </>
      )}
    </div>
  );
}
