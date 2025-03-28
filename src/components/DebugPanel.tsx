
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

export const DebugPanel = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code size={18} />
          Debug Panel
        </CardTitle>
        <CardDescription>
          Check database entries and publishing status
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Button 
          variant="outline" 
          onClick={fetchDocuments} 
          disabled={isLoading}
          className="mb-4"
        >
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        
        <div className="text-sm mb-2">
          <strong>Total documents in database:</strong> {documents.length}
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
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <p>This panel shows raw data from the knowledge_sources table.</p>
      </CardFooter>
    </Card>
  );
};

export default DebugPanel;
