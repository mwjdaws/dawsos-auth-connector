
import React from "react";
import { Clipboard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ContentIdSectionProps {
  contentId: string;
  className?: string;
}

export function ContentIdSection({ contentId, className = "" }: ContentIdSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(contentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Content ID</h3>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-muted p-1 rounded">{contentId}</code>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopyId}
          className="h-6 w-6 p-0"
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
          <span className="sr-only">Copy ID</span>
        </Button>
      </div>
    </div>
  );
}
