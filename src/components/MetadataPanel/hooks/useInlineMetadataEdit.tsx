
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

interface UseInlineMetadataEditProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export const useInlineMetadataEdit = ({
  contentId,
  onMetadataChange
}: UseInlineMetadataEditProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Update a metadata field
   */
  const updateMetadataField = async (field: string, value: any) => {
    if (!isValidContentId(contentId)) {
      return false;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .update({ [field]: value })
        .eq('id', contentId)
        .select();

      if (error) throw new Error(error.message);

      // Notify of changes
      if (onMetadataChange) {
        onMetadataChange();
      }

      return true;
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      return false;
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isUpdating,
    updateMetadataField
  };
};
