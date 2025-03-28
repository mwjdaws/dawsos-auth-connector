
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

  useEffect(() => {
    if (isOpen && sourceId) {
      loadAuditLogs();
    }
  }, [isOpen, sourceId]);

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
