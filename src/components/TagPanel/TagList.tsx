
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TagListProps {
  tags: string[];
  isLoading: boolean;
  expectedTags?: number; // New prop for expected number of tags
}

export function TagList({ tags, isLoading, expectedTags = 5 }: TagListProps) {
  // Dynamic skeleton count based on expected number of tags
  const skeletonCount = expectedTags > 0 ? expectedTags : 5;

  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Generating Tags...</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Generated Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 rounded-xl text-sm">{tag}</span>
        ))}
      </div>
    </div>
  );
}
