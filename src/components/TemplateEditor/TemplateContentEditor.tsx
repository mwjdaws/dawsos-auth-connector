
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MarkdownPreview from '@/components/MarkdownEditor/MarkdownPreview';

interface TemplateContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TemplateContentEditor: React.FC<TemplateContentEditorProps> = ({
  content,
  setContent,
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="edit">Edit Content</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-content">Template Content (Markdown)</Label>
          <Textarea
            id="template-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter markdown content"
            className="min-h-[300px] font-mono"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="preview">
        <div className="border rounded-md p-4">
          <MarkdownPreview content={content} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TemplateContentEditor;
