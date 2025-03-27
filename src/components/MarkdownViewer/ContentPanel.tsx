
import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { renderWikiLinks } from "./utils/wikilinksProcessor";

interface ContentPanelProps {
  content: string;
  processedContent: string;
}

export function ContentPanel({ content, processedContent }: ContentPanelProps) {
  const handleWikiLinkClick = (linkText: string) => {
    console.log(`Wiki link clicked: ${linkText}`);
    toast({
      title: "Wiki Link Clicked",
      description: `You clicked on the wiki link: ${linkText}`,
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Markdown content copied to clipboard",
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Content</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              if (typeof children === 'string') {
                return <p>{renderWikiLinks(children, handleWikiLinkClick)}</p>;
              }
              return <p>{children}</p>;
            },
            a: ({ node, ...props }) => (
              <a {...props} className="text-blue-500 hover:underline" />
            )
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default ContentPanel;
