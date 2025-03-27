
import React, { useState, useEffect, useTransition, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface Metadata {
  tags?: string[];
  ontology_terms?: string[];
  [key: string]: any; // For any additional metadata
}

interface MarkdownPanelProps {
  content: string;
  metadata?: Metadata;
  className?: string;
}

// Helper function to process wikilinks in markdown content
const processWikilinks = (content: string): string => {
  // Replace [[wikilinks]] with a link format
  return content.replace(/\[\[(.*?)\]\]/g, (match, linkText) => {
    return `[${linkText}](#/wiki/${encodeURIComponent(linkText)})`;
  });
};

const MarkdownPanel: React.FC<MarkdownPanelProps> = memo(({ 
  content, 
  metadata = {}, 
  className 
}) => {
  const [isPending, startTransition] = useTransition();
  const [renderedContent, setRenderedContent] = useState<string>(content);
  const isMounted = useRef(true);

  // Set up cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update the rendered content when the input content changes
  useEffect(() => {
    if (content !== renderedContent && isMounted.current) {
      startTransition(() => {
        // Process wikilinks before setting the content
        const processedContent = processWikilinks(content);
        setRenderedContent(processedContent);
      });
    }
  }, [content, renderedContent]);
  
  // Extract metadata
  const { tags = [], ontology_terms = [], ...otherMetadata } = metadata;
  
  // Check if there's any metadata to display
  const hasMetadata = tags.length > 0 || ontology_terms.length > 0 || Object.keys(otherMetadata).length > 0;

  // Memoize metadata display to prevent unnecessary re-renders
  const metadataDisplay = useMemo(() => {
    if (!hasMetadata) return null;
    
    return (
      <Card className="border rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {ontology_terms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Ontology Terms</h4>
              <div className="flex flex-wrap gap-2">
                {ontology_terms.map((term, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {Object.entries(otherMetadata).map(([key, value]) => (
            <div key={key}>
              <h4 className="text-sm font-medium mb-1 capitalize">{key.replace('_', ' ')}</h4>
              <div className="text-sm">
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }, [hasMetadata, tags, ontology_terms, otherMetadata]);
  
  // Memoize the markdown content
  const markdownContent = useMemo(() => (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown>{renderedContent}</ReactMarkdown>
    </div>
  ), [renderedContent]);
  
  return (
    <div className={cn("space-y-4", className)}>
      {metadataDisplay}
      {markdownContent}
      {isPending && <div className="text-sm text-muted-foreground mt-2">Rendering content...</div>}
    </div>
  );
});

export default MarkdownPanel;
