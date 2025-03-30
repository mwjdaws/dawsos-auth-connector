
import { GraphLink } from './GraphRendererTypes';

interface LinkRendererResult {
  getLinkColor: (link: GraphLink) => string;
  getLinkLabel: (link: GraphLink) => string;
  getLinkWidth: (link: GraphLink) => number;
}

export function useLinkRenderer(): LinkRendererResult {
  // Determine link color based on type
  const getLinkColor = (link: GraphLink): string => {
    const type = link.type || 'default';
    
    const colorMap: Record<string, string> = {
      'manual': '#3b82f6',   // blue
      'wikilink': '#10b981', // green
      'AI-suggested': '#f59e0b', // amber
      'default': '#9ca3af'  // gray
    };
    
    return colorMap[type] || colorMap.default;
  };
  
  // Get human-readable label for link
  const getLinkLabel = (link: GraphLink): string => {
    const type = link.type || 'default';
    
    const labelMap: Record<string, string> = {
      'manual': 'Manual connection',
      'wikilink': 'Wiki link',
      'AI-suggested': 'AI-suggested connection',
      'default': 'Related'
    };
    
    return labelMap[type] || labelMap.default;
  };
  
  // Determine link width based on type
  const getLinkWidth = (link: GraphLink): number => {
    const type = link.type || 'default';
    
    const widthMap: Record<string, number> = {
      'manual': 2,
      'wikilink': 2.5,
      'AI-suggested': 1.5,
      'default': 1
    };
    
    return widthMap[type] || widthMap.default;
  };
  
  return {
    getLinkColor,
    getLinkLabel,
    getLinkWidth
  };
}
