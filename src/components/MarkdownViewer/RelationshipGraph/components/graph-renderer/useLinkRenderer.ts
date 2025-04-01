
import { useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphLink } from '../../types';
import { ensureString } from '@/utils/compatibility';

interface LinkRendererOptions {
  onLinkClick?: (source: string, target: string) => void;
}

export function useLinkRenderer(
  svgRef: React.RefObject<SVGSVGElement>,
  gRef: React.RefObject<SVGGElement>,
  options: LinkRendererOptions = {}
) {
  const linksRef = useRef<d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown>>();
  
  // Render links initially
  const renderLinks = useCallback((links: GraphLink[]) => {
    if (!gRef.current) return;
    
    // Remove any existing links
    d3.select(gRef.current).selectAll('.link').remove();
    
    // Create link elements
    linksRef.current = d3.select(gRef.current)
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => d.color || '#999')
      .attr('stroke-width', d => d.width || 1)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrow)');
    
    // Add click events
    if (options.onLinkClick) {
      linksRef.current.on('click', (event, d) => {
        options.onLinkClick?.(ensureString(d.source), ensureString(d.target));
      });
    }
    
    return linksRef.current;
  }, [gRef, options]);
  
  // Update link positions
  const updateLinkPositions = useCallback(() => {
    if (!linksRef.current) return;
    
    linksRef.current
      .attr('x1', (d: any) => d.source.x || 0)
      .attr('y1', (d: any) => d.source.y || 0)
      .attr('x2', (d: any) => d.target.x || 0)
      .attr('y2', (d: any) => d.target.y || 0);
  }, [linksRef]);
  
  return {
    renderLinks,
    updateLinkPositions
  };
}
