
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium mb-1">
        Preview
      </label>
      <div className="flex-1 border rounded-md p-4 overflow-auto min-h-[500px] prose prose-sm dark:prose-invert max-w-none">
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
