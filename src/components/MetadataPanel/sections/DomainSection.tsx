
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DomainSectionProps } from "../types";

export const DomainSection: React.FC<DomainSectionProps> = ({ 
  domain,
  className 
}) => {
  return (
    <div className={className}>
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
};
