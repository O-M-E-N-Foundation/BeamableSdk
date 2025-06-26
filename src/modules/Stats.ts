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
   * Get stats for a given objectId. Optionally impersonate a player in server mode by passing gamertag.
   */
  async getStats(objectId: string, gamertag?: string): Promise<StatsResponse> {
    return this.core.request('GET', `/object/stats/${objectId}/`, undefined, gamertag ? { auth: true, gamertag } : { auth: true });
  }

  /**
   * Set stats for a given objectId. Optionally impersonate a player in server mode by passing gamertag.
   */
  async setStats(objectId: string, stats: Record<string, any>, gamertag?: string): Promise<StatsResponse> {
    return this.core.request('POST', `/object/stats/${objectId}/`, stats, gamertag ? { auth: true, gamertag } : { auth: true });
  }

  /**
   * Delete stats for a given objectId. Optionally impersonate a player in server mode by passing gamertag.
   */
  async deleteStats(objectId: string, keys: string[], gamertag?: string): Promise<StatsResponse> {
    return this.core.request('DELETE', `/object/stats/${objectId}/`, { stats: keys }, gamertag ? { auth: true, gamertag } : { auth: true });
  }

  /**
   * Get player stats for a given objectId using the /client endpoint (browser/JS safe). Optionally impersonate a player in server mode by passing gamertag.
   */
  async getPlayerStats(objectId: string, gamertag?: string): Promise<StatsResponse> {
    return this.core.request('GET', `/object/stats/${objectId}/client`, undefined, gamertag ? { auth: true, gamertag } : { auth: true });
  }

  /**
   * Set player stats for a given objectId using the /client endpoint (browser/JS safe). Optionally impersonate a player in server mode by passing gamertag.
   */
  async setPlayerStats(objectId: string, stats: Record<string, any>, gamertag?: string): Promise<StatsResponse> {
    return this.core.request('POST', `/object/stats/${objectId}/client`, stats, gamertag ? { auth: true, gamertag } : { auth: true });
  }
} 