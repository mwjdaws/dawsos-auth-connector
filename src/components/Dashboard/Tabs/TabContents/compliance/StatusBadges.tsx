
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { ExternalLinkAudit } from "@/services/supabase/audit-logs";

/**
 * Renders a status badge based on audit status
 */
export function renderAuditStatusBadge(audit: ExternalLinkAudit | undefined) {
  if (!audit) return null;
  
  switch (audit.status) {
    case 'success':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 mr-1" />
          Success
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Error
        </Badge>
      );
    case 'changed':
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Changed
        </Badge>
      );
    case 'unchanged':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          <CheckCircle className="h-4 w-4 mr-1" />
          Unchanged
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          Unknown
        </Badge>
      );
  }
}

/**
 * Renders a review status badge
 */
export function renderReviewStatusBadge(needsReview: boolean) {
  if (needsReview) {
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
        <AlertTriangle className="h-4 w-4 mr-1" />
        Needs Review
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-4 w-4 mr-1" />
        Reviewed
      </Badge>
    );
  }
}
