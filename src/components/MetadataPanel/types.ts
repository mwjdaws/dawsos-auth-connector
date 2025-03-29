
import { OntologyTerm } from '@/hooks/markdown-editor/ontology-terms/types';
import { ReactNode } from 'react';

export interface Tag {
  name: string;
}

export interface MetadataPanelProps {
  contentId: string;
  onMetadataChange?: () => void;
  isCollapsible?: boolean;
  initialCollapsed?: boolean;
  showOntologyTerms?: boolean;
  showDomain?: boolean;
  domain?: string | null;
  editable?: boolean;
  className?: string;
  children?: ReactNode;
}
