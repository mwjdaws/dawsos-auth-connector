
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunctionReliably } from "@/utils/edge-function-reliability";

interface UseDashboardEffectsProps {
  contentId: string;
  user: any;
}

export function useDashboardEffects({ contentId, user }: UseDashboardEffectsProps) {
  const navigate = useNavigate();

  // Authentication check effect
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      if (!user) {
        console.log("No authenticated user, redirecting to auth page");
        toast({
          title: "Authentication Required",
          description: "Please log in to access the dashboard.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
    
    // Set up realtime subscription for authenticated users
    if (user) {
      const channel = supabase
        .channel('public:tags')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'tags' },
          (payload) => {
            console.log('New tag added:', payload.new);
            toast({
              title: "New Tag Added",
              description: `A new tag "${payload.new.name}" was added to the system.`,
            });
          }
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'tags' },
          (payload) => {
            console.log('Tag deleted:', payload.old);
            toast({
              title: "Tag Removed",
              description: `A tag was removed from the system.`,
            });
          }
        )
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.error('Failed to subscribe to channel:', status);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [navigate, user]);

  // Check for pending agent tasks
  useEffect(() => {
    if (user) {
      const checkPendingTasks = async () => {
        try {
          const { data, error } = await supabase
            .from('agent_tasks')
            .select('id, agent_name, payload, status')
            .eq('status', 'completed')
            .limit(5);
            
          if (error) throw error;
          
          // Notify user of completed tasks
          if (data && data.length > 0) {
            // Update task status instead of using notified flag
            for (const task of data) {
              if (task && task.id) {
                await supabase
                  .from('agent_tasks')
                  .update({ status: 'notified' })
                  .eq('id', task.id);
              }
            }
              
            // Show a notification
            toast({
              title: `${data.length} Background Task${data.length > 1 ? 's' : ''} Completed`,
              description: `Agent tasks have finished processing.`,
            });
          }
        } catch (error) {
          console.error("Failed to check pending tasks:", error);
        }
      };
      
      // Check on load and set interval
      checkPendingTasks();
      const interval = setInterval(checkPendingTasks, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Check for edge function health
  useEffect(() => {
    const checkEdgeFunctionHealth = async () => {
      if (user) {
        try {
          await invokeEdgeFunctionReliably('get-related-tags', { knowledgeSourceId: contentId }, {
            timeoutMs: 5000,
            showErrorToast: false
          });
        } catch (error) {
          console.warn("Edge function health check failed:", error);
          // No need to show toast for this silent check
        }
      }
    };
    
    checkEdgeFunctionHealth();
  }, [contentId, user]);
}
