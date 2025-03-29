
import { useVersionFetching } from './versioning/useVersionFetching';
import { useVersionCreation } from './versioning/useVersionCreation';
import { useVersionRestoration } from './versioning/useVersionRestoration';

/**
 * Main hook for document versioning functionality
 * 
 * This hook composes specialized hooks for fetching, creating and restoring
 * versions to provide a complete versioning experience.
 * 
 * @returns Object with all version management functions and state
 */
export const useDocumentVersioning = () => {
  // Use the specialized version hooks
  const { versions, isLoading, fetchVersions } = useVersionFetching();
  const { isCreatingVersion, createVersion } = useVersionCreation();
  const { restoreVersion } = useVersionRestoration();
  
  // Compose and return all version management functions and state
  return {
    // Version fetching
    versions,
    isLoading,
    fetchVersions,
    
    // Version creation
    isCreatingVersion,
    createVersion,
    
    // Version restoration
    restoreVersion
  };
};
