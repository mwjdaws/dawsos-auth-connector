
import { useVersionCreation } from './useVersionCreation';
import { useVersionFetching } from './useVersionFetching';
import { useVersionRestoration } from './useVersionRestoration';

/**
 * Main hook for version control operations
 * 
 * This is a composition hook that combines creation, fetching, and restoration
 * functionalities for document versioning.
 */
export const useVersionControl = () => {
  // Version creation hooks
  const { 
    createVersion, 
    isCreatingVersion, 
    versionError: creationError 
  } = useVersionCreation();
  
  // Version fetching hooks
  const { 
    fetchVersions, 
    versions, 
    isLoadingVersions,
    versionError: fetchError
  } = useVersionFetching();
  
  // Version restoration hooks
  const { 
    restoreVersion, 
    isRestoringVersion,
    versionError: restorationError
  } = useVersionRestoration();
  
  // Combine error states
  const error = creationError || fetchError || restorationError;
  
  return {
    // Creation
    createVersion,
    isCreatingVersion,
    
    // Fetching
    fetchVersions,
    versions,
    isLoadingVersions,
    
    // Restoration
    restoreVersion,
    isRestoringVersion,
    
    // Combined state
    error
  };
};

export default useVersionControl;
