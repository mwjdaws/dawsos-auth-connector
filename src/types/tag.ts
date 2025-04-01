
/**
 * Tag data types
 */

// Basic tag structure
export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  display_order: number;
}

// Tag with additional display information
export interface TagWithTypeInfo extends Tag {
  type_name?: string;
  color?: string;
  icon?: string;
}

// Tag group structure
export interface TagGroup {
  content_id: string;
  type: string;
  tags: Tag[];
  color?: string;
  icon?: string;
}

// Tag data from API
export interface TagData {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  display_order: number;
}

// Tag display options
export interface TagDisplay {
  showCount?: boolean;
  clickable?: boolean;
  showDelete?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'outline';
}
