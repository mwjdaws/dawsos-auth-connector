
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Save, Send } from 'lucide-react';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  onSaveDraft?: (title: string, content: string, templateId: string | null) => void;
  onPublish?: (title: string, content: string, templateId: string | null) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  onSaveDraft,
  onPublish,
}) => {
  // State management
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);
  
  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTemplateId(initialTemplateId);
  }, [initialTitle, initialContent, initialTemplateId]);

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(title, content, templateId);
    }
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved successfully",
    });
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish(title, content, templateId);
    }
    toast({
      title: "Content Published",
      description: "Your content has been published successfully",
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="markdown-content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <Textarea
            id="markdown-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your markdown content here..."
            className="flex-1 min-h-[500px] font-mono"
          />
        </div>

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
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Draft
        </Button>
        <Button
          onClick={handlePublish}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          Publish
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
