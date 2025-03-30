
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
// Import hooks directly from their source files
import { useTemplates } from '@/hooks/useTemplates';
import { useMarkdownEditor } from './useMarkdownEditor';
import { useKnowledgeSources } from '@/hooks/markdown-editor/useKnowledgeSources';
// Direct component imports
import EditorHeader from './EditorHeader';
import EditorActions from './EditorActions';
import { Skeleton } from '@/components/ui/skeleton';
import { VersionHistoryModal } from './VersionHistoryModal';
import SplitEditor from './SplitEditor';
import FullscreenEditor from './FullscreenEditor';
import EditorToolbar from './EditorToolbar';
import { KnowledgeSourceBrowser } from './KnowledgeSourceBrowser';
import { OntologySuggestionsPanel } from './OntologySuggestionsPanel';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTemplateId?: string | null;
  initialExternalSourceUrl?: string;
  documentId?: string;
  sourceId?: string;
  onSaveDraft?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
  onPublish?: (id: string, title: string, content: string, templateId: string | null, externalSourceUrl: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTemplateId = null,
  initialExternalSourceUrl = '',
  documentId,
  sourceId,
  onSaveDraft,
  onPublish,
}) => {
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const {
    isSourceBrowserOpen,
    openSourceBrowser,
    closeSourceBrowser,
    handleSourceSelection
  } = useKnowledgeSources();
  
  const {
    title,
    setTitle,
    content,
    setContent,
    templateId,
    externalSourceUrl,
    setExternalSourceUrl,
    isLoadingTemplate,
    isSaving,
    isPublishing,
    isDirty,
    isPublished,
    isLoading,
    handleSaveDraft,
    handlePublish,
    handleTemplateChange,
    setTemplateId
  } = useMarkdownEditor({
    initialTitle,
    initialContent,
    initialTemplateId,
    initialExternalSourceUrl,
    documentId,
    sourceId,
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
          externalSourceUrl={externalSourceUrl}
          setExternalSourceUrl={setExternalSourceUrl}
          templates={templates}
          isLoadingTemplates={isLoadingTemplates}
          onTemplateChange={handleTemplateChange}
        />
        <EditorToolbar
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          documentId={effectiveDocumentId}
          onHistoryClick={() => setIsHistoryOpen(true)}
          onSourceBrowserClick={openSourceBrowser}
        />
      </div>

      {isFullscreen ? (
        <FullscreenEditor
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          content={content}
          setContent={setContent}
          externalSourceUrl={externalSourceUrl}
        />
      ) : (
        <SplitEditor 
          content={content} 
          setContent={setContent}
          externalSourceUrl={externalSourceUrl}
        />
      )}

      <Separator className="my-6" />

      <EditorActions 
        onSaveDraft={() => handleSaveDraft()}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isLoadingTemplate={isLoadingTemplate}
        isDirty={isDirty}
        isPublished={isPublished}
        hasExternalSource={!!externalSourceUrl}
        title={title}
        content={content}
        sourceId={sourceId}
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

      {/* Knowledge Source Browser Dialog */}
      <Dialog open={isSourceBrowserOpen} onOpenChange={closeSourceBrowser}>
        <DialogContent className="sm:max-w-[600px]">
          <KnowledgeSourceBrowser 
            onSelectSource={(source) => 
              handleSourceSelection(
                source, 
                setTitle, 
                setContent, 
                setTemplateId, 
                setExternalSourceUrl
              )
            } 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarkdownEditor;
