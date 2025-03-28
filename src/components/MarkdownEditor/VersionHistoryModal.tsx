
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentVersioning } from '@/hooks/markdown-editor/useDocumentVersioning';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { handleError } from '@/utils/error-handling';
import { RefreshCw } from 'lucide-react';

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onVersionRestore: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  documentId,
  isOpen,
  onClose,
  onVersionRestore
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const { versions, isLoading, fetchVersions, restoreVersion } = useDocumentVersioning();

  // Load versions when the modal opens or document ID changes
  useEffect(() => {
    if (isOpen && documentId) {
      loadVersions();
    }
  }, [isOpen, documentId]);

  const loadVersions = async () => {
    if (!documentId) return;
    
    try {
      console.log('Loading versions for document:', documentId);
      await fetchVersions(documentId);
    } catch (error) {
      handleError(
        error,
        "Failed to load version history",
        { level: "error" }
      );
    }
  };

  const handleRestoreClick = (versionId: string) => {
    setSelectedVersionId(versionId);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!selectedVersionId) return;
    
    try {
      const success = await restoreVersion(selectedVersionId);
      if (success) {
        onVersionRestore();
        setIsConfirmDialogOpen(false);
        onClose();
      }
    } catch (error) {
      handleError(
        error,
        "Failed to restore version",
        { level: "error" }
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and restore previous versions of this document
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadVersions}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          ) : versions.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="mb-2">No version history available for this document</p>
              <p className="text-sm">Save changes to create new versions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <Card key={version.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">
                        Version {version.version_number}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <div className="mt-2 text-sm max-h-24 overflow-y-auto border p-2 bg-gray-50 rounded">
                      <pre className="whitespace-pre-wrap">{version.content.substring(0, 200)}...</pre>
                    </div>
                    {version.metadata && (
                      <div className="mt-2 text-xs text-gray-500">
                        {version.metadata.reason && (
                          <span>Reason: {version.metadata.reason}</span>
                        )}
                        {version.metadata.auto_version && (
                          <Badge variant="secondary" className="ml-2">Auto-saved</Badge>
                        )}
                        {version.metadata.published && (
                          <Badge variant="secondary" className="ml-2">Published</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gray-50 py-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRestoreClick(version.id)}
                    >
                      Restore This Version
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this version? This will replace the current content with the selected version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRestore}>
              Restore Version
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
