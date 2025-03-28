
import { useState, useEffect, useTransition } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Tag {
  id: string;
  name: string;
  content_id: string;
}

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
}

export interface MarkdownMetadata {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  domain: string | null;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  isLoading: boolean;
}

export const useMarkdownMetadata = (contentId: string) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [domain, setDomain] = useState<string | null>(null);
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    
    const fetchMetadata = async () => {
      if (!contentId) return;
      
      setIsLoading(true);
      try {
        // Fetch tags for the content
        const { data: tagData, error: tagError } = await supabase
          .from("tags")
          .select("*")
          .eq("content_id", contentId);
        
        if (tagError) throw tagError;
        
        if (isMounted) {
          startTransition(() => {
            setTags(tagData || []);
          });
        }

        // Fetch external source URL and review status
        const { data: sourceData, error: sourceError } = await supabase
          .from("knowledge_sources")
          .select("external_source_url, external_source_checked_at, needs_external_review")
          .eq("id", contentId)
          .single();
          
        if (sourceError && sourceError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error for us
          throw sourceError;
        }
        
        if (isMounted && sourceData) {
          setExternalSourceUrl(sourceData.external_source_url);
          setLastCheckedAt(sourceData.external_source_checked_at);
          setNeedsExternalReview(sourceData.needs_external_review || false);
        }

        // In the future, fetch ontology terms and domain information
        // For now, we'll use placeholder data
        if (isMounted) {
          setOntologyTerms([]);
          setDomain(null);
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
        toast({
          title: "Error",
          description: "Failed to load content metadata",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (contentId) {
      fetchMetadata();
    }
    
    return () => {
      isMounted = false;
    };
  }, [contentId]);

  return {
    metadata: {
      tags,
      ontologyTerms,
      domain,
      externalSourceUrl,
      lastCheckedAt,
      needsExternalReview,
      isLoading
    },
    isPending,
    startTransition
  };
};
