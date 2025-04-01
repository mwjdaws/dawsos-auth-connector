
import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { GraphRenderer } from './graph-renderer/GraphRenderer';
import { GraphData, GraphRendererRef } from '../types';
import { ensureString } from '@/utils/compatibility';
import { RelationshipGraphControls } from './RelationshipGraphControls';

interface RelationshipGraphPanelProps {
  graphData: GraphData;
  title?: string;
  contentId?: string;
  className?: string;
  height?: number;
  width?: number;
  onNodeClick?: (nodeId: string) => void;
}

export function RelationshipGraphPanel({
  graphData,
  title = 'Knowledge Graph',
  contentId,
  className = '',
  height = 600,
  width,
  onNodeClick
}: RelationshipGraphPanelProps) {
  const graphRef = useRef<GraphRendererRef>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleNodeSelect = (nodeId: string) => {
    setHighlightedNodeId(nodeId);
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
  };
  
  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoomOut();
    }
  };
  
  const handleResetZoom = () => {
    if (graphRef.current) {
      graphRef.current.resetZoom();
    }
  };
  
  const handleLinkClick = (source: string, target: string) => {
    console.log(`Link clicked: ${source} -> ${target}`);
  };
  
  return (
    <Card className={`flex flex-col overflow-hidden ${className}`}>
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        <RelationshipGraphControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
        />
      </div>
      
      <div className="flex-1 relative" style={{ height: `${height}px` }}>
        <GraphRenderer
          ref={graphRef}
          graphData={graphData}
          width={width || '100%'}
          height={height}
          highlightedNodeId={highlightedNodeId}
          zoom={zoomLevel}
          onNodeClick={handleNodeSelect}
          onLinkClick={handleLinkClick}
        />
      </div>
    </Card>
  );
}
