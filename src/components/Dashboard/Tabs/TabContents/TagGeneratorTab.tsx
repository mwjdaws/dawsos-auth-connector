
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TagPanel } from "@/components";
import { TagCards } from "@/components/TagPanel/TagCards";

interface TagGeneratorTabProps {
  contentId: string;
  onTagsSaved: (newContentId: string) => void;
}

export function TagGeneratorTab({ contentId, onTagsSaved }: TagGeneratorTabProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Tag Generator</h2>
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
        <TagPanel 
          contentId={contentId} 
          onTagsSaved={onTagsSaved} 
        />
      </Suspense>
      
      <h2 className="text-xl font-semibold mb-4 mt-8">Recent Tags</h2>
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
        <TagCards />
      </Suspense>
    </>
  );
}
