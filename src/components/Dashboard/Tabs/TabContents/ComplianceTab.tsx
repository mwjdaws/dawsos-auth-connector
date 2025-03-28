
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
import { ExternalLink, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { markForExternalReview } from "@/services/supabase/external-source-validator";
import { handleError } from "@/utils/errors";

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
  
  // Fetch items that need external review
  useEffect(() => {
    async function fetchReviewItems() {
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
    }
    
    fetchReviewItems();
  }, []);
  
  // Handle toggling the review flag
  const toggleReviewFlag = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('knowledge_sources')
        .update({ needs_external_review: !currentValue })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state to reflect the change
      setReviewItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, needs_external_review: !currentValue } 
            : item
        )
      );
      
      toast({
        title: "Review status updated",
        description: `Item has been ${!currentValue ? "flagged for" : "cleared from"} review.`,
      });
    } catch (err) {
      console.error("Error updating review flag:", err);
      toast({
        title: "Update failed",
        description: "Failed to update review status. Please try again.",
        variant: "destructive"
      });
      handleError(err, "Failed to update compliance review flag.");
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
                    <a 
                      href={item.external_source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Source
                    </a>
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
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Needs Review
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Reviewed
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleReviewFlag(item.id, item.needs_external_review)}
                  >
                    {item.needs_external_review ? "Clear Flag" : "Flag for Review"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
