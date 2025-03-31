
/**
 * Types for metadata-related hooks
 */

import { Tag, OntologyTerm, SourceMetadata } from '@/components/MetadataPanel/types';

export interface UseContentExistsProps {
  contentId: string;
  enabled?: boolean;
}

export interface UseContentExistsResult {
  exists: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface UseTagsQueryOptions {
  enabled?: boolean;
  onSuccess?: (data: Tag[]) => void;
  onError?: (error: Error) => void;
}

export interface UseTagsQueryResult {
  data: Tag[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<Tag[]>;
}

export interface UseMetadataQueryProps {
  contentId: string;
  enabled?: boolean;
}

export interface UseMetadataQueryResult {
  data: SourceMetadata | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<SourceMetadata | null>;
}

export interface AddTagParams {
  name: string;
  contentId: string;
  typeId?: string | null;
}

export interface DeleteTagParams {
  tagId: string;
  contentId: string;
}

export interface UseTagMutationResult {
  addTag: (params: AddTagParams) => Promise<Tag | null>;
  deleteTag: (params: DeleteTagParams) => Promise<boolean>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  error: Error | null;
}

export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface UseSourceMetadataProps {
  contentId: string;
  enabled?: boolean;
}

export interface ValidationOptions {
  allowEmpty?: boolean;
  allowDuplicates?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface TagValidationOptions extends ValidationOptions {
  allowEmpty?: boolean;
}
