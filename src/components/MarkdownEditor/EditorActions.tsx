
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Save, FileCheck, RefreshCcw, ExternalLink } from 'lucide-react';
import { OntologySuggestionsPanel } from './OntologySuggestionsPanel';

interface EditorActionsProps {
  onSaveDraft: () => Promise<string | null>;
  onPublish: () => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
  isLoadingTemplate: boolean;
  isDirty: boolean;
  isPublished: boolean;
  hasExternalSource: boolean;
  title?: string;
  content?: string;
  sourceId?: string;
}

const EditorActions = ({
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  isLoadingTemplate,
  isDirty,
  isPublished,
  hasExternalSource,
  title = '',
  content = '',
  sourceId
}: EditorActionsProps) => {
  const isProcessing = isSaving || isPublishing || isLoadingTemplate;
  
  // Refresh the editor state when a suggestion is applied
  const handleSuggestionApplied = () => {
    // Currently, the suggestions panel handles state updates internally
    // We could refresh metadata or other related state here if needed
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap justify-end gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isProcessing || !isDirty}
              >
                {isSaving ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your document as a draft</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPublish}
                disabled={isProcessing}
              >
                {isPublishing ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" />
                    {isPublished ? 'Update Published' : 'Publish'}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Publish your document for others to read</p>
            </TooltipContent>
          </Tooltip>
          
          {hasExternalSource && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isProcessing}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check external source for updates</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
      
      {/* Ontology Suggestions Panel */}
      {sourceId && (
        <OntologySuggestionsPanel
          content={content}
          title={title}
          sourceId={sourceId}
          onApplySuggestion={handleSuggestionApplied}
        />
      )}
    </div>
  );
};

export default EditorActions;
