
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Tag {
  id: string;
  name: string;
}

interface OntologyTerm {
  id: string;
  term: string;
  domain?: string;
}

interface MetadataPanelProps {
  contentId: string;
  className?: string;
  onMetadataChange?: () => void;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  contentId, 
  className,
  onMetadataChange
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [domains, setDomains] = useState<string[]>([]);

  // Fetch metadata for the given content ID
  const fetchMetadata = async () => {
    setIsLoading(true);
    try {
      // Fetch tags for the content
      const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select("*")
        .eq("content_id", contentId);

      if (tagsError) throw tagsError;
      setTags(tagsData || []);

      // Fetch ontology terms (if implemented)
      // This would be based on your database structure
      const { data: termsData, error: termsError } = await supabase
        .from("ontology_terms")
        .select("*")
        .eq("content_id", contentId);

      if (termsError) throw termsError;
      setOntologyTerms(termsData || []);

      // Extract unique domains from ontology terms
      if (termsData) {
        const uniqueDomains = Array.from(
          new Set(termsData.map(term => term.domain).filter(Boolean))
        );
        setDomains(uniqueDomains as string[]);
      }

    } catch (error) {
      console.error("Error fetching metadata:", error);
      toast({
        title: "Error",
        description: "Failed to load metadata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a tag
  const handleDeleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;

      // Update local state
      setTags(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      
      // Notify parent component if callback provided
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
    }
  };

  // Load metadata when the component mounts or contentId changes
  useEffect(() => {
    if (contentId) {
      fetchMetadata();
    }
  }, [contentId]);

  // Display loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Tags</h4>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if there's any metadata to display
  const hasMetadata = tags.length > 0 || ontologyTerms.length > 0 || domains.length > 0;
  
  if (!hasMetadata) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No metadata available for this content.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="bg-blue-50 group flex items-center gap-1 pr-1"
                >
                  <span>{tag.name}</span>
                  <button 
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-1 p-0.5 rounded-full opacity-60 hover:opacity-100 hover:bg-red-100 transition-opacity"
                    aria-label={`Delete tag ${tag.name}`}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {ontologyTerms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Ontology Terms</h4>
            <div className="flex flex-wrap gap-2">
              {ontologyTerms.map((term) => (
                <Badge key={term.id} variant="outline" className="bg-green-50">
                  {term.term}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {domains.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Domains</h4>
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Badge key={domain} variant="outline" className="bg-purple-50">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetadataPanel;
