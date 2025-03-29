
import { useState, useEffect, useTransition, useCallback } from "react";
import { processWikilinks } from "@/components/MarkdownViewer/utils/wikilinksProcessor";
import { useWikiLinks } from "@/hooks/markdown-editor/useWikiLinks";

export const useContentProcessor = (content: string, sourceId?: string) => {
  const [processedContent, setProcessedContent] = useState(content || '');
  const [isPending, startTransition] = useTransition();
  const { processWikilinks: saveWikiLinks, processingLinks } = useWikiLinks(sourceId);

  const processContent = useCallback((rawContent: string) => {
    return processWikilinks(rawContent || '');
  }, []);

  useEffect(() => {
    startTransition(() => {
      setProcessedContent(processContent(content));
    });
    
    // Process and save wikilinks to the database if source ID is provided
    if (sourceId) {
      const debounceTimer = setTimeout(() => {
        saveWikiLinks(content || '');
      }, 2000);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [content, processContent, sourceId, saveWikiLinks]);

  return {
    processedContent,
    contentIsPending: isPending || processingLinks
  };
};
