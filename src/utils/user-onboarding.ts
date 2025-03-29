
import { useState, useCallback, useEffect } from "react";
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
 * Uses localStorage since user_preferences table doesn't exist
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
        // Load from localStorage
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

      // Save to localStorage
      localStorage.setItem(`user_preferences_${userId}`, JSON.stringify(updatedPrefs));
      setPreferences(updatedPrefs);
      console.log("Saved preferences to localStorage:", updatedPrefs);
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
 * Mocked implementation since feature_usage_logs table doesn't exist
 */
export function logFeatureUsage(
  userId: string | undefined,
  feature: string,
  metadata?: Record<string, any>
): void {
  if (!userId) return;
  
  try {
    console.log("Feature usage log (mocked):", {
      userId,
      feature,
      metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to log feature usage:", error);
  }
}
