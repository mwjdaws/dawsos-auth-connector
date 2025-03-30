
import { ReactNode } from "react";

export interface GraphNode {
  id: string;
  name: string;
  type: 'source' | 'term';
  val: number;
  color: string;
  description?: string;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: string;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface RelationshipGraphProps {
  startingNodeId?: string;
  width?: number;
  height?: number;
  hasAttemptedRetry?: boolean;
}

export interface RelationshipGraphPanelProps {
  sourceId?: string;
  hasAttemptedRetry?: boolean;
}

export interface GraphRendererRef {
  centerOnNode: (nodeId: string) => void;
  setZoom: (zoomLevel: number, duration?: number) => void;
}

export interface WithErrorHandlingOptions {
  errorMessage?: string;
  fallbackValue?: any;
  silent?: boolean;
  onError?: (error: unknown) => void;
  level?: 'info' | 'warn' | 'warning' | 'error' | 'critical';
  context?: Record<string, any>;
}

export interface FetchResult {
  sources?: Array<{ id: string; title: string }>;
  links?: Array<{ id: string; source_id: string; target_id: string; link_type: string }>;
  terms?: Array<{ id: string; term: string; domain?: string }>;
  termRelationships?: Array<{ id: string; term_id: string; related_term_id: string; relation_type: string }>;
  sourceTerms?: Array<{ id: string; knowledge_source_id: string; ontology_term_id: string }>;
}

export interface GraphFetchOptions {
  depth?: number;
  includeTerms?: boolean;
  includeLinks?: boolean;
}
