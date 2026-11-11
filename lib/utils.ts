import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind CSS class names with clsx and twMerge.
 * Handles conflicts gracefully and supports conditional class objects.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as an architectural metric (e.g. millimeters, meters, feet)
 */
export function formatDimension(meters: number, unit: 'm' | 'mm' | 'ft' = 'm'): string {
  switch (unit) {
    case 'mm':
      return `${Math.round(meters * 1000)} mm`;
    case 'ft':
      return `${(meters * 3.28084).toFixed(2)} ft`;
    case 'm':
    default:
      return `${meters.toFixed(2)} m`;
  }
}

/**
 * Format timestamp into standard architectural project date format
 */
export function formatProjectDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}
