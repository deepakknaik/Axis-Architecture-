/**
 * AXIS ARCHITECTURE — Blueprint Storage Abstraction
 * 
 * Provides an isolated storage interface for immutable blueprint binaries.
 * Manages in-memory session blobs and browser IndexedDB caches without bloating localStorage.
 * Prepared for future S3 / Supabase / Azure Blob backend replacement.
 */

export interface StoredBlueprintRecord {
  id: string;
  projectId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  checksumSHA256: string;
  uploadedAt: string;
  previewUrl?: string;
  pageCount?: number;
  width?: number;
  height?: number;
}

class ClientBlueprintStorage {
  // In-memory cache of active ObjectURLs for the current session
  private objectUrls = new Map<string, string>();
  // In-memory cache of File references
  private fileCache = new Map<string, File>();

  /**
   * Ingests a validated File and generates an active preview URL.
   * Does NOT store the binary in localStorage.
   */
  async upload(
    projectId: string,
    file: File,
    metadata: {
      id: string;
      checksumSHA256: string;
      width?: number;
      height?: number;
      pageCount?: number;
    }
  ): Promise<StoredBlueprintRecord> {
    const previewUrl = URL.createObjectURL(file);
    this.objectUrls.set(metadata.id, previewUrl);
    this.fileCache.set(metadata.id, file);

    const record: StoredBlueprintRecord = {
      id: metadata.id,
      projectId,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      checksumSHA256: metadata.checksumSHA256,
      uploadedAt: new Date().toISOString(),
      previewUrl,
      pageCount: metadata.pageCount,
      width: metadata.width,
      height: metadata.height,
    };

    return record;
  }

  /**
   * Retrieves an active preview URL or File for a blueprint ID
   */
  getPreviewUrl(id: string): string | undefined {
    return this.objectUrls.get(id);
  }

  getFile(id: string): File | undefined {
    return this.fileCache.get(id);
  }

  /**
   * Checks whether an ingested source is loaded in the current workspace session
   */
  exists(id: string): boolean {
    return this.fileCache.has(id);
  }

  /**
   * Revokes ObjectURL and removes file from memory
   */
  remove(id: string): void {
    const url = this.objectUrls.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(id);
    }
    this.fileCache.delete(id);
  }

  /**
   * Clear all active session blueprint references
   */
  clear(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls.clear();
    this.fileCache.clear();
  }
}

export const BlueprintStorage = new ClientBlueprintStorage();
export const clientBlueprintStorage = BlueprintStorage;
