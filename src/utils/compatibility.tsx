
/**
 * Utility functions for type compatibility and conversions
 */
import React from 'react';

/**
 * Ensures a value is a string
 * 
 * @param value The value to check/convert
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a string, or the default value
 */
export function ensureString(value: unknown, defaultValue: string = ''): string {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return String(value);
}

/**
 * Ensures a value is a number
 * 
 * @param value The value to check/convert
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a number, or the default value
 */
export function ensureNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Ensures a value is a boolean
 * 
 * @param value The value to check/convert
 * @param defaultValue Optional default value if conversion fails
 * @returns The value as a boolean, or the default value
 */
export function ensureBoolean(value: unknown, defaultValue: boolean = false): boolean {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  
  if (typeof value === 'number') {
    return value !== 0;
  }
  
  return defaultValue;
}

/**
 * Safely calls a callback function
 * 
 * @param callback The callback function to call
 * @param args Arguments to pass to the callback
 * @returns The result of the callback, or undefined if the callback is not a function
 */
export function safeCallback<T extends (...args: any[]) => any>(
  callback: T | null | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (typeof callback === 'function') {
    return callback(...args);
  }
  return undefined;
}

/**
 * Creates a no-op function that can be used as a safe default
 * 
 * @returns A function that does nothing
 */
export function noOp(): () => void {
  return () => {};
}

/**
 * Safe JSX wrapper for potentially undefined/null children
 */
export function SafeRender({ children }: { children: React.ReactNode }): JSX.Element | null {
  return children ? <>{children}</> : null;
}
