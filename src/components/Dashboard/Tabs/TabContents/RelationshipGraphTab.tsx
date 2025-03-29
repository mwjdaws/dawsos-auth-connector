
/**
 * RelationshipGraphTab Component
 * 
 * A container component that renders the RelationshipGraphPanel within the
 * dashboard tabs interface. It passes the content ID to the graph panel to
 * potentially use as a starting node.
 */
import React from 'react';
import { RelationshipGraphPanel } from '@/components/MarkdownViewer/RelationshipGraph';

interface RelationshipGraphTabProps {
  contentId?: string;  // ID of the current content, used as starting node in the graph
}

export function RelationshipGraphTab({ contentId }: RelationshipGraphTabProps) {
  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <RelationshipGraphPanel sourceId={contentId} />
    </div>
  );
}
