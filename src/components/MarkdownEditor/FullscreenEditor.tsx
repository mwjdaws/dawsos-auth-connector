
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';
import { ExternalLink } from 'lucide-react';

interface FullscreenEditorProps {
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
  content: string;
  setContent: (content: string) => void;
  externalSourceUrl?: string;
}

const FullscreenEditor: React.FC<FullscreenEditorProps> = ({
  activeTab,
  setActiveTab,
  content,
  setContent,
  externalSourceUrl
}) => {
  return (
    <div className="w-full h-[70vh] relative">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')} 
        className="h-full"
      >
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          {externalSourceUrl && activeTab === 'preview' && (
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
        
        <TabsContent value="edit" className="h-full m-0">
          <MarkdownContent 
            content={content} 
            onChange={setContent} 
            className="h-full" 
          />
        </TabsContent>
        
        <TabsContent value="preview" className="h-full m-0">
          <MarkdownPreview 
            content={content} 
            className="prose dark:prose-invert max-w-none h-full p-4 rounded-md border bg-card overflow-auto" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullscreenEditor;
