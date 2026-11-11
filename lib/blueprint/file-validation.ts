/**
 * AXIS ARCHITECTURE — Blueprint File Validation
 * 
 * Strict format and size validation for architectural blueprints.
 * Only accepts PDF, PNG, JPG, and JPEG up to 50 MB.
 */

export const MAX_BLUEPRINT_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'] as const;

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFilename: string;
  extension: string;
  mimeType: AllowedMimeType | string;
  sizeBytes: number;
  sizeFormatted: string;
}

/**
 * Formats file size in readable metric units (KB / MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Sanitizes a filename to prevent path traversal or unsafe characters.
 * Preserves standard base name and extension for display.
 */
export function sanitizeFilename(filename: string): string {
  // Strip path traversal sequences and illegal characters
  const clean = filename
    .replace(/^.*[\\\/]/, '')
    .replace(/[^\w\.\-\s\(\)]/gi, '_')
    .trim();
  return clean || 'unnamed_blueprint';
}

/**
 * Validates a file against allowed architectural blueprint criteria.
 */
export function validateBlueprintFile(file: File): FileValidationResult {
  const sanitizedFilename = sanitizeFilename(file.name);
  const sizeBytes = file.size;
  const sizeFormatted = formatFileSize(sizeBytes);

  // Extract lowercase extension
  const lastDot = sanitizedFilename.lastIndexOf('.');
  const extension = lastDot !== -1 ? sanitizedFilename.slice(lastDot).toLowerCase() : '';

  // 1. Check File Size (Max 50MB)
  if (sizeBytes > MAX_BLUEPRINT_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File exceeds the 50 MB limit (${sizeFormatted}). Please choose a smaller blueprint file.`,
      sanitizedFilename,
      extension,
      mimeType: file.type || 'unknown',
      sizeBytes,
      sizeFormatted,
    };
  }

  if (sizeBytes === 0) {
    return {
      isValid: false,
      error: 'The selected blueprint file is empty (0 bytes).',
      sanitizedFilename,
      extension,
      mimeType: file.type || 'unknown',
      sizeBytes,
      sizeFormatted,
    };
  }

  // 2. Check Extension
  const hasAllowedExt = ALLOWED_EXTENSIONS.includes(
    extension as (typeof ALLOWED_EXTENSIONS)[number]
  );

  // 3. Check MIME Type (when provided by browser)
  const hasAllowedMime =
    file.type === '' ||
    ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType);

  if (!hasAllowedExt || (!hasAllowedMime && file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format (${extension || file.type || 'unknown'}). Please upload a PDF, PNG, JPG, or JPEG blueprint.`,
      sanitizedFilename,
      extension,
      mimeType: file.type || 'unknown',
      sizeBytes,
      sizeFormatted,
    };
  }

  // Resolve normalized MIME
  let normalizedMime: string = file.type;
  if (!normalizedMime) {
    if (extension === '.pdf') normalizedMime = 'application/pdf';
    else if (extension === '.png') normalizedMime = 'image/png';
    else normalizedMime = 'image/jpeg';
  }

  return {
    isValid: true,
    sanitizedFilename,
    extension,
    mimeType: normalizedMime,
    sizeBytes,
    sizeFormatted,
  };
}
