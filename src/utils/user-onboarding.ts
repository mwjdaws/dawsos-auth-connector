
import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { handleError } from "@/utils/errors";

// Define types for preferences
export interface UserPreferences {
  defaultTab?: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  [key: string]: any;
}

/**
 * Custom hook for managing user preferences
 * Note: user_preferences table might not exist; using localStorage as fallback
 */
export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    if (!userId) {
      setPreferences({});
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        // Try to load from localStorage as user_preferences table might not exist
        const storedPrefs = localStorage.getItem(`user_preferences_${userId}`);
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs));
          console.log("Loaded preferences from localStorage:", storedPrefs);
        } else {
          // Set defaults if no preferences are found
          const defaults: UserPreferences = {
            defaultTab: "tag-generator",
            theme: 'system',
            notifications: true
          };
          setPreferences(defaults);
          localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(defaults));
        }
        setInitialized(true);

        // Note: Actual implementation if user_preferences table existed:
        /*
        const { data, error } = await supabase
          .from('user_preferences')
          .select('preferences')
          .eq('user_id', userId)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No preferences found, set defaults
            const defaults: UserPreferences = {
              defaultTab: "tag-generator",
              theme: 'system',
              notifications: true
            };
            setPreferences(defaults);
            await saveDefaults(userId, defaults);
          } else {
            throw error;
          }
        } else {
          setPreferences(data.preferences || {});
        }
        */
      } catch (error) {
        console.error("Failed to load preferences:", error);
        // Set defaults as fallback
        setPreferences({
          defaultTab: "tag-generator",
          theme: 'system',
          notifications: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  // Update preferences
  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    if (!userId || !initialized) return;
    
    try {
      const updatedPrefs = {
        ...preferences,
        ...newPrefs
      };

      // Save to localStorage as user_preferences table might not exist
      localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(updatedPrefs));
      setPreferences(updatedPrefs);
      console.log("Saved preferences to localStorage:", updatedPrefs);

      // Note: Actual implementation if user_preferences table existed:
      /*
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences: updatedPrefs,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setPreferences(updatedPrefs);
      */
    } catch (error) {
      handleError(
        error, 
        "Failed to update preferences", 
        { level: "warning", silent: true }
      );
    }
  }, [userId, preferences, initialized]);

  // Reset preferences to defaults
  const resetPreferences = useCallback(async () => {
    if (!userId) return;
    
    try {
      const defaults: UserPreferences = {
        defaultTab: "tag-generator",
        theme: 'system',
        notifications: true
      };

      // Save to localStorage
      localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(defaults));
      setPreferences(defaults);
      
      // Note: Actual implementation if user_preferences table existed:
      /*
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences: defaults,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setPreferences(defaults);
      */
      
      toast({
        title: "Preferences Reset",
        description: "Your preferences have been reset to defaults.",
      });
    } catch (error) {
      handleError(
        error, 
        "Failed to reset preferences", 
        { level: "error" }
      );
    }
  }, [userId]);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading
  };
}

/**
 * Log feature usage for analytics
 * Note: feature_usage_logs table might not exist; this function is mocked
 */
export async function logFeatureUsage(
  userId: string | undefined,
  feature: string,
  metadata?: Record<string, any>
): Promise<void> {
  if (!userId) return;
  
  try {
    console.log("Feature usage log (mocked):", {
      userId,
      feature,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    // If the feature_usage_logs table existed, we would do:
    /*
    const { error } = await supabase
      .from('feature_usage_logs')
      .insert({
        user_id: userId,
        feature,
        metadata,
        created_at: new Date().toISOString()
      });
      
    if (error) throw error;
    */
  } catch (error) {
    console.error("Failed to log feature usage:", error);
    // Don't throw for logging failures
  }
}
