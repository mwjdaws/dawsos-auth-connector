
import React from 'react';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';
import { ExternalLink } from 'lucide-react';

interface SplitEditorProps {
  content: string;
  setContent: (content: string) => void;
  externalSourceUrl?: string;
}

const SplitEditor: React.FC<SplitEditorProps> = ({ 
  content, 
  setContent,
  externalSourceUrl 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="w-full overflow-hidden">
        <div className="mb-2 font-medium text-sm text-muted-foreground">Edit</div>
        <MarkdownContent 
          content={content} 
          onChange={setContent} 
        />
      </div>
      <div className="w-full overflow-hidden">
        <div className="mb-2 font-medium flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Preview</span>
          {externalSourceUrl && (
            <a 
              href={externalSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> External Source
            </a>
          )}
        </div>
        <MarkdownPreview 
          content={content} 
          className="prose dark:prose-invert max-w-none h-full p-4 rounded-md border bg-card"
        />
      </div>
    </div>
  );
};

export default SplitEditor;
