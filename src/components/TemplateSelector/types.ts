
import { KnowledgeTemplate, PaginationParams } from "@/services/api/types";

export interface TemplateSelectorProps {
  onSelectTemplate: (template: KnowledgeTemplate) => void;
  className?: string;
  defaultShowGlobal?: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  count: number;
}

export interface NewTemplateForm {
  name: string;
  content: string;
}
