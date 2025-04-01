
import { useCallback } from 'react';
import { GraphLink, LinkRendererOptions } from './GraphRendererTypes';

export function useLinkRenderer(options?: LinkRendererOptions) {
  const handleLinkClick = useCallback((link: GraphLink) => {
    if (options?.onLinkClick) {
      const sourceId = typeof link.source === 'object' ? link.source.id : String(link.source);
      const targetId = typeof link.target === 'object' ? link.target.id : String(link.target);
      options.onLinkClick(sourceId, targetId);
    }
  }, [options]);

  const renderLinks = useCallback((context: CanvasRenderingContext2D, links: GraphLink[], transform: any) => {
    context.save();
    
    // Apply zoom transform
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    
    // Draw links
    links.forEach(link => {
      context.beginPath();
      
      // Get source and target positions
      const source = typeof link.source === 'object' ? link.source : { x: 0, y: 0 };
      const target = typeof link.target === 'object' ? link.target : { x: 0, y: 0 };
      
      // Skip if positions are not defined
      if (!source.x || !source.y || !target.x || !target.y) return;
      
      // Draw line
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
      
      // Set link style
      context.strokeStyle = link.color || '#999';
      context.lineWidth = link.width || 1;
      
      context.stroke();
    });
    
    context.restore();
  }, []);

  return {
    handleLinkClick,
    renderLinks
  };
}
