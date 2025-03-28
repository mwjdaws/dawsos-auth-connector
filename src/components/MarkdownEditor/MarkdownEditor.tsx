
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useTemplates } from '@/hooks/useTemplates';
import { useMarkdownEditor } from '@/hooks/markdown-editor';
import EditorHeader from './EditorHeader';
import MarkdownContent from './MarkdownContent';
import MarkdownPreview from './MarkdownPreview';
import EditorActions from './EditorActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Maximize2, Minimize2 } from 'lucide-react';
import { VersionHistoryModal } from './VersionHistoryModal';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  documentId?: string;
  sourceId?: string; // Add sourceId prop for loading existing content
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // When exiting fullscreen, set active tab back to edit to show the side-by-side view
    if (isFullscreen) {
      setActiveTab('edit');
    }
  };

  // The document ID to use for version history (use sourceId if documentId is not provided)
  const effectiveDocumentId = documentId || sourceId;

  // Handle when a version is restored
  const handleVersionRestore = () => {
    // Reload the content to reflect the restored version
    window.location.reload();
  };

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
      <div className="flex justify-between items-center mb-4">
        <EditorHeader 
          title={title}
          setTitle={setTitle}
          templateId={templateId}
          templates={templates}
          isLoadingTemplates={isLoadingTemplates}
          onTemplateChange={handleTemplateChange}
        />
        <div className="flex items-center gap-2">
          {effectiveDocumentId && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsHistoryOpen(true)}
              title="View version history"
            >
              <History size={16} />
              <span className="hidden sm:inline">History</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </Button>
        </div>
      </div>

      {isFullscreen ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')} className="w-full">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MarkdownContent 
            content={content} 
            onChange={setContent} 
          />
          <MarkdownPreview content={content} />
        </div>
      )}

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

      {/* Version History Modal */}
      {effectiveDocumentId && (
        <VersionHistoryModal
          documentId={effectiveDocumentId}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onVersionRestore={handleVersionRestore}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;
