
import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * RefreshIcon component
 * 
 * A simple wrapper around the RefreshCw icon from lucide-react
 * that adds animation support for loading states.
 * 
 * @param props - Icon props including loading state
 * @returns RefreshCw icon component with appropriate styling
 */
export const RefreshIcon: React.FC<{ loading?: boolean; className?: string }> = ({ 
  loading = false, 
  className = "" 
}) => {
  return (
    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} ${className}`} />
  );
};

export default RefreshIcon;
