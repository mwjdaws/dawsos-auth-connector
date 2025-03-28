
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { History, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { fetchKnowledgeSourceVersions, restoreKnowledgeSourceVersion } from '@/services/api/knowledgeSourceVersions';
import { KnowledgeSourceVersion } from '@/services/api/types';
import { useDocumentVersioning } from '@/hooks/markdown-editor/useDocumentVersioning';

interface VersionHistoryModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onVersionRestore: () => void;
}

export function VersionHistoryModal({ 
  documentId, 
  isOpen, 
  onClose,
  onVersionRestore
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<KnowledgeSourceVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { createVersion } = useDocumentVersioning();

  useEffect(() => {
    if (isOpen && documentId) {
      loadVersions();
    }
  }, [isOpen, documentId]);

  const loadVersions = async () => {
    if (!documentId) return;
    
    setIsLoading(true);
    try {
      const versionData = await fetchKnowledgeSourceVersions(documentId);
      setVersions(versionData || []);
    } catch (error) {
      console.error('Failed to load versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document versions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewVersion = (version: KnowledgeSourceVersion) => {
    // For now just show the content in a new tab/window
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Version ${version.version_number} - ${new Date(version.created_at || '').toLocaleString()}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>Version ${version.version_number}</h1>
            <p><strong>Created:</strong> ${new Date(version.created_at || '').toLocaleString()}</p>
            <hr/>
            <pre>${version.content}</pre>
          </body>
        </html>
      `);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!documentId) return;
    
    setIsRestoring(true);
    try {
      // First create a version of the current content
      await createVersion(documentId);
      
      // Then restore the selected version
      await restoreKnowledgeSourceVersion(versionId);
      
      toast({
        title: 'Success',
        description: 'Document version restored successfully',
      });
      
      onVersionRestore();
      onClose();
    } catch (error) {
      console.error('Failed to restore version:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore document version',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Document Version History
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No version history available for this document
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => {
                    // Extract metadata for display
                    const metadata = version.metadata as Record<string, any> || {};
                    const source = metadata.saved_from === 'auto_save' ? 'Auto Save' : 'Manual Save';
                    
                    return (
                      <TableRow key={version.id}>
                        <TableCell className="font-medium">
                          Version {version.version_number}
                        </TableCell>
                        <TableCell>
                          {version.created_at ? format(new Date(version.created_at), 'MMM d, yyyy h:mm a') : 'Unknown'}
                        </TableCell>
                        <TableCell>{source}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewVersion(version)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestoreVersion(version.id)}
                              disabled={isRestoring}
                              className="flex items-center gap-1"
                            >
                              <RotateCcw className="h-4 w-4" />
                              <span className="hidden sm:inline">Restore</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
