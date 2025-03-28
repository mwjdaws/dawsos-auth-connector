
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium mb-1">
        Preview
      </label>
      <div className={cn("flex-1 border rounded-md p-4 overflow-auto min-h-[500px] prose prose-sm dark:prose-invert max-w-none", className)}>
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <p className="text-muted-foreground italic">Preview will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreview;
