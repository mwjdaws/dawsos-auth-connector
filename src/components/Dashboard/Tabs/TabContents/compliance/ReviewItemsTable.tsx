
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ExternalLink, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ExternalLinkAudit } from "@/services/supabase/audit-logs";
import { renderAuditStatusBadge, renderReviewStatusBadge } from "./StatusBadges";
import { ItemActions } from "./ItemActions";

interface ExternalReviewItem {
  id: string;
  title: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
}

interface ReviewItemsTableProps {
  items: ExternalReviewItem[];
  latestAudits: Record<string, ExternalLinkAudit>;
  refreshing: Record<string, boolean>;
  onValidateSource: (id: string) => Promise<void>;
  onToggleReviewFlag: (id: string, currentValue: boolean) => Promise<void>;
  onViewHistory: (id: string, title: string) => void;
}

export function ReviewItemsTable({
  items,
  latestAudits,
  refreshing,
  onValidateSource,
  onToggleReviewFlag,
  onViewHistory
}: ReviewItemsTableProps) {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>External Source</TableHead>
            <TableHead>Last Checked</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Audit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  {item.title}
                </div>
              </TableCell>
              <TableCell>
                {item.external_source_url ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={item.external_source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Source
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs break-all">{item.external_source_url}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-gray-500">No source URL</span>
                )}
              </TableCell>
              <TableCell className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                {formatDate(item.external_source_checked_at)}
              </TableCell>
              <TableCell>
                {renderReviewStatusBadge(item.needs_external_review)}
              </TableCell>
              <TableCell>
                {latestAudits[item.id] ? (
                  <div className="flex flex-col">
                    {renderAuditStatusBadge(latestAudits[item.id])}
                    <span className="text-xs text-gray-500 mt-1">
                      {formatDate(latestAudits[item.id].checked_at)}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">No audit logs</span>
                )}
              </TableCell>
              <TableCell>
                <ItemActions 
                  itemId={item.id}
                  itemTitle={item.title}
                  needsReview={item.needs_external_review}
                  hasExternalSource={!!item.external_source_url}
                  isRefreshing={refreshing[item.id] || false}
                  onValidateSource={onValidateSource}
                  onToggleReviewFlag={onToggleReviewFlag}
                  onViewHistory={onViewHistory}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
