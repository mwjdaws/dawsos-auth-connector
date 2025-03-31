
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { withErrorHandling } from '@/utils/errors';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  onRefresh?: () => Promise<void> | void; // Updated type to accept both Promise and void
  showCreateButton?: boolean;
  createButtonLabel?: string;
  createButtonHref?: string;
}

export function DashboardHeader({
  title,
  description,
  isLoading = false,
  onRefresh,
  showCreateButton = true,
  createButtonLabel = 'Create Knowledge',
  createButtonHref = '/create'
}: DashboardHeaderProps) {
  // Wrap the refresh handler with error handling
  const handleRefresh = onRefresh
    ? withErrorHandling(async () => {
        // Convert regular function to async to satisfy the WrappableFunction type
        return await Promise.resolve(onRefresh());
      }, {
        errorMessage: 'Failed to refresh data',
        level: 'error'
      })
    : undefined;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        )}

        {showCreateButton && (
          <Button asChild size="sm">
            <Link to={createButtonHref}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {createButtonLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
