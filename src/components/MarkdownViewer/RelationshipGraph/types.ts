
export type GraphNode = {
  id: string;
  title: string;
  color?: string;
  group?: string;
  // Required for force-graph library
  x?: number;
  y?: number;
  index?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

export type GraphLink = {
  source: string;
  target: string;
  label?: string;
  color?: string;
  value?: number;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

export interface GraphRendererProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
  selectedNodeIds?: string[];
  highlightNodeIds?: string[];
  autoCenter?: boolean;
  height?: number;
  width?: number;
}

export interface NodeRendererProps {
  node: GraphNode;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export interface LinkRendererProps {
  link: GraphLink;
  isHighlighted?: boolean;
}
