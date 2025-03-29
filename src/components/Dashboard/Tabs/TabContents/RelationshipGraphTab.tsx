
import React from 'react';
import { RelationshipGraphPanel } from '@/components/MarkdownViewer/RelationshipGraph';

interface RelationshipGraphTabProps {
  contentId?: string;
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <RelationshipGraphPanel sourceId={contentId} />
    </div>
  );
}
