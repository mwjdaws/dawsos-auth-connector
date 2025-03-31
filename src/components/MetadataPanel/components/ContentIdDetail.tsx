
/**
 * ContentIdDetail Component
 * 
 * Displays information about content ID format and validity
 * Useful for debugging and development
 */
import React from "react";
import { useContentIdValidation } from "@/hooks/validation/useContentIdValidation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContentIdDetailProps {
  contentId: string;
  className?: string;
  showDetail?: boolean;
}

export function ContentIdDetail({ 
  contentId, 
  className, 
  showDetail = false 
}: ContentIdDetailProps) {
  const { 
    isValid, 
    isUuid, 
    isTemporary, 
    isStorable,
    convertToUuid,
    error
  } = useContentIdValidation(contentId);
  
  if (!showDetail) {
    return null;
  }
  
  return (
    <div className={cn("text-xs space-y-1", className)}>
      <div className="flex flex-wrap gap-1 mb-1">
        {isValid ? (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            Valid Content ID
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
            Invalid Content ID
          </Badge>
        )}
        
        {isUuid && (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            UUID Format
          </Badge>
        )}
        
        {isTemporary && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            Temporary ID
          </Badge>
        )}
        
        {isStorable && (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            Storable
          </Badge>
        )}
      </div>
      
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      
      {contentId && (
        <div className="font-mono bg-gray-100 p-1 rounded max-w-full overflow-hidden text-ellipsis">
          {contentId}
        </div>
      )}
      
      {convertToUuid && convertToUuid !== contentId && (
        <div>
          <span className="text-gray-500">UUID: </span>
          <span className="font-mono">{convertToUuid}</span>
        </div>
      )}
    </div>
  );
}

export default ContentIdDetail;
