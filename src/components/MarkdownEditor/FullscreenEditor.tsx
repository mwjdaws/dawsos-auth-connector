
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';

interface FullscreenEditorProps {
  activeTab: 'edit' | 'preview';
  setActiveTab: (value: 'edit' | 'preview') => void;
  content: string;
  setContent: (content: string) => void;
}

const FullscreenEditor: React.FC<FullscreenEditorProps> = ({
  activeTab,
  setActiveTab,
  content,
  setContent
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')} 
      className="w-full"
    >
      <TabsList className="mb-2">
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="w-full">
        <MarkdownContent 
          content={content} 
          onChange={setContent}
          className="min-h-[600px]"
        />
      </TabsContent>
      <TabsContent value="preview" className="w-full">
        <MarkdownPreview 
          content={content}
          className="min-h-[600px]"
        />
      </TabsContent>
    </Tabs>
  );
};

export default FullscreenEditor;
