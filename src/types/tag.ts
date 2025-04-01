
/**
 * A tag associated with a piece of content
 */
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order?: number;
}

/**
 * Tag position for reordering
 */
export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Function to sort tags by their display order
 */
export function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => {
    const orderA = a.display_order ?? 0;
    const orderB = b.display_order ?? 0;
    return orderA - orderB;
  });
}
