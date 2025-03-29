
/**
 * DomainSection Component
 * 
 * Displays the domain associated with the content.
 * Renders a badge for the domain or a message when no domain is specified.
 * 
 * @example
 * ```tsx
 * <DomainSection domain="Engineering" />
 * ```
 * 
 * @example
 * ```tsx
 * <DomainSection domain={null} /> // Shows "No domain specified" message
 * ```
 * 
 * @remarks
 * - Displays the domain in a styled badge when available
 * - Shows a placeholder message when domain is null
 * - Has consistent styling with other metadata sections
 */
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
