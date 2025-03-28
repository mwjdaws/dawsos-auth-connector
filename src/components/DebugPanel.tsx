
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, BookOpen, FileEdit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

export const DebugPanel = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sources');
  const { user } = useAuth();

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching knowledge sources data...");
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching knowledge sources:", error);
        setError(error.message);
        throw error;
      }
      
      console.log("Knowledge sources data:", data);
      setDocuments(data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching templates data...");
      
      const { data, error } = await supabase
        .from('knowledge_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching templates:", error);
        setError(error.message);
        throw error;
      }
      
      console.log("Templates data:", data);
      setTemplates(data || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVersions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching versions data...");
      
      const { data, error } = await supabase
        .from('knowledge_source_versions')
        .select('*, knowledge_sources(title)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching versions:", error);
        setError(error.message);
        throw error;
      }
      
      console.log("Versions data:", data);
      setVersions(data || []);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sources') {
      fetchDocuments();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    } else if (activeTab === 'versions') {
      fetchVersions();
    }
  }, [activeTab]);

  const handleRefresh = () => {
    if (activeTab === 'sources') {
      fetchDocuments();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    } else if (activeTab === 'versions') {
      fetchVersions();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code size={18} />
          Debug Panel
        </CardTitle>
        <CardDescription>
          Check database entries and publishing status (with RLS applied)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <strong>Current User ID:</strong> {user ? user.id : 'Not authenticated'}
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <FileEdit className="h-4 w-4" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Versions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources">
            <div className="text-sm mb-2">
              <strong>Total documents:</strong> {documents.length}
            </div>
            
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="mb-4 pb-4 border-b">
                    <h3 className="font-medium">{doc.title}</h3>
                    <div className="text-sm mt-1 text-muted-foreground">
                      <div><strong>ID:</strong> {doc.id}</div>
                      <div><strong>User ID:</strong> {doc.user_id || 'None'}</div>
                      <div><strong>Published:</strong> {doc.published ? 'Yes' : 'No'}</div>
                      <div><strong>Created:</strong> {new Date(doc.created_at).toLocaleString()}</div>
                      {doc.published && doc.published_at && (
                        <div><strong>Published at:</strong> {new Date(doc.published_at).toLocaleString()}</div>
                      )}
                    </div>
                    <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                      <pre className="whitespace-pre-wrap">
                        {doc.content.length > 100 ? `${doc.content.substring(0, 100)}...` : doc.content}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {isLoading ? 'Loading...' : 'No documents found in the database'}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="text-sm mb-2">
              <strong>Total templates:</strong> {templates.length}
            </div>
            
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {templates.length > 0 ? (
                templates.map((template) => (
                  <div key={template.id} className="mb-4 pb-4 border-b">
                    <h3 className="font-medium">{template.name}</h3>
                    <div className="text-sm mt-1 text-muted-foreground">
                      <div><strong>ID:</strong> {template.id}</div>
                      <div><strong>Global:</strong> {template.is_global ? 'Yes' : 'No'}</div>
                      <div><strong>Created:</strong> {new Date(template.created_at).toLocaleString()}</div>
                      {template.updated_at && (
                        <div><strong>Updated:</strong> {new Date(template.updated_at).toLocaleString()}</div>
                      )}
                    </div>
                    <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                      <pre className="whitespace-pre-wrap">
                        {template.content.length > 100 ? `${template.content.substring(0, 100)}...` : template.content}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {isLoading ? 'Loading...' : 'No templates found in the database'}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="versions">
            <div className="text-sm mb-2">
              <strong>Total versions:</strong> {versions.length}
            </div>
            
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {versions.length > 0 ? (
                versions.map((version) => (
                  <div key={version.id} className="mb-4 pb-4 border-b">
                    <h3 className="font-medium">
                      {version.knowledge_sources?.title || 'Unknown Source'} (v{version.version_number})
                    </h3>
                    <div className="text-sm mt-1 text-muted-foreground">
                      <div><strong>ID:</strong> {version.id}</div>
                      <div><strong>Source ID:</strong> {version.source_id}</div>
                      <div><strong>Version:</strong> {version.version_number}</div>
                      <div><strong>Created:</strong> {new Date(version.created_at).toLocaleString()}</div>
                    </div>
                    <div className="mt-2 text-xs p-2 bg-muted rounded-md">
                      <pre className="whitespace-pre-wrap">
                        {version.content.length > 100 ? `${version.content.substring(0, 100)}...` : version.content}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {isLoading ? 'Loading...' : 'No versions found in the database'}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <p>This panel shows data filtered by Row Level Security (RLS) policies - you'll only see content you have permission to access.</p>
      </CardFooter>
    </Card>
  );
};

export default DebugPanel;
