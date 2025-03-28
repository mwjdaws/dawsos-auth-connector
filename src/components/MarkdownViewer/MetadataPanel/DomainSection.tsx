
import React from "react";
import { Badge } from "@/components/ui/badge";

interface DomainSectionProps {
  domain: string | null;
}

export function DomainSection({ domain }: DomainSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Domain</h3>
      {domain ? (
        <Badge className="bg-blue-50 text-blue-800 border-blue-200">
          {domain}
        </Badge>
      ) : (
        <p className="text-sm text-muted-foreground">No domain specified</p>
      )}
    </div>
  );
}
