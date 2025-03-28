
import { useState, useEffect, useTransition } from "react";
import { processWikilinks } from "@/components/MarkdownViewer/utils/wikilinksProcessor";

export const useContentProcessor = (content: string) => {
  const [processedContent, setProcessedContent] = useState(content);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setProcessedContent(processWikilinks(content));
    });
  }, [content]);

  return {
    processedContent,
    contentIsPending: isPending
  };
};
