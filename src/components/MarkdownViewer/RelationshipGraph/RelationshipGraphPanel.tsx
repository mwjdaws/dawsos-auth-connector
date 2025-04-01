
import React from 'react';
import { RelationshipGraphPanel as GraphPanel } from './components/RelationshipGraphPanel';
import { GraphData } from './types';
import { ensureString } from '@/utils/compatibility';

interface RelationshipGraphPanelProps {
  graphData: GraphData;
  title?: string;
  contentId?: string;
  className?: string;
  height?: number;
  width?: number;
  onNodeClick?: (nodeId: string) => void;
}

/**
 * RelationshipGraphPanel Component
 * 
 * This component displays a graph visualization of relationships between content items.
 * 
 * @param graphData The graph data to visualize
 * @param title Optional title for the graph panel
 * @param contentId Optional ID of the current content
 * @param className Optional additional CSS classes
 * @param height Optional height of the graph (default 600px)
 * @param width Optional width of the graph (default 100%)
 * @param onNodeClick Optional callback for node click events
 */
export function RelationshipGraphPanel({
  graphData,
  title = 'Knowledge Graph',
  contentId = '',
  className = '',
  height = 600,
  width,
  onNodeClick
}: RelationshipGraphPanelProps) {
  const handleNodeClick = onNodeClick ? (nodeId: string) => {
    onNodeClick(ensureString(nodeId));
  } : undefined;
  
  return (
    <GraphPanel
      graphData={graphData}
      title={title}
      contentId={contentId}
      className={className}
      height={height}
      width={width}
      onNodeClick={handleNodeClick}
      hasAttemptedRetry={false}
    />
  );
}
