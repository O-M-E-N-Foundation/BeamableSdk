import type { BeamableCore } from '../core/BeamableCore';

/**
 * Response from stats endpoints (GET/POST/DELETE /object/stats/{objectId}/)
 */
export interface StatsResponse {
  stats?: Record<string, any>;
  [key: string]: any;
}

export class StatsModule {
  private core: BeamableCore;
  constructor(core: BeamableCore) {
    this.core = core;
  }

  /**
   * Helper to build a player stats objectId
   * @param playerId The player's ID
   * @param domain 'client' or 'game' (default: 'client')
   * @param access 'public' or 'private' (default: 'public')
   */
  static buildPlayerObjectId(playerId: number | string, domain: string = 'client', access: string = 'public'): string {
    return `${domain}.${access}.player.${playerId}`;
  }

  /**
   * Get stats for a given objectId
   */
  async getStats(objectId: string): Promise<StatsResponse> {
    return this.core.request('GET', `/object/stats/${objectId}/`, undefined, { auth: true });
  }

  /**
   * Set stats for a given objectId
   * @param objectId The stats objectId
   * @param stats The stats to set (key-value pairs)
   */
  async setStats(objectId: string, stats: Record<string, any>): Promise<StatsResponse> {
    return this.core.request('POST', `/object/stats/${objectId}/`, stats, { auth: true });
  }

  /**
   * Delete stats for a given objectId
   * @param objectId The stats objectId
   * @param keys The stat keys to delete
   */
  async deleteStats(objectId: string, keys: string[]): Promise<StatsResponse> {
    return this.core.request('DELETE', `/object/stats/${objectId}/`, { stats: keys }, { auth: true });
  }

  /**
   * Get player stats for a given objectId using the /client endpoint (browser/JS safe)
   * @see https://docs.beamable.com/reference/get_object-stats-objectid-client
   */
  async getPlayerStats(objectId: string): Promise<StatsResponse> {
    return this.core.request('GET', `/object/stats/${objectId}/client`, undefined, { auth: true });
  }

  /**
   * Set player stats for a given objectId using the /client endpoint (browser/JS safe)
   * @see https://docs.beamable.com/reference/post_object-stats-objectid-client
   */
  async setPlayerStats(objectId: string, stats: Record<string, any>): Promise<StatsResponse> {
    return this.core.request('POST', `/object/stats/${objectId}/client`, stats, { auth: true });
  }
} 