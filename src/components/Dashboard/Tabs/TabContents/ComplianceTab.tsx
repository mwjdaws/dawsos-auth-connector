
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ExternalLink, Calendar, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/utils/errors";
import { validateExternalSource, markForExternalReview, clearExternalReviewFlag } from "@/services/supabase/external-source-validator";

interface ExternalReviewItem {
  id: string;
  title: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
}

export function ComplianceTab() {
  const [reviewItems, setReviewItems] = useState<ExternalReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  
  // Fetch items that need external review
  const fetchReviewItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, title, external_source_url, external_source_checked_at, needs_external_review')
        .eq('needs_external_review', true)
        .order('title');
      
      if (error) throw error;
      
      setReviewItems(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching review items:", err);
      setError("Failed to load review items. Please try again.");
      handleError(err, "Failed to load compliance review items.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviewItems();
  }, []);
  
  // Handle validating an external source
  const handleValidateSource = async (id: string) => {
    try {
      setRefreshing(prev => ({ ...prev, [id]: true }));
      
      await validateExternalSource(id);
      
      // Refresh the item data
      await fetchReviewItems();
      
      toast({
        title: "Validation complete",
        description: "External source has been validated."
      });
    } catch (err) {
      console.error("Error validating source:", err);
      // Error is already handled in validateExternalSource
    } finally {
      setRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Handle toggling the review flag
  const toggleReviewFlag = async (id: string, currentValue: boolean) => {
    try {
      if (currentValue) {
        await clearExternalReviewFlag(id);
      } else {
        await markForExternalReview(id);
      }
      
      // Update the local state to reflect the change
      setReviewItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, needs_external_review: !currentValue } 
            : item
        )
      );
    } catch (err) {
      console.error("Error updating review flag:", err);
      toast({
        title: "Update failed",
        description: "Failed to update review status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };
  
  // Render the external review items table
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Content Requiring Review</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchReviewItems}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="p-4 text-sm border rounded-md bg-red-50 border-red-200 text-red-800">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading review items...</p>
        </div>
      ) : reviewItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No items flagged for external review.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>External Source</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    {item.external_source_url ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={item.external_source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:underline"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Source
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs break-all">{item.external_source_url}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-500">No source URL</span>
                    )}
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    {formatDate(item.external_source_checked_at)}
                  </TableCell>
                  <TableCell>
                    {item.needs_external_review ? (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Needs Review
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Reviewed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReviewFlag(item.id, item.needs_external_review)}
                      >
                        {item.needs_external_review ? "Mark as Reviewed" : "Flag for Review"}
                      </Button>
                      
                      {item.external_source_url && (
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleValidateSource(item.id)}
                          disabled={refreshing[item.id]}
                        >
                          {refreshing[item.id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            "Validate URL"
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
