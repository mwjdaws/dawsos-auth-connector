
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import MetadataPanel from "@/components/MetadataPanel";

interface MetadataTabProps {
  contentId: string;
  onMetadataChange: () => void;
}

export function MetadataTab({ contentId, onMetadataChange }: MetadataTabProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Content Metadata</h2>
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-lg" />}>
        <MetadataPanel 
          contentId={contentId}
          onMetadataChange={onMetadataChange}
        />
      </Suspense>
    </>
  );
}
