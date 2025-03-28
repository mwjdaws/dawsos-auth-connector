
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, onChange, className }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="markdown-content" className="block text-sm font-medium mb-1">
        Content
      </label>
      <Textarea
        id="markdown-content"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your markdown content here..."
        className={cn("flex-1 min-h-[500px] font-mono", className)}
      />
    </div>
  );
};

export default MarkdownContent;
