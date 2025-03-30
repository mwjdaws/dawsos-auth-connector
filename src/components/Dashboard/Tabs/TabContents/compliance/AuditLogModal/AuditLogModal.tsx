
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchAuditLogs, ExternalLinkAudit } from "@/services/supabase/audit-logs";
import { AuditLogsTable } from "./AuditLogsTable";
import { LoadingState, ErrorState, EmptyState } from "./AuditModalStates";

/**
 * AuditLogModal Component
 * 
 * Displays a modal with audit history for external source validations.
 * Shows when checks were performed, their results, and any issues discovered.
 * 
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Function to call when modal is closed
 * @param sourceId - ID of the knowledge source to show audit logs for
 * @param sourceName - Display name of the knowledge source
 */
interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceId: string;
  sourceName: string;
}

export function AuditLogModal({ isOpen, onClose, sourceId, sourceName }: AuditLogModalProps) {
  const [auditLogs, setAuditLogs] = useState<ExternalLinkAudit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load audit logs when modal opens
  useEffect(() => {
    if (isOpen && sourceId) {
      loadAuditLogs();
    }
  }, [isOpen, sourceId]);

  /**
   * Fetches audit logs for the specified source
   */
  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const logs = await fetchAuditLogs(sourceId);
      setAuditLogs(logs);
    } catch (err) {
      console.error("Error loading audit logs:", err);
      setError("Failed to load audit history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Audit History for "{sourceName}"</DialogTitle>
          <DialogDescription>
            View the history of external source validation checks
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : auditLogs.length === 0 ? (
          <EmptyState />
        ) : (
          <AuditLogsTable auditLogs={auditLogs} />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
