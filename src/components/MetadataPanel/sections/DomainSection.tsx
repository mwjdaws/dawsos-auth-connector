
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DomainSectionProps {
  domain: string;
}

/**
 * Section that displays the domain information for a content item
 */
export const DomainSection: React.FC<DomainSectionProps> = ({
  domain
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Domain</h3>
      <Badge variant="secondary" className="text-xs py-1">
        {domain}
      </Badge>
    </div>
  );
};
