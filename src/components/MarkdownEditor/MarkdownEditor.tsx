
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useTemplates } from '@/hooks/useTemplates';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import EditorHeader from './EditorHeader';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';
import EditorActions from './EditorActions';

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
    handleSaveDraft,
    handlePublish,
    handleTemplateChange
  } = useMarkdownEditor({
    initialTitle,
    initialContent,
    initialTemplateId,
    documentId,
    onSaveDraft,
    onPublish
  });

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
      />
    </div>
  );
};

export default MarkdownEditor;
