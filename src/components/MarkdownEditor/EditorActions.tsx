
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';

interface EditorActionsProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  isLoadingTemplate: boolean;
  isDirty?: boolean;
  isPublished?: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  isLoadingTemplate,
  isDirty = false,
  isPublished = false
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={onSaveDraft}
        className="flex items-center gap-2"
        disabled={isLoadingTemplate || isSaving}
      >
        <Save size={16} />
        {isSaving ? "Saving..." : "Save Draft"}
        {isDirty && !isSaving && <span className="ml-1 h-2 w-2 rounded-full bg-yellow-400" title="Unsaved changes" />}
      </Button>
      <Button
        onClick={onPublish}
        className="flex items-center gap-2"
        disabled={isLoadingTemplate || isPublishing}
      >
        <Send size={16} />
        {isPublishing ? "Publishing..." : isPublished ? "Update Published" : "Publish"}
      </Button>
    </div>
  );
};

export default EditorActions;
