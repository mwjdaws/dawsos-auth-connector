
import React from "react";

interface DomainSectionProps {
  domain: string | null;
  className?: string;
}

export function DomainSection({ domain, className = "" }: DomainSectionProps) {
  if (!domain) return null;
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Domain</h3>
      <div className="text-sm">
        {domain}
      </div>
    </div>
  );
}
