
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from './CopyButton';
import { isValidContentId, isUUID, isTempId } from '@/utils/validation/contentIdValidation';
import { ContentIdValidationResult } from '@/utils/validation/types';

interface ContentIdDetailProps {
  contentId: string;
  validationResult?: ContentIdValidationResult;
  children?: React.ReactNode;
}

/**
 * Displays content ID details with validation state indicators
 */
export function ContentIdDetail({ contentId, validationResult, children }: ContentIdDetailProps) {
  // Validate the content ID if a validation result wasn't provided
  const isValid = validationResult ? validationResult.isValid : isValidContentId(contentId);
  
  // Determine if it's a UUID or temporary ID
  const isUuid = isUUID(contentId);
  const isTempID = isTempId(contentId);
  
  // Extract the content existence information if available
  const contentExists = validationResult ? validationResult.contentExists : undefined;
  
  /**
   * Generates a human-readable display for the content ID type
   */
  const getDisplayType = () => {
    if (isUuid) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-100">
          UUID
        </Badge>
      );
    }
    
    if (isTempID) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100">
          Temporary ID
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">
        Invalid Format
      </Badge>
    );
  };
  
  /**
   * Generates a human-readable display for the content existence state
   */
  const getExistenceState = () => {
    if (contentExists === true) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-100">
          Content Exists
        </Badge>
      );
    }
    
    if (contentExists === false) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">
          Content Not Found
        </Badge>
      );
    }
    
    // If we don't know if the content exists
    return null;
  };
  
  const formatContentId = (contentId: string) => {
    if (!contentId) return "No content ID";
    
    // For UUIDs, display in a more readable format with dashes
    if (isUUID(contentId)) {
      return contentId;
    }
    
    // For temporary IDs, display as-is but indicate it's temporary
    if (isTempID(contentId)) {
      return contentId;
    }
    
    // For invalid IDs, just display as-is
    return contentId;
  };
  
  return (
    <div className="p-3 bg-slate-50 rounded-md space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-sm font-semibold">Content ID</h4>
        {getDisplayType()}
        {getExistenceState()}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-slate-700 font-mono break-all">
        {formatContentId(contentId)}
        <CopyButton textToCopy={contentId} />
      </div>
      
      {children}
    </div>
  );
}
