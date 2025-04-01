
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date-formatting';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Json } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onVersionRestore: () => void;
}

// Define types for versions
interface Version {
  id: string;
  source_id: string;
  version_number: number;
  content: string;
  metadata: Json | null;
  created_at: string | null;
}

// Define VersionMetadata type
interface VersionMetadata {
  reason?: string;
  published?: boolean;
  isAutoSave?: boolean;
  [key: string]: any;
}

export const useVersions = (documentId: string) => {
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchVersions = async () => {
      if (!documentId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('knowledge_source_versions')
          .select('*')
          .eq('source_id', documentId)
          .order('version_number', { ascending: false });
        
        if (error) throw error;
        // Type assertion to ensure data matches Version interface
        setVersions(data as Version[] || []);
      } catch (err) {
        console.error('Error fetching versions:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch versions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, [documentId]);

  const restoreVersion = async (versionId: string): Promise<boolean> => {
    if (!documentId) return false;
    
    try {
      // Fetch the version content
      const { data, error } = await supabase
        .from('knowledge_source_versions')
        .select('content')
        .eq('id', versionId)
        .single();
      
      if (error) throw error;
      
      // Update the knowledge source with this content
      const { error: updateError } = await supabase
        .from('knowledge_sources')
        .update({ 
          content: data.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
      
      if (updateError) throw updateError;
      
      return true;
    } catch (err) {
      console.error('Error restoring version:', err);
      return false;
    }
  };

  return { versions, isLoading, error, restoreVersion };
};

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
                        {version.created_at ? formatDate(version.created_at) : 'No date'}
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
