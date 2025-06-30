import CryptoJS from 'crypto-js';

export interface BeamableConfig {
  apiUrl: string;
  cid: string;
  pid: string;
  hash?: string;
  secret?: string; // For server mode
  mode?: 'client' | 'server'; // Defaults to client
}

export class BeamableCore {
  private static accessToken: string | null = null;
  private static refreshToken: string | null = null;
  private config: BeamableConfig;

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
    BeamableCore.accessToken = accessToken;
    if (refreshToken) BeamableCore.refreshToken = refreshToken;
  }

  getTokens() {
    return { accessToken: BeamableCore.accessToken, refreshToken: BeamableCore.refreshToken };
  }

  /**
   * Make a REST API call to Beamable. If microservice is true, route to the microservice endpoint.
   * @param method HTTP method
   * @param path API path (should start with /)
   * @param data Request body
   * @param opts Options: auth (boolean), microservice (boolean|string), gamertag (string)
   */
  async request(
    method: string,
    path: string,
    data?: any,
    opts: { auth?: boolean; microservice?: boolean | string; gamertag?: string } = {}
  ): Promise<any> {
    let url: string;
    if (opts.microservice) {
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
    // Add Authorization for client mode
    if (opts.auth && BeamableCore.accessToken && this.config.mode !== 'server') {
      headers['Authorization'] = `Bearer ${BeamableCore.accessToken}`;
    }
    // Server mode: sign the request
    if (this.config.mode === 'server' && this.config.secret) {
      const signature = this.calculateSignature(path, data, method);
      headers['X-BEAM-SIGNATURE'] = signature;
    }
    // Add gamertag if provided
    if (opts.gamertag) {
      headers['X-BEAM-GAMERTAG'] = opts.gamertag;
    }
    const fetchOpts: RequestInit = {
      method,
      headers,
      ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {}),
    };

    //console.log('fetchOpts', fetchOpts);

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
   * @param opts Options: auth (boolean), gamertag (string)
   */
  async requestMicroservice(
    method: string,
    msName: string,
    path: string,
    data?: any,
    opts: { auth?: boolean; gamertag?: string } = {}
  ): Promise<any> {
    return this.request(method, path, data, { ...opts, microservice: msName });
  }

  /**
   * Calculate the Beamable server signature for server mode requests.
   * @param uriPathAndQuery The API path (should start with /)
   * @param body The request body (object or undefined)
   */
  private calculateSignature(uriPathAndQuery: string, body?: object | null, method?: string): string {
    // Signature: Base64(MD5(secret + pid + version + uriPathAndQuery + (body as JSON)))
    // For DELETE requests, omit the body from the signature even if present
    const version = '1';
    let dataToSign = `${this.config.secret}${this.config.pid}${version}${uriPathAndQuery}`;
    if (body && method !== 'DELETE') dataToSign += JSON.stringify(body);
    const md5 = CryptoJS.MD5(dataToSign);
    return CryptoJS.enc.Base64.stringify(md5);
  }
} 