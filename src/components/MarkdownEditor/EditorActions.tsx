
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Send, ExternalLink } from 'lucide-react';

interface EditorActionsProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  isLoadingTemplate: boolean;
  isDirty: boolean;
  isPublished: boolean;
  hasExternalSource?: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  isLoadingTemplate,
  isDirty,
  isPublished,
  hasExternalSource = false
}) => {
  const isDisabled = isSaving || isPublishing || isLoadingTemplate;
  
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {isDirty && <span>Unsaved changes</span>}
        {!isDirty && <span>All changes saved</span>}
        {hasExternalSource && (
          <span className="ml-2 inline-flex items-center text-xs text-primary">
            <ExternalLink className="h-3 w-3 mr-1" /> External source linked
          </span>
        )}
      </div>
      
      <div className="space-x-2">
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isDisabled || (!isDirty && !isLoadingTemplate)}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </>
          )}
        </Button>
        
        <Button
          onClick={onPublish}
          disabled={isDisabled || isPublished}
        >
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {isPublished ? 'Published' : 'Publish'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditorActions;
