
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownContentProps {
  content: string;
  onChange: (value: string) => void;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, onChange }) => {
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
        className="flex-1 min-h-[500px] font-mono"
      />
    </div>
  );
};

export default MarkdownContent;
