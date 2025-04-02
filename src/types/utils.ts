
/**
 * Utility Types
 * 
 * Common utility types used throughout the application
 */

// Generic Type Utilities
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NullableOptional<T> = T | null | undefined;

export type IdType = string;
export type UUID = string;
export type ISODateString = string;

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Function Types
export type AsyncCallback<T = void> = () => Promise<T>;
export type ErrorCallback = (error: Error) => void;

// Status Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type FetchStatus = LoadingState;

// Event Handling Types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ChangeEvent<T = string> {
  target: {
    name?: string;
    value: T;
  };
}
