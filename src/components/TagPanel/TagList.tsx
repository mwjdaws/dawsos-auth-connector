
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TagListProps {
  tags: string[];
  isLoading: boolean;
  skeletonCount?: number; // Optional prop to control the number of skeletons
  knowledgeSourceId?: string; // Keeping this prop for backward compatibility
  onTagClick?: (tag: string) => void; // Keeping this prop for backward compatibility
}

export function TagList({ 
  tags, 
  isLoading, 
  skeletonCount = 5,
  onTagClick = (tag) => console.log(`Tag clicked: ${tag}`)
}: TagListProps) {
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
        {renderSkeletons(skeletonCount)}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">No tags available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Generated Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 rounded-xl text-sm cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={() => onTagClick(tag)}
            role="button"
            tabIndex={0}
            aria-label={`Tag: ${tag}. Click to filter or navigate.`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
