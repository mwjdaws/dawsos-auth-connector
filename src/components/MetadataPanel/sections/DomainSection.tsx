
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface DomainSectionProps {
  domain: string;
  description?: string;
  className?: string;
}

/**
 * Section that displays the domain information for a content item
 * with an optional description tooltip
 */
export const DomainSection: React.FC<DomainSectionProps> = ({
  domain,
  description,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center gap-1">
        <h3 className="text-sm font-medium mb-2">Domain</h3>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Badge variant="secondary" className="text-xs py-1">
        {domain}
      </Badge>
    </div>
  );
};
