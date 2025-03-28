
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
import { AuditLogModal } from "../AuditLogModal";
import { ReviewItemsTable } from "./ReviewItemsTable";
import { EmptyState, LoadingState, ErrorState } from "./EmptyState";

interface ExternalReviewItem {
  id: string;
  title: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
}

export default function ComplianceTab() {
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
      
      {error && <ErrorState error={error} onRetry={fetchReviewItems} />}
      
      {loading ? (
        <LoadingState />
      ) : reviewItems.length === 0 ? (
        <EmptyState />
      ) : (
        <ReviewItemsTable 
          items={reviewItems}
          latestAudits={latestAudits}
          refreshing={refreshing}
          onValidateSource={handleValidateSource}
          onToggleReviewFlag={toggleReviewFlag}
          onViewHistory={openAuditHistory}
        />
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
