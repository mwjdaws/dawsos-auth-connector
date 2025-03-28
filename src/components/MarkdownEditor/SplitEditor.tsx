
import React from 'react';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';

interface SplitEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const SplitEditor: React.FC<SplitEditorProps> = ({ content, setContent }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MarkdownContent 
        content={content} 
        onChange={setContent} 
      />
      <MarkdownPreview content={content} />
    </div>
  );
};

export default SplitEditor;
