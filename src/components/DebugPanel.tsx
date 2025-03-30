import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, BookOpen, FileEdit, Layers, ServerCrash, Activity, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { invokeEdgeFunctionReliably } from '@/utils/edge-function-reliability';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

/**
 * DebugPanel Component
 * 
 * A diagnostic component that allows developers and administrators to:
 * - View database entries from key tables
 * - Check edge function health and responses
 * - Validate database table structures
 * - Monitor system status with real-time updates
 * 
 * This panel respects Row Level Security (RLS) policies and only shows
 * data the current user has permission to access.
 */
export const DebugPanel = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sources');
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<Record<string, 'ok' | 'error' | 'loading'>>({});
  const [edgeFunctionResults, setEdgeFunctionResults] = useState<Record<string, any>>({});
  const { user } = useAuth();

  /**
   * Fetches knowledge sources data from the database
   * This function respects RLS policies
   */
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

  /**
   * Fetches knowledge templates data from the database
   * This function respects RLS policies
   */
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

  /**
   * Fetches knowledge source versions data with related source info
   * This function respects RLS policies
   */
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

  /**
   * Tests an edge function by invoking it and handling the response
   * 
   * @param functionName - Name of the edge function to test
   * @param payload - Data to pass to the edge function
   * @returns Promise with the function result
   */
  const checkEdgeFunction = async (functionName: string, payload: any = {}) => {
    setEdgeFunctionStatus(prev => ({ ...prev, [functionName]: 'loading' }));
    try {
      const result = await invokeEdgeFunctionReliably(
        functionName,
        payload,
        { 
          timeoutMs: 5000,
          showErrorToast: false 
        }
      );
      
      console.log(`Edge function ${functionName} response:`, result);
      setEdgeFunctionResults(prev => ({ ...prev, [functionName]: result }));
      setEdgeFunctionStatus(prev => ({ ...prev, [functionName]: 'ok' }));
      return result;
    } catch (error) {
      console.error(`Edge function ${functionName} error:`, error);
      setEdgeFunctionStatus(prev => ({ ...prev, [functionName]: 'error' }));
      setEdgeFunctionResults(prev => ({ 
        ...prev, 
        [functionName]: { error: error instanceof Error ? error.message : String(error) } 
      }));
    }
  };

  /**
   * Validates database table references against a known list
   * Used for ensuring all expected tables exist in the database
   */
  const validateTableReferences = async () => {
    setIsLoading(true);
    setError(null);
    
    const knownTables = [
      'knowledge_sources',
      'knowledge_source_versions',
      'knowledge_templates',
      'tags',
      'tag_types',
      'tag_relations',
      'agent_tasks',
      'agent_actions',
      'note_links',
      'ontology_terms',
      'ontology_relationships',
      'knowledge_source_ontology_terms',
      'external_link_audits',
      'permissions',
      'roles'
    ];
    
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from('knowledge_sources')
        .select('id')
        .limit(1);
      
      if (schemaError) {
        throw new Error(`Error fetching schema: ${schemaError.message}`);
      }
      
      setEdgeFunctionResults(prev => ({ 
        ...prev, 
        'table-validation': { 
          status: 'limited',
          message: 'Schema validation limited - using predefined table list',
          knownTables 
        } 
      }));
    } catch (err) {
      console.error("Failed to validate table references:", err);
      setEdgeFunctionResults(prev => ({ 
        ...prev, 
        'table-validation': { 
          error: err instanceof Error ? err.message : String(err),
          status: 'error' 
        } 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Load the appropriate data when the active tab changes
  useEffect(() => {
    if (activeTab === 'sources') {
      fetchDocuments();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    } else if (activeTab === 'versions') {
      fetchVersions();
    } else if (activeTab === 'diagnostics') {
      validateTableReferences();
    }
  }, [activeTab]);

  /**
   * Handles the refresh button click based on the active tab
   * Fetches fresh data from the database and edge functions
   */
  const handleRefresh = () => {
    if (activeTab === 'sources') {
      fetchDocuments();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    } else if (activeTab === 'versions') {
      fetchVersions();
    } else if (activeTab === 'diagnostics') {
      validateTableReferences();
      
      checkEdgeFunction('get-related-tags', { knowledgeSourceId: documents[0]?.id || 'temp-' + Date.now() });
      
      if (documents.length > 0) {
        const sampleDoc = documents[0];
        checkEdgeFunction('suggest-ontology-terms', { 
          sourceId: sampleDoc.id,
          content: sampleDoc.content,
          title: sampleDoc.title
        });
      }
    }
  };

  /**
   * Renders a status badge with appropriate styling based on status
   * 
   * @param status - Current status to display
   * @returns JSX element with styled badge
   */
  const renderStatusBadge = (status: 'ok' | 'error' | 'loading' | undefined) => {
    switch (status) {
      case 'ok':
        return <Badge className="ml-2 bg-green-500 hover:bg-green-600">OK</Badge>;
      case 'error':
        return <Badge variant="destructive" className="ml-2">Error</Badge>;
      case 'loading':
        return <Badge variant="outline" className="ml-2">Loading...</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">Not Tested</Badge>;
    }
  };

  /**
   * Renders the edge function test results in the diagnostics tab
   * Shows health status and detailed response data
   */
  const renderEdgeFunctionResults = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-md border">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              Edge Function Health
              <span className="ml-2 text-xs text-muted-foreground">(Click Refresh to test)</span>
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted rounded-sm">
                <span>get-related-tags</span>
                {renderStatusBadge(edgeFunctionStatus['get-related-tags'])}
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted rounded-sm">
                <span>suggest-ontology-terms</span>
                {renderStatusBadge(edgeFunctionStatus['suggest-ontology-terms'])}
              </div>
            </div>
            
            {(edgeFunctionStatus['get-related-tags'] === 'error' || 
              edgeFunctionStatus['suggest-ontology-terms'] === 'error') && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Edge Function Error</AlertTitle>
                <AlertDescription>
                  One or more edge functions failed to respond. Check console logs for details.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="p-4 rounded-md border">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              Table Reference Validation
              {edgeFunctionResults['table-validation']?.status === 'ok' && 
                <Badge className="ml-2 bg-green-500 hover:bg-green-600">All Tables Valid</Badge>}
              {edgeFunctionResults['table-validation']?.status === 'warning' && 
                <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">Missing Tables</Badge>}
              {edgeFunctionResults['table-validation']?.status === 'error' && 
                <Badge variant="destructive" className="ml-2">Validation Error</Badge>}
            </h3>
            
            {edgeFunctionResults['table-validation'] && !edgeFunctionResults['table-validation'].error && (
              <div className="space-y-2 mt-2">
                {edgeFunctionResults['table-validation'].missingTables?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-yellow-600">Missing Tables:</h4>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {edgeFunctionResults['table-validation'].missingTables.map((table: string) => (
                        <span key={table} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs">
                          {table}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {edgeFunctionResults['table-validation'].unusedTables?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-blue-600">Detected Tables (not in reference list):</h4>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {edgeFunctionResults['table-validation'].unusedTables.map((table: string) => (
                        <span key={table} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {table}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {edgeFunctionResults['table-validation']?.error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Error</AlertTitle>
                <AlertDescription>
                  {edgeFunctionResults['table-validation'].error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="p-4 rounded-md border">
          <h3 className="text-lg font-medium mb-2">Response Data</h3>
          <ScrollArea className="h-[250px]">
            {Object.entries(edgeFunctionResults).map(([key, value]) => (
              <div key={key} className="mb-4 pb-4 border-b">
                <h4 className="font-medium">{key}</h4>
                <pre className="whitespace-pre-wrap mt-2 text-xs p-2 bg-muted rounded-md overflow-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    );
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
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <FileEdit className="h-4 w-4" />
              Sources
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Versions
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Diagnostics
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
          
          <TabsContent value="diagnostics">
            {renderEdgeFunctionResults()}
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
