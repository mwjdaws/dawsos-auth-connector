
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  const { user } = useAuth();
  
  // Add console log to check content being rendered
  console.log("Rendering preview with content length:", content?.length || 0);
  
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium mb-1">
        Preview
      </label>
      <div className={cn("flex-1 border rounded-md p-4 overflow-auto min-h-[500px] prose prose-sm dark:prose-invert max-w-none", className)}>
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div className="text-muted-foreground italic">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertCircle className="w-8 h-8 mb-2 text-amber-500" />
                <p>Login required to view this content due to permission settings.</p>
              </div>
            ) : (
              <p>Preview will appear here...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreview;
