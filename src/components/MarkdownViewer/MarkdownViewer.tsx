
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ContentPanel } from "./ContentPanel";
import MetadataPanel from "@/components/MetadataPanel";
import { useMarkdownMetadata, useTagManagement, useContentProcessor } from "@/hooks/markdown-viewer";

export interface MarkdownViewerProps {
  content: string;
  contentId: string;
  editable?: boolean;
  className?: string;
}

export function MarkdownViewer({ content, contentId, editable = false, className }: MarkdownViewerProps) {
  const { processedContent } = useContentProcessor(content);
  
  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      <div className="flex-1">
        <ContentPanel 
          content={content} 
          processedContent={processedContent} 
        />
      </div>

      <div className="w-full lg:w-1/3 lg:max-w-xs">
        <MetadataPanel
          contentId={contentId}
          editable={editable}
          isCollapsible={true}
          initialCollapsed={false}
          showOntologyTerms={true}
          className="h-full"
        />
      </div>
    </div>
  );
}

// Default export
export default MarkdownViewer;
