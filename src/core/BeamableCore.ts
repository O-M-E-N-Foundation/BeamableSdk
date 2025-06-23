export interface BeamableConfig {
  apiUrl: string;
  cid: string;
  pid: string;
  hash?: string;
}

export class BeamableCore {
  private config: BeamableConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  static _globalConfig: BeamableConfig | null = null;

  static configure(config: BeamableConfig) {
    this._globalConfig = config;
  }

  static get globalConfig(): BeamableConfig {
    if (!this._globalConfig) {
      throw new Error('BeamableCore is not configured. Call configureBeamable({ cid, pid, apiUrl }) before using the SDK.');
    }
    return this._globalConfig;
  }

  constructor(config?: BeamableConfig) {
    this.config = config || BeamableCore.globalConfig;
  }

  setTokens(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  getTokens() {
    return { accessToken: this.accessToken, refreshToken: this.refreshToken };
  }

  /**
   * Make a REST API call to Beamable. If microservice is true, route to the microservice endpoint.
   * @param method HTTP method
   * @param path API path (should start with /)
   * @param data Request body
   * @param opts Options: auth (boolean), microservice (boolean|string)
   */
  async request(method: string, path: string, data?: any, opts: { auth?: boolean, microservice?: boolean | string } = {}): Promise<any> {
    let url: string;
    if (opts.microservice) {
      // If a string is provided, use it as the microservice name; otherwise use CoreService
      const hash = this.config.hash || '';
      const msName = typeof opts.microservice === 'string' ? opts.microservice : 'CoreService';
      const msSlug = `/basic/${this.config.cid}.${this.config.pid}.${hash}micro_${msName}`;
      url = `${this.config.apiUrl}${msSlug}${path}`;
    } else {
      url = `${this.config.apiUrl}${path}`;
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-BEAM-SCOPE': `${this.config.cid}.${this.config.pid}`,
    };
    if (opts.auth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    const fetchOpts: RequestInit = {
      method,
      headers,
      ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {}),
    };
    const response = await fetch(url, fetchOpts);
    if (!response.ok) {
      let error;
      try { error = await response.json(); } catch { error = { status: response.status }; }
      throw error;
    }
    return response.json();
  }

  /**
   * Make a REST API call to a specific microservice.
   * @param method HTTP method
   * @param msName Microservice name (e.g., 'CoreService')
   * @param path API path (should start with /)
   * @param data Request body
   * @param opts Options: auth (boolean)
   */
  async requestMicroservice(method: string, msName: string, path: string, data?: any, opts: { auth?: boolean } = {}): Promise<any> {
    return this.request(method, path, data, { ...opts, microservice: msName });
  }
} 