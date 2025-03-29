
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ContentPanel } from "./ContentPanel";
import { MetadataPanel } from "./MetadataPanel/MetadataPanel";
import { useMarkdownMetadata, useTagManagement, useContentProcessor } from "@/hooks/markdown-viewer";

export interface MarkdownViewerProps {
  content: string;
  contentId: string;
  editable?: boolean;
  className?: string;
}

export function MarkdownViewer({ content, contentId, editable = false, className }: MarkdownViewerProps) {
  const { user } = useAuth();
  const { metadata, isPending, startTransition } = useMarkdownMetadata(contentId);
  const { processedContent } = useContentProcessor(content);
  const { newTag, setNewTag, handleAddTag, handleDeleteTag } = useTagManagement({
    contentId, 
    editable
  });
  
  // For local state management of tags
  const [tags, setTags] = useState(metadata.tags);
  
  // Update local tags when metadata tags change
  React.useEffect(() => {
    setTags(metadata.tags);
  }, [metadata.tags]);

  const onAddTag = async () => {
    await handleAddTag(tags, setTags);
  };

  const onDeleteTag = async (tagId: string) => {
    await handleDeleteTag(tagId, tags, setTags);
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      <div className="flex-1">
        <ContentPanel 
          content={content} 
          processedContent={processedContent} 
          externalSourceUrl={metadata.externalSourceUrl}
        />
      </div>

      <div className="w-full lg:w-1/3 lg:max-w-xs">
        <MetadataPanel
          tags={tags}
          ontologyTerms={metadata.ontologyTerms}
          domain={metadata.domain}
          externalSourceUrl={metadata.externalSourceUrl}
          lastCheckedAt={metadata.lastCheckedAt}
          needsExternalReview={metadata.needsExternalReview}
          isLoading={metadata.isLoading}
          newTag={newTag}
          setNewTag={setNewTag}
          editable={editable}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
          isPending={isPending}
          sourceId={contentId}
        />
      </div>
    </div>
  );
}

// Default export
export default MarkdownViewer;
