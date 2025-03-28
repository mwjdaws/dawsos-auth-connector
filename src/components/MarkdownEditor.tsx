
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Save, Send, FileText } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useTemplates } from '@/hooks/useTemplates';
import { fetchKnowledgeTemplateById } from '@/services/api/templates/knowledgeTemplateFetchers';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  documentId,
  onSaveDraft,
  onPublish,
}) => {
  // State management
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [templateId, setTemplateId] = useState<string | null>(initialTemplateId);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const { user } = useAuth();
  
  // Update state if props change (e.g., when loading a saved draft)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTemplateId(initialTemplateId);
  }, [initialTitle, initialContent, initialTemplateId]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const knowledgeData = {
        title,
        content,
        template_id: templateId,
        user_id: user?.id,
      };

      let savedDocumentId = documentId;
      let response;

      if (documentId) {
        // Update existing document
        response = await supabase
          .from('knowledge_sources')
          .update(knowledgeData)
          .eq('id', documentId)
          .select()
          .single();
      } else {
        // Create new document
        response = await supabase
          .from('knowledge_sources')
          .insert(knowledgeData)
          .select()
          .single();
      }

      if (response.error) {
        throw response.error;
      }

      savedDocumentId = response.data.id;

      if (onSaveDraft) {
        onSaveDraft(savedDocumentId, title, content, templateId);
      }

      toast({
        title: "Draft Saved",
        description: "Your draft has been saved successfully",
      });

      return savedDocumentId;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error Saving Draft",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title before publishing",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      // First save the draft to ensure we have the latest content
      const savedId = await handleSaveDraft();
      
      if (savedId && onPublish) {
        onPublish(savedId, title, content, templateId);
      }
      
      toast({
        title: "Content Published",
        description: "Your content has been published successfully",
      });
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({
        title: "Error Publishing",
        description: "There was an error publishing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTemplateChange = async (value: string) => {
    if (value === 'none') {
      setTemplateId(null);
      return;
    }

    setIsLoadingTemplate(true);
    try {
      const template = await fetchKnowledgeTemplateById(value);
      setTemplateId(template.id);
      setTitle(template.name);
      setContent(template.content);
      
      toast({
        title: "Template Loaded",
        description: `Template "${template.name}" has been loaded successfully`,
      });
    } catch (error) {
      console.error('Failed to load template:', error);
      toast({
        title: "Error Loading Template",
        description: "Failed to load the selected template",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-start">
          <div className="w-full md:w-2/3">
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
          <div className="w-full md:w-1/3">
            <label htmlFor="template" className="block text-sm font-medium mb-1">
              Template
            </label>
            <Select 
              onValueChange={handleTemplateChange} 
              value={templateId || "none"}
              disabled={isLoadingTemplates || isLoadingTemplate}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center">
                    <span>No template</span>
                  </div>
                </SelectItem>
                
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{template.name}</span>
                      {template.is_global && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          Global
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
          disabled={isLoadingTemplate || isSaving}
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Draft"}
        </Button>
        <Button
          onClick={handlePublish}
          className="flex items-center gap-2"
          disabled={isLoadingTemplate || isPublishing}
        >
          <Send size={16} />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
