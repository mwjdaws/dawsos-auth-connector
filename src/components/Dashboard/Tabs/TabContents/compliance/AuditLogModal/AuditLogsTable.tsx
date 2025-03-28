
import React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ExternalLinkAudit } from "@/services/supabase/audit-logs";
import { AuditStatusBadge } from "./AuditStatusBadge";

interface AuditLogsTableProps {
  auditLogs: ExternalLinkAudit[];
}

export function AuditLogsTable({ auditLogs }: AuditLogsTableProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  const truncateHash = (hash: string | null) => {
    if (!hash) return 'N/A';
    return hash.length > 10 ? `${hash.substring(0, 10)}...` : hash;
  };

  return (
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
                <AuditStatusBadge status={log.status} />
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
  );
}
