
import { useState, useCallback } from 'react';
import { KnowledgeSourceVersion } from '@/services/api/types';
import { useVersionCreation } from './useVersionCreation';
import { useVersionFetching } from './useVersionFetching';
import { useVersionRestoration } from './useVersionRestoration';

/**
 * Unified hook for version control operations
 * 
 * Combines creation, fetching, and restoration functionality
 */
export const useVersionControl = () => {
  const [versionError, setVersionError] = useState<Error | null>(null);

  // Version creation
  const { 
    isCreatingVersion,
    createVersion
  } = useVersionCreation();

  // Version fetching
  const {
    versions,
    isLoading: isLoadingVersions,
    fetchVersions,
  } = useVersionFetching();

  // Version restoration
  const {
    restoreVersion,
    isRestoring: isRestoringVersion
  } = useVersionRestoration();

  /**
   * Handle any errors in the version control process
   */
  const handleVersionError = useCallback((error: Error) => {
    setVersionError(error);
    console.error('Version control error:', error);
  }, []);

  return {
    // Version creation
    isCreatingVersion,
    createVersion,
    
    // Version fetching
    versions,
    isLoadingVersions,
    fetchVersions,
    
    // Version restoration
    isRestoringVersion,
    restoreVersion,
    
    // Error handling
    versionError,
    handleVersionError
  };
};

export default useVersionControl;
