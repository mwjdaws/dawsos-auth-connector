
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useVersions } from '@/hooks/useVersions';
import { formatDate } from '@/utils/date-formatting';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { VersionMetadata } from '@/services/api/types';
import { Json } from '@/types/supabase';

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onVersionRestore: () => void;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  documentId,
  isOpen,
  onClose,
  onVersionRestore
}) => {
  const { versions, isLoading, error, restoreVersion } = useVersions(documentId);

  const handleRestore = async (versionId: string) => {
    try {
      await restoreVersion(versionId);
      onVersionRestore();
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  // Generate version label based on metadata
  const getVersionLabel = (
    versionNumber: number,
    metadata: Json | null
  ): string => {
    if (!metadata) return `Version ${versionNumber}`;

    // Type guard to ensure metadata is an object with keys
    if (typeof metadata !== 'object' || metadata === null) {
      return `Version ${versionNumber}`;
    }

    // Cast metadata to VersionMetadata for type safety
    const meta = metadata as VersionMetadata;

    // Check if this version was created due to publishing
    if (meta.reason === 'Published document' || meta.published) {
      return `Published Version ${versionNumber}`;
    }

    // Check if this is an autosave version
    if (meta.isAutoSave) {
      return `Autosave ${versionNumber}`;
    }

    // Default version label if no special metadata is found
    return `Version ${versionNumber}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? (
            <p className="text-center py-4">Loading versions...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-4">Error loading versions</p>
          ) : versions?.length === 0 ? (
            <p className="text-center py-4">No previous versions found</p>
          ) : (
            <div className="space-y-4">
              {versions?.map((version) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">
                        {getVersionLabel(version.version_number, version.metadata)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(version.created_at || '')}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(version.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="text-sm text-gray-600 mt-2">
                    <p className="line-clamp-2">
                      {version.content.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryModal;
