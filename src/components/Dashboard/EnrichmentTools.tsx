
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { triggerBatchEnrichment, enrichSingleSource } from '@/services/api/enrichment';

export function EnrichmentTools() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [batchSize, setBatchSize] = useState(10);
  const [applyTerms, setApplyTerms] = useState(true);
  
  const handleBatchEnrichment = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      const data = await triggerBatchEnrichment(batchSize, applyTerms);
      setResults(data);
      
      toast({
        title: "Batch Enrichment Complete",
        description: `Successfully processed ${data.successful} out of ${data.processed} knowledge sources.`,
      });
    } catch (error) {
      console.error("Batch enrichment error:", error);
      toast({
        title: "Enrichment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Ontology Enrichment Tools</CardTitle>
        <CardDescription>
          Process published knowledge sources that haven't been enriched yet with ontology suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="batch-size" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Batch Size
            </label>
            <Input
              id="batch-size"
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={50}
              className="mt-2"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium leading-none">Apply Ontology Terms</span>
            <div className="flex items-center space-x-2">
              <Switch 
                id="apply-terms" 
                checked={applyTerms} 
                onCheckedChange={setApplyTerms} 
              />
              <label htmlFor="apply-terms" className="text-sm text-muted-foreground">
                Auto-apply high confidence terms
              </label>
            </div>
          </div>
        </div>
        
        {results && (
          <Alert>
            <AlertDescription className="space-y-2">
              <p>Processed {results.processed} knowledge sources</p>
              <p>Successfully enriched: {results.successful}</p>
              <p>Failed: {results.failed}</p>
              {results.results && results.results.length > 0 && (
                <details>
                  <summary className="cursor-pointer font-medium">View Details</summary>
                  <ul className="mt-2 space-y-1 text-sm">
                    {results.results.map((result: any, index: number) => (
                      <li key={index} className={result.success ? "text-green-600" : "text-red-600"}>
                        {result.title} - {result.success 
                          ? `Success (${result.termsApplied} terms applied)` 
                          : `Failed: ${result.error}`}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBatchEnrichment} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Processing..." : "Run Batch Enrichment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
