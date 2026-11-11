/**
 * AXIS ARCHITECTURE — Blueprint Source Integrity Checksum
 * 
 * Computes deterministic SHA-256 hash from file bytes for immutable source verification.
 */

/**
 * Calculates SHA-256 hex digest of a File or ArrayBuffer
 */
export async function computeSHA256(fileOrBuffer: File | ArrayBuffer): Promise<string> {
  const buffer =
    fileOrBuffer instanceof File
      ? await fileOrBuffer.arrayBuffer()
      : fileOrBuffer;

  // Use native Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digestBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(digestBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for non-subtle environments (e.g. Node script tests)
  const nodeCrypto = await import('crypto').catch(() => null);
  if (nodeCrypto) {
    return nodeCrypto
      .createHash('sha256')
      .update(Buffer.from(buffer))
      .digest('hex');
  }

  throw new Error('Cryptographic hashing engine unavailable in runtime environment');
}

/**
 * Shortens a 64-char SHA-256 hash for compact architectural UI display
 * e.g. "a81f9b3e...92c4d180"
 */
export function formatShortChecksum(hash: string, leadingChars = 6, trailingChars = 6): string {
  if (!hash || hash.length <= leadingChars + trailingChars) {
    return hash;
  }
  return `${hash.slice(0, leadingChars)}...${hash.slice(-trailingChars)}`;
}
