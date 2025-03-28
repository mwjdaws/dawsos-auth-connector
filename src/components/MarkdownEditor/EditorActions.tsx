
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';

interface EditorActionsProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  isLoadingTemplate: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  isLoadingTemplate
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
      </Button>
      <Button
        onClick={onPublish}
        className="flex items-center gap-2"
        disabled={isLoadingTemplate || isPublishing}
      >
        <Send size={16} />
        {isPublishing ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
};

export default EditorActions;
