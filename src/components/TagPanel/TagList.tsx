
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TagListProps {
  tags: string[];
  isLoading: boolean;
  expectedTags?: number;
}

export function TagList({ tags, isLoading, expectedTags = 5 }: TagListProps) {
  // Dynamic skeleton count based on expected number of tags
  const skeletonCount = expectedTags > 0 ? expectedTags : 5;

  if (isLoading) {
    return (
      <div className="mt-4" aria-live="polite">
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
    return (
      <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md text-center" aria-live="polite">
        <p className="text-sm text-muted-foreground">No tags generated yet</p>
      </div>
    );
  }

  return (
    <div className="mt-4" aria-live="polite">
      <h3 className="text-sm font-medium mb-2">Generated Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-blue-100 rounded-xl text-sm">{tag}</span>
        ))}
      </div>
    </div>
  );
}
