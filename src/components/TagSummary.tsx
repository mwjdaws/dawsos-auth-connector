
import { useState, useEffect, useRef, useTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { memo } from "react";

export const TagSummary = memo(function TagSummary() {
  const [tagData, setTagData] = useState<Array<{ name: string, usage_count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    async function fetchTagSummary() {
      try {
        setIsLoading(true);
        // Query the tag_summary materialized view
        const { data, error } = await supabase
          .from('tag_summary')
          .select('*')
          .order('usage_count', { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching tag summary:", error);
          if (isMounted.current) {
            startTransition(() => {
              setError(error.message);
            });
          }
          return;
        }

        // Transform data for the chart if needed
        if (isMounted.current) {
          startTransition(() => {
            const formattedData = data.map(item => ({
              name: item.name || 'Unknown',
              usage_count: Number(item.usage_count) || 0
            }));
            setTagData(formattedData);
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        if (isMounted.current) {
          startTransition(() => {
            setError("An unexpected error occurred");
          });
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    }

    fetchTagSummary();
  }, []);

  const renderContent = useMemo(() => {
    if (error) {
      return (
        <div className="p-4 text-destructive">
          Error loading tag statistics: {error}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-[250px] w-full" />
        </div>
      );
    }

    if (tagData.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No tag usage data available yet.
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={tagData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="usage_count" fill="#8884d8" name="Usage Count" />
        </BarChart>
      </ResponsiveContainer>
    );
  }, [error, isLoading, tagData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag Usage Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent}
        {isPending && <div className="text-sm text-muted-foreground mt-2">Updating chart data...</div>}
      </CardContent>
    </Card>
  );
});

export default TagSummary;
