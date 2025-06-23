import type { BeamableCore } from '../core/BeamableCore';

/**
 * Response from GET /basic/content/manifest/public
 * See: https://docs.beamable.com/reference/get_basic-content-manifest-public
 */
export interface ContentManifestResponse {
  manifest: {
    id: string;
    checksum: string;
    created: string;
    updated: string;
    entries: ContentManifestEntry[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface ContentManifestEntry {
  id: string;
  type: string;
  uri: string;
  [key: string]: any;
}

export class ContentModule {
  private core: BeamableCore;
  constructor(core: BeamableCore) {
    this.core = core;
  }

  /**
   * Fetch the public content manifest
   * @see https://docs.beamable.com/reference/get_basic-content-manifest-public
   */
  async getPublicManifest(): Promise<ContentManifestResponse> {
    return this.core.request('GET', '/basic/content/manifest/public/json');
  }

  /**
   * Fetch content by ID and return it as the specified type
   * @param contentId The ID of the content to fetch
   * @returns The content object typed as T
   * @example
   * const abilityMap = await content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
   * const minion = await content.getContent<Minions>('Minions.GoblinBlue');
   */
  async getContent<T = any>(contentId: string): Promise<T> {
    // First get the manifest to find the content URI
    const manifest = await this.getPublicManifest();
    const entries = manifest.manifest?.entries || manifest.entries || [];
    
    // Find the entry with matching contentId
    const entry = entries.find(e => e.contentId === contentId || e.id === contentId);
    if (!entry) {
      throw new Error(`Content not found: ${contentId}`);
    }

    // Fetch the content from the URI
    const response = await fetch(entry.uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch content ${contentId}: ${response.statusText}`);
    }

    return response.json() as T;
  }

  /**
   * Get all content of a specific type
   * @param contentType The type of content to fetch (e.g., 'AbilityMaps', 'Minions')
   * @returns Array of content objects of the specified type
   * @example
   * const allAbilityMaps = await content.getContentByType<AbilityMaps>('AbilityMaps');
   * const allMinions = await content.getContentByType<Minions>('Minions');
   */
  async getContentByType<T = any>(contentType: string): Promise<T[]> {
    const manifest = await this.getPublicManifest();
    const entries = manifest.manifest?.entries || manifest.entries || [];
    
    // Filter entries by content type
    const typeEntries = entries.filter(e => {
      const contentId = e.contentId || e.id || '';
      return contentId.startsWith(`${contentType}.`);
    });

    if (typeEntries.length === 0) {
      return [];
    }

    // Fetch all content of this type
    const contentPromises = typeEntries.map(async (entry) => {
      const response = await fetch(entry.uri);
      if (!response.ok) {
        console.warn(`Failed to fetch content ${entry.contentId || entry.id}: ${response.statusText}`);
        return null;
      }
      return response.json() as T;
    });

    const results = await Promise.all(contentPromises);
    return results.filter(Boolean) as T[];
  }

  // TODO: Add content methods
} 