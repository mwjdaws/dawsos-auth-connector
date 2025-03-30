
/**
 * Date formatting utilities for the application
 */

/**
 * Formats a date as a relative time string (e.g., "2 hours ago")
 * 
 * @param date The date to format
 * @returns A human-readable string describing the relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Formats a date as a string in the format "MMM D, YYYY" (e.g., "Jan 1, 2023")
 * 
 * @param date The date to format
 * @returns A formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats a date as a string in the format "MMM D, YYYY, h:mm A" (e.g., "Jan 1, 2023, 12:00 PM")
 * 
 * @param date The date to format
 * @returns A formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
