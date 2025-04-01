
/**
 * Tag Type Definitions
 */

// Basic Tag interface
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
  type_name: string;
  color?: string; // Optional color field used in some components
}

// Tag with type information
export interface TagWithType extends Tag {
  type_name: string;
}

// For tag position updates
export interface TagPosition {
  id: string;
  displayOrder: number;
  name: string;
  typeId: string | null;
  position: number; // Used for reordering
}

// For tag grouping
export interface TagGroup {
  name: string;
  tags: Tag[];
}

// Helper functions
export const sortTagsByDisplayOrder = (tags: Tag[]): Tag[] => {
  return [...tags].sort((a, b) => a.display_order - b.display_order);
};

export const filterDuplicateTags = (tags: Tag[]): Tag[] => {
  const uniqueTags = new Map<string, Tag>();
  
  tags.forEach(tag => {
    if (!uniqueTags.has(tag.id)) {
      uniqueTags.set(tag.id, tag);
    }
  });
  
  return Array.from(uniqueTags.values());
};

// Conversion helpers
export const mapApiTagToTag = (apiTag: any): Tag => {
  return {
    id: apiTag.id,
    name: apiTag.name,
    content_id: apiTag.content_id,
    type_id: apiTag.type_id,
    display_order: apiTag.display_order || 0,
    type_name: apiTag.type_name || ""
  };
};

export const mapApiTagsToTags = (apiTags: any[]): Tag[] => {
  return apiTags.map(mapApiTagToTag);
};

export const ensureNonNullableTag = (tag: any): Tag => {
  return {
    id: tag.id || "",
    name: tag.name || "",
    content_id: tag.content_id || "",
    type_id: tag.type_id || null,
    display_order: tag.display_order || 0,
    type_name: tag.type_name || ""
  };
};

export const convertTagPositionsToTags = (positions: TagPosition[], existingTags: Tag[]): Tag[] => {
  return positions.map(pos => {
    const existingTag = existingTags.find(t => t.id === pos.id);
    return {
      id: pos.id,
      name: pos.name,
      content_id: existingTag?.content_id || "",
      type_id: pos.typeId,
      display_order: pos.position,
      type_name: existingTag?.type_name || ""
    };
  });
};
