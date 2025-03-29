
/**
 * User Onboarding Utilities
 * 
 * Provides utilities to improve user adoption:
 * - Step-by-step onboarding guides
 * - Feature discovery
 * - User preferences
 * - Template assistance
 */

import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Onboarding steps for new users
export const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to the Knowledge System",
    description: "Let's get you started with the essential features.",
    placement: "center",
  },
  {
    id: "tag-generator",
    title: "Tag Generator",
    description: "Generate tags automatically from your content.",
    target: "[data-tab='tag-generator']",
    placement: "bottom",
  },
  {
    id: "metadata",
    title: "Metadata Management",
    description: "View and edit metadata for your knowledge sources.",
    target: "[data-tab='metadata']",
    placement: "bottom",
  },
  {
    id: "editor",
    title: "Markdown Editor",
    description: "Create and edit knowledge content with full formatting support.",
    target: "[data-tab='editor']",
    placement: "bottom",
  },
  {
    id: "templates",
    title: "Knowledge Templates",
    description: "Use templates to create structured knowledge sources quickly.",
    target: "[data-tab='templates']",
    placement: "bottom",
  },
];

/**
 * User preferences interface
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultTab: string;
  showOnboarding: boolean;
  completedOnboarding: string[];
  enableNotifications: boolean;
  defaultTemplate?: string;
}

/**
 * Default user preferences
 */
const defaultPreferences: UserPreferences = {
  theme: "system",
  defaultTab: "tag-generator",
  showOnboarding: true,
  completedOnboarding: [],
  enableNotifications: true,
};

/**
 * Saves user preferences
 */
export async function saveUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<void> {
  try {
    // First get existing preferences
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("preferences")
      .eq("user_id", userId)
      .maybeSingle();
      
    const mergedPreferences = {
      ...(existing?.preferences || defaultPreferences),
      ...preferences,
    };
    
    // Upsert the preferences
    await supabase
      .from("user_preferences")
      .upsert({
        user_id: userId,
        preferences: mergedPreferences,
      });
      
    // Store in local storage for faster access
    localStorage.setItem(
      `user_prefs_${userId}`,
      JSON.stringify(mergedPreferences)
    );
  } catch (error) {
    console.error("Failed to save user preferences:", error);
    
    // Still update local storage
    try {
      const localPrefs = JSON.parse(
        localStorage.getItem(`user_prefs_${userId}`) || "{}"
      );
      
      localStorage.setItem(
        `user_prefs_${userId}`,
        JSON.stringify({
          ...localPrefs,
          ...preferences,
        })
      );
    } catch (e) {
      console.error("Failed to update local preferences:", e);
    }
  }
}

/**
 * Gets user preferences with caching
 */
export async function getUserPreferences(
  userId: string
): Promise<UserPreferences> {
  if (!userId) return defaultPreferences;
  
  try {
    // Try local storage first
    const localPrefs = localStorage.getItem(`user_prefs_${userId}`);
    if (localPrefs) {
      return {
        ...defaultPreferences,
        ...JSON.parse(localPrefs),
      };
    }
    
    // Fetch from database
    const { data } = await supabase
      .from("user_preferences")
      .select("preferences")
      .eq("user_id", userId)
      .maybeSingle();
      
    const preferences = data?.preferences || defaultPreferences;
    
    // Store in local storage
    localStorage.setItem(
      `user_prefs_${userId}`,
      JSON.stringify(preferences)
    );
    
    return preferences;
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return defaultPreferences;
  }
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load preferences
  useEffect(() => {
    let isMounted = true;
    
    if (userId) {
      getUserPreferences(userId)
        .then(prefs => {
          if (isMounted) {
            setPreferences(prefs);
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error("Error loading preferences:", error);
          if (isMounted) {
            setIsLoading(false);
          }
        });
    } else {
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [userId]);
  
  // Update preferences
  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!userId) {
      setPreferences(prev => ({ ...prev, ...newPrefs }));
      return;
    }
    
    try {
      setPreferences(prev => ({ ...prev, ...newPrefs }));
      await saveUserPreferences(userId, newPrefs);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast({
        title: "Preference Update Failed",
        description: "Your preferences couldn't be saved.",
        variant: "destructive",
      });
    }
  };
  
  return {
    preferences,
    isLoading,
    updatePreferences,
  };
}

/**
 * Logs feature usage for analytics
 */
export async function logFeatureUsage(
  userId: string,
  feature: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from("feature_usage_logs")
      .insert({
        user_id: userId,
        feature,
        metadata,
      });
  } catch (error) {
    console.error("Failed to log feature usage:", error);
    // Don't throw errors for logging failures
  }
}
