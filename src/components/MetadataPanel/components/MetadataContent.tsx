
import React from 'react';
import { ContentIdSection } from '../sections/ContentIdSection';
import { ExternalSourceSection } from '../sections/ExternalSourceSection';
import { TagsSection } from '../sections/TagsSection';
import { OntologyTermsSection } from '../sections/OntologyTermsSection';
import { DomainSection } from '../sections/DomainSection';
import { LoadingState } from '../sections/LoadingState';
import { SourceMetadata } from '../types';
import { Tag } from '@/types/tag';

interface MetadataContentProps {
  data: SourceMetadata | null;
  contentId: string;
  error: Error | null;
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onRefresh: () => void;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  showOntologyTerms?: boolean;
  domain?: string | null;
  showDomain?: boolean;
}

export function MetadataContent({
  data,
  contentId,
  error,
  tags,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onRefresh,
  externalSourceUrl,
  lastCheckedAt,
  needsExternalReview,
  showOntologyTerms = true,
  domain = null,
  showDomain = false
}: MetadataContentProps) {
  // If there's an error, display it
  if (error) {
    return (
      <div className="p-4">
        <div className="text-sm text-destructive">
          <p className="font-medium">Error loading metadata</p>
          <p>{error.message}</p>
        </div>
        <button 
          onClick={onRefresh}
          className="mt-4 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <ContentIdSection contentId={contentId} />
      
      <ExternalSourceSection
        contentId={contentId}
        externalSourceUrl={externalSourceUrl}
        lastCheckedAt={lastCheckedAt}
        needsExternalReview={needsExternalReview}
        editable={editable}
      />
      
      <TagsSection
        contentId={contentId}
        tags={tags}
        newTag={newTag}
        setNewTag={setNewTag}
        onAddTag={onAddTag}
        onDeleteTag={onDeleteTag}
        onMetadataChange={onRefresh}
        editable={editable}
        className="mb-6"
      />
      
      {showOntologyTerms && (
        <OntologyTermsSection
          contentId={contentId}
          editable={editable}
          showCreateTerm={editable}
          onMetadataChange={onRefresh}
        />
      )}
      
      {showDomain && domain && (
        <DomainSection domain={domain} />
      )}
    </div>
  );
}
