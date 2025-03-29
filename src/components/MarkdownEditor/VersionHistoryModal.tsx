
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useDocumentVersioning } from '@/hooks/markdown-editor/useDocumentVersioning';
import { format } from 'date-fns';
import { KnowledgeSourceVersion } from '@/services/api/types';
import { toast } from '@/hooks/use-toast';

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onVersionRestore?: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  documentId,
  isOpen,
  onClose,
  onVersionRestore
}) => {
  // Use the document versioning hook to access version history and restoration functions
  const { versions, isLoading, fetchVersions, restoreVersion, isCreatingVersion } = useDocumentVersioning();
  
  // Fetch versions when the modal opens
  useEffect(() => {
    if (isOpen && documentId) {
      fetchVersions(documentId);
    }
  }, [isOpen, documentId, fetchVersions]);
  
  // Handle restoring a version
  const handleRestore = async (versionId: string) => {
    const success = await restoreVersion(versionId);
    
    if (success) {
      toast({
        title: "Version Restored",
        description: "Document has been restored to the selected version.",
      });
      
      onClose();
      
      // Call the onVersionRestore callback if provided
      if (onVersionRestore) {
        onVersionRestore();
      }
    }
  };
  
  // Format metadata for display
  const getVersionDetails = (version: KnowledgeSourceVersion) => {
    const metadata = version.metadata || {};
    
    // Determine the reason for this version
    let reason = metadata.reason || 'Manual save';
    if (metadata.published) {
      reason = 'Published';
    } else if (metadata.isAutoSave) {
      reason = 'Auto-saved';
    }
    
    return { reason };
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Check if document is temporary (not yet saved)
  const isTemporaryDocument = documentId?.startsWith('temp-');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Version History
          </DialogTitle>
        </DialogHeader>
        
        {isTemporaryDocument ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="font-medium">This document hasn't been saved yet</p>
            <p className="mt-1">Save the document first to start tracking version history.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading versions...</p>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No versions found for this document.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => {
              const { reason } = getVersionDetails(version);
              
              return (
                <div 
                  key={version.id} 
                  className="border rounded-md p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      Version {version.version_number} - {reason}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(version.created_at)}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestore(version.id)}
                    disabled={isCreatingVersion}
                  >
                    {isCreatingVersion ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-1" />
                    )}
                    Restore
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
