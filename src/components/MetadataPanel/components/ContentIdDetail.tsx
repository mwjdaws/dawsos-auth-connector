
import React, { useState } from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoCircle, AlertTriangle, Copy } from 'lucide-react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

interface ContentIdDetailProps {
  contentId: string;
  isValidContent: boolean;
  contentExists: boolean;
  className?: string;
  showCopyButton?: boolean;
}

/**
 * ContentIdDetail Component
 * 
 * Displays the content ID with validation state indicators
 * and provides a copy button for easy copying
 */
export function ContentIdDetail({
  contentId,
  isValidContent = false,
  contentExists = false,
  className = '',
  showCopyButton = true
}: ContentIdDetailProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get appropriate status indicators
  const statusInfo = getContentIdStatus(contentId, isValidContent, contentExists);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1">ID:</span>
          <span className="text-sm text-foreground font-mono">{formatContentId(contentId)}</span>
          {statusInfo.badge}
        </div>
        
        {showCopyButton && (
          <CopyButton 
            value={contentId} 
            onCopy={() => console.log('Content ID copied')}
            size="sm"
            variant="ghost"
          />
        )}
      </div>
      
      {statusInfo.showAlert && (
        <Alert variant={statusInfo.alertVariant}>
          <statusInfo.icon className="h-4 w-4" />
          <AlertTitle>{statusInfo.alertTitle}</AlertTitle>
          <AlertDescription>{statusInfo.alertDescription}</AlertDescription>
          
          {statusInfo.showMoreInfo && (
            <Button
              variant="link"
              size="sm"
              className="p-0 mt-1"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Less info' : 'More info'}
            </Button>
          )}
        </Alert>
      )}
      
      {showDetails && statusInfo.detailedInfo && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded border">
          {statusInfo.detailedInfo}
        </div>
      )}
    </div>
  );
}

// Helper function to format content ID for display
function formatContentId(contentId: string): string {
  if (!contentId) return 'None';
  
  // Show only first and last few characters for long IDs
  if (contentId.length > 20) {
    return `${contentId.substring(0, 8)}...${contentId.substring(contentId.length - 8)}`;
  }
  
  return contentId;
}

// Helper function to get status indicators for the content ID
function getContentIdStatus(contentId: string, isValidContent: boolean, contentExists: boolean) {
  if (!contentId) {
    return {
      badge: <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Missing</Badge>,
      showAlert: true,
      alertVariant: "warning" as const,
      icon: AlertTriangle,
      alertTitle: "Missing Content ID",
      alertDescription: "No content ID provided. Some features may be limited.",
      showMoreInfo: false
    };
  }
  
  if (!isValidContent) {
    return {
      badge: <Badge variant="outline" className="bg-red-100 text-red-800">Invalid</Badge>,
      showAlert: true,
      alertVariant: "destructive" as const,
      icon: AlertTriangle,
      alertTitle: "Invalid Content ID",
      alertDescription: "The provided content ID is not in the correct format.",
      showMoreInfo: true,
      detailedInfo: "Content IDs must be valid UUIDs or temporary IDs (starting with 'temp-'). This could indicate a configuration issue."
    };
  }
  
  if (!contentExists) {
    return {
      badge: <Badge variant="outline" className="bg-amber-100 text-amber-800">Not Found</Badge>,
      showAlert: true,
      alertVariant: "warning" as const,
      icon: AlertTriangle,
      alertTitle: "Content Not Found",
      alertDescription: "This content ID is valid but doesn't exist in the database.",
      showMoreInfo: false
    };
  }
  
  return {
    badge: <Badge variant="outline" className="bg-green-100 text-green-800">Valid</Badge>,
    showAlert: false,
    alertVariant: "default" as const,
    icon: InfoCircle,
    showMoreInfo: false
  };
}
