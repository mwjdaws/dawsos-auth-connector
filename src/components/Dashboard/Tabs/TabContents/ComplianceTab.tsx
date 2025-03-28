
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ExternalLink, Calendar, CheckCircle, AlertTriangle, RefreshCw, History, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/utils/errors";
import { 
  validateExternalSource, 
  markForExternalReview, 
  clearExternalReviewFlag 
} from "@/services/supabase/external-source-validator";
import { 
  fetchLatestAuditLogs, 
  ExternalLinkAudit 
} from "@/services/supabase/audit-logs";
import { AuditLogModal } from "./AuditLogModal";

interface ExternalReviewItem {
  id: string;
  title: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
}

export function ComplianceTab() {
  const [reviewItems, setReviewItems] = useState<ExternalReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [latestAudits, setLatestAudits] = useState<Record<string, ExternalLinkAudit>>({});
  const [selectedItem, setSelectedItem] = useState<{id: string, title: string} | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  
  // Fetch items that need external review
  const fetchReviewItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title, external_source_url, external_source_checked_at, needs_external_review')
        .eq('needs_external_review', true)
        .order('title');
      
      if (error) throw error;
      
      setReviewItems(data || []);

      // Fetch latest audit logs for these items
      if (data && data.length > 0) {
        const itemIds = data.map(item => item.id);
        const auditData = await fetchLatestAuditLogs(itemIds);
        setLatestAudits(auditData);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching review items:", err);
      setError("Failed to load review items. Please try again.");
      handleError(err, "Failed to load compliance review items.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviewItems();
  }, []);
  
  // Handle validating an external source
  const handleValidateSource = async (id: string) => {
    try {
      setRefreshing(prev => ({ ...prev, [id]: true }));
      
      await validateExternalSource(id);
      
      // Refresh the item data
      await fetchReviewItems();
      
      toast({
        title: "Validation complete",
        description: "External source has been validated."
      });
    } catch (err) {
      console.error("Error validating source:", err);
      // Error is already handled in validateExternalSource
    } finally {
      setRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Handle toggling the review flag
  const toggleReviewFlag = async (id: string, currentValue: boolean) => {
    try {
      if (currentValue) {
        await clearExternalReviewFlag(id);
      } else {
        await markForExternalReview(id);
      }
      
      // Update the local state to reflect the change
      setReviewItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, needs_external_review: !currentValue } 
            : item
        )
      );
    } catch (err) {
      console.error("Error updating review flag:", err);
      toast({
        title: "Update failed",
        description: "Failed to update review status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Open the audit log modal
  const openAuditHistory = (id: string, title: string) => {
    setSelectedItem({ id, title });
    setIsAuditModalOpen(true);
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  // Render status badge based on audit status
  const renderAuditStatusBadge = (audit: ExternalLinkAudit | undefined) => {
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
  };
  
  // Render the external review items table
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Content Requiring Review</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchReviewItems}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="p-4 text-sm border rounded-md bg-red-50 border-red-200 text-red-800">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading review items...</p>
        </div>
      ) : reviewItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No items flagged for external review.</p>
        </div>
      ) : (
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
              {reviewItems.map((item) => (
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
                    {item.needs_external_review ? (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Needs Review
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Reviewed
                      </Badge>
                    )}
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReviewFlag(item.id, item.needs_external_review)}
                      >
                        {item.needs_external_review ? "Mark as Reviewed" : "Flag for Review"}
                      </Button>
                      
                      {item.external_source_url && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleValidateSource(item.id)}
                          disabled={refreshing[item.id]}
                        >
                          {refreshing[item.id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            "Validate URL"
                          )}
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openAuditHistory(item.id, item.title)}
                      >
                        <History className="h-4 w-4 mr-1" />
                        View History
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedItem && (
        <AuditLogModal 
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          sourceId={selectedItem.id}
          sourceName={selectedItem.title}
        />
      )}
    </div>
  );
}
