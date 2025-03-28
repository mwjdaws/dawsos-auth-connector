
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
import { CheckCircle, AlertTriangle, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fetchAuditLogs, ExternalLinkAudit } from "@/services/supabase/audit-logs";

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
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
            <X className="h-4 w-4 mr-1" />
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
            {status}
          </Badge>
        );
    }
  };

  const truncateHash = (hash: string | null) => {
    if (!hash) return 'N/A';
    return hash.length > 10 ? `${hash.substring(0, 10)}...` : hash;
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
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm border rounded-md bg-red-50 border-red-200 text-red-800">
            {error}
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No audit history available for this item.</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Content Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(log.checked_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(log.status)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.notes || 'No notes'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs">
                      {truncateHash(log.content_hash)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
