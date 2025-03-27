
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TagListProps {
  tags: string[];
  isLoading: boolean;
}

export function TagList({ tags, isLoading }: TagListProps) {
  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Generating Tags...</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
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
