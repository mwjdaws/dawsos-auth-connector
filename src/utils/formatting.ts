
/**
 * Formatting utilities for consistent display of data
 */

/**
 * Format a number as percentage
 */
export const formatPercentage = (value: number, multiplier = 100, digits = 0): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  const percentage = value * multiplier;
  return `${percentage.toFixed(digits)}%`;
};

/**
 * Format a date string for display
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

/**
 * Format a timestamp with date and time
 */
export const formatTimestamp = (timestamp: string | Date | null | undefined): string => {
  if (!timestamp) return 'N/A';
  
  const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid timestamp';
  }
  
  return dateObj.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
