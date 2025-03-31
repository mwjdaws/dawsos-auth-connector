
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { withErrorHandling } from "@/utils/errors";

interface TagContentGeneratorProps {
  onGenerate: (content: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function TagContentGenerator({ onGenerate, disabled = false, isLoading = false }: TagContentGeneratorProps) {
  const [content, setContent] = useState<string>("");
  
  const handleGenerateClick = () => {
    if (!content.trim()) return;
    
    try {
      onGenerate(content);
    } catch (error) {
      console.error("Error generating tags:", error);
    }
  };
  
  // Wrap generation with error handling
  const safeGenerateClick = withErrorHandling(handleGenerateClick, {
    errorMessage: "Failed to generate tags from content",
    level: "error"
  });
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Generate Tags from Content</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Enter text content below to automatically generate relevant tags.
          </p>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste content here to generate tags..."
          className="min-h-[120px]"
          disabled={disabled || isLoading}
        />
        
        <div className="flex justify-end">
          <Button
            onClick={safeGenerateClick}
            disabled={!content.trim() || disabled || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Tags"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TagContentGenerator;
