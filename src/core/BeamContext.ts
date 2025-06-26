import { AuthModule } from '../modules/Auth';
import { InventoryModule } from '../modules/Inventory';
import { StatsModule } from '../modules/Stats';
import { ContentModule } from '../modules/Content';
import { BeamableCore, BeamableConfig } from './BeamableCore';

/**
 * Configure the Beamable SDK globally.
 *
 * @param config - The configuration object. For server mode, pass { mode: 'server', secret: '...' } in addition to cid, pid, apiUrl, etc.
 * Example (client):
 *   configureBeamable({ cid, pid, apiUrl })
 * Example (server):
 *   configureBeamable({ cid, pid, apiUrl, secret, mode: 'server' })
 */
export function configureBeamable(config: BeamableConfig) {
  BeamableCore.configure(config);
}

export class BeamContext {
  static _default: Promise<BeamContext> | null = null;
  static get Default(): Promise<BeamContext> {
    if (!this._default) {
      this._default = BeamContext.createDefault();
    }
    return this._default;
  }

  private _onReadyResolver: (() => void) | null = null;
  public onReady: Promise<void>;
  public readonly Auth: AuthModule;
  public readonly Inventory: InventoryModule;
  public readonly Stats: StatsModule;
  public readonly Content: ContentModule;
  public readonly core: BeamableCore;
  public playerId: number | null = null; // Auto-populated after login

  private constructor(core: BeamableCore) {
    this.core = core;
    this.Auth = new AuthModule(core, this);
    this.Inventory = new InventoryModule(core);
    this.Stats = new StatsModule(core);
    this.Content = new ContentModule(core);
    this.onReady = new Promise((resolve) => {
      this._onReadyResolver = resolve;
    });
  }

  static async createDefault(): Promise<BeamContext> {
    const core = new BeamableCore(); // Uses global config
    const context = new BeamContext(core);
    // If in server mode, skip guest login and player info fetch
    if (core['config'].mode === 'server') {
      context._onReadyResolver?.();
      return context;
    }
    // If we already have an access token, fetch player info immediately
    if (core.getTokens().accessToken) {
      await context._fetchPlayerInfo();
      context._onReadyResolver?.();
    } else {
      // Otherwise, perform guest login and resolve when done
      await context.Auth.guestLogin();
      await context._fetchPlayerInfo();
      context._onReadyResolver?.();
    }
    return context;
  }

  /**
   * Fetch and store the current player's information (including playerId)
   * Called automatically after login
   */
  private async _fetchPlayerInfo(): Promise<void> {
    try {
      const account = await this.Auth.getCurrentAccount();
      this.playerId = account.id;
    } catch (error) {
      console.warn('Failed to fetch player info:', error);
      // Don't throw - we can still use the context without playerId
    }
  }

  // Called by AuthModule after a successful login
  async _resolveOnReady() {
    await this._fetchPlayerInfo();
    this._onReadyResolver?.();
  }
} 