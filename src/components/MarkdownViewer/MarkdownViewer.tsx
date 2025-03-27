import React, { useState, useEffect, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Copy, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { TagInput } from "./TagInput";

interface MarkdownViewerProps {
  content: string;
  contentId: string;
  editable?: boolean;
  className?: string;
}

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
}

export function MarkdownViewer({ content, contentId, editable = false, className }: MarkdownViewerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [domain, setDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [isMetadataCollapsed, setIsMetadataCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

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

  const handleAddTag = async () => {
    if (!newTag.trim() || !user) return;
    
    try {
      const newTagObj = {
        name: newTag.trim(),
        content_id: contentId
      };
      
      const { data, error } = await supabase
        .from("tags")
        .insert(newTagObj)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        startTransition(() => {
          setTags([...tags, data[0]]);
          setNewTag("");
        });
        
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
      }
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);
      
      if (error) throw error;
      
      startTransition(() => {
        setTags(tags.filter(tag => tag.id !== tagId));
      });
      
      toast({
        title: "Success",
        description: "Tag removed successfully",
      });
    } catch (error: any) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove tag",
        variant: "destructive",
      });
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Markdown content copied to clipboard",
    });
  };

  // Custom component to render wikilinks as clickable elements
  const renderWikiLinks = (text: string) => {
    const wikiLinkPattern = /\[\[(.*?)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = wikiLinkPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the wikilink as a span with styling
      const linkText = match[1];
      parts.push(
        <span 
          key={match.index} 
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => console.log(`Wiki link clicked: ${linkText}`)}
        >
          {linkText}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return <>{parts}</>;
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      {/* Markdown Content Section */}
      <div className="flex-1">
        <div className="bg-card border rounded-lg p-6 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Content</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Custom component to handle wikilinks
                p: ({ children }) => {
                  if (typeof children === 'string') {
                    return <p>{renderWikiLinks(children)}</p>;
                  }
                  return <p>{children}</p>;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Metadata Panel Section */}
      <div className="w-full lg:w-1/3 lg:max-w-xs">
        <Card className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <button
              className="flex w-full items-center justify-between"
              onClick={() => setIsMetadataCollapsed(!isMetadataCollapsed)}
            >
              <h2 className="text-xl font-semibold">Metadata</h2>
              {isMetadataCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {!isMetadataCollapsed && (
            <div className="p-4 space-y-4">
              {isLoading ? (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge 
                            key={tag.id} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag.name}
                            {editable && (
                              <button 
                                onClick={() => handleDeleteTag(tag.id)}
                                className="text-muted-foreground hover:text-foreground ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags available</p>
                    )}
                    
                    {editable && (
                      <div className="mt-2">
                        <TagInput 
                          onAddTag={handleAddTag} 
                          newTag={newTag} 
                          setNewTag={setNewTag} 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
                    {ontologyTerms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {ontologyTerms.map((term) => (
                          <Badge 
                            key={term.id} 
                            variant="outline"
                            className="bg-green-50"
                          >
                            {term.term}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No ontology terms available</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Domain</h3>
                    {domain ? (
                      <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                        {domain}
                      </Badge>
                    ) : (
                      <p className="text-sm text-muted-foreground">No domain specified</p>
                    )}
                  </div>
                </>
              )}
              {isPending && <div className="text-sm text-muted-foreground">Updating metadata...</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default MarkdownViewer;
