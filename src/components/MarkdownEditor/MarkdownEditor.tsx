
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useTemplates } from '@/hooks/useTemplates';
import { useMarkdownEditor } from '@/hooks/markdown-editor';
import EditorHeader from './EditorHeader';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';
import EditorActions from './EditorActions';
import { Skeleton } from '@/components/ui/skeleton';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  sourceId?: string; // New prop for loading existing content
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  documentId,
  sourceId, // Accept the sourceId prop
  onSaveDraft,
  onPublish,
}) => {
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  
  const {
    title,
    setTitle,
    content,
    setContent,
    templateId,
    isLoadingTemplate,
    isSaving,
    isPublishing,
    isDirty,
    isPublished,
    isLoading, // Loading state for content
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  } = useMarkdownEditor({
    initialTitle,
    initialContent,
    initialTemplateId,
    documentId,
    sourceId, // Pass sourceId to the hook
    onSaveDraft,
    onPublish
  });

  // Show loading state while fetching content
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
        <Skeleton className="h-10 w-48 ml-auto" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <EditorHeader 
        title={title}
        setTitle={setTitle}
        templateId={templateId}
        templates={templates}
        isLoadingTemplates={isLoadingTemplates}
        onTemplateChange={handleTemplateChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MarkdownContent 
          content={content} 
          onChange={setContent} 
        />
        <MarkdownPreview content={content} />
      </div>

      <Separator className="my-6" />

      <EditorActions 
        onSaveDraft={() => handleSaveDraft(false)}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isLoadingTemplate={isLoadingTemplate}
        isDirty={isDirty}
        isPublished={isPublished}
      />
    </div>
  );
};

export default MarkdownEditor;
