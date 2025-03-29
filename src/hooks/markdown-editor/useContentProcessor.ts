
import { useState, useEffect, useCallback, useTransition } from "react";
import { processWikilinks } from "@/components/MarkdownViewer/utils/wikilinksProcessor";
import { useWikiLinks } from "./useWikiLinks";

interface ContentProcessorProps {
  content: string;
  sourceId?: string;
  onContentChange?: (content: string) => void;
  processLinks?: boolean;
}

export const useContentProcessor = ({
  content,
  sourceId,
  onContentChange,
  processLinks = true
}: ContentProcessorProps) => {
  const [processedContent, setProcessedContent] = useState(content);
  const [isPending, startTransition] = useTransition();
  const { processWikilinks: saveWikiLinks, processingLinks } = useWikiLinks(sourceId, onContentChange);

  const processContent = useCallback((rawContent: string) => {
    // Process the content to update wikilink formatting
    return processWikilinks(rawContent);
  }, []);

  useEffect(() => {
    startTransition(() => {
      setProcessedContent(processContent(content));
    });

    // Process and save wikilinks to the database if enabled
    if (processLinks && sourceId) {
      const debounceTimer = setTimeout(() => {
        saveWikiLinks(content);
      }, 2000); // Debounce to avoid too many database operations
      
      return () => clearTimeout(debounceTimer);
    }
  }, [content, processContent, sourceId, processLinks, saveWikiLinks]);

  return {
    processedContent,
    contentIsPending: isPending || processingLinks
  };
};
