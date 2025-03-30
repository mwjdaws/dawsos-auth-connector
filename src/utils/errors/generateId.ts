
/**
 * Generate a random ID for errors
 * @returns A unique string ID
 */
export function generateErrorId(): string {
  return Math.random().toString(36).substring(2, 15);
}
