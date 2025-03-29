
export interface GraphNode {
  id: string;
  name: string;
  type: 'source' | 'term';
  val?: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  value?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
}
