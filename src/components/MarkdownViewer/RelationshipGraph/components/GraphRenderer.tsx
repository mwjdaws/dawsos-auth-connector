
import React, { useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router-dom';
import { GraphData, GraphNode } from '../types';

interface GraphRendererProps {
  graphData: GraphData;
  width: number;
  height: number;
}

export function GraphRenderer({ graphData, width, height }: GraphRendererProps) {
  const navigate = useNavigate();
  
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.type === 'source') {
      navigate(`/source/${node.id}`);
    } else {
      // Could show term details in a modal/sidebar
      console.log('Term clicked:', node);
    }
  }, [navigate]);
  
  return (
    <div style={{ height }}>
      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="type"
        nodeLabel={node => node.name}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkLabel={link => link.type as string}
        linkColor={() => "#999"}
        onNodeClick={handleNodeClick}
        width={width}
        height={height}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name as string;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
          
          // Node circle
          ctx.fillStyle = node.color as string;
          ctx.beginPath();
          ctx.arc(node.x as number, node.y as number, node.val as number * 2, 0, 2 * Math.PI);
          ctx.fill();
          
          // Text background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            (node.x as number) - bckgDimensions[0] / 2,
            (node.y as number) + 6,
            bckgDimensions[0],
            bckgDimensions[1]
          );
          
          // Text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#222';
          ctx.fillText(label, node.x as number, (node.y as number) + 6 + fontSize / 2);
        }}
        cooldownTicks={100}
        minZoom={0.5}
        maxZoom={5}
      />
    </div>
  );
}
