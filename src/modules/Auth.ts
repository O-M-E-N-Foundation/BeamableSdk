import type { BeamableCore } from '../core/BeamableCore';
import type { BeamContext } from '../core/BeamContext';

export enum AuthThirdParty {
  Google = 'Google',
  Apple = 'Apple',
  Steam = 'Steam',
  Facebook = 'Facebook',
}

export interface AccountMeResponse {
  id: number;
  email: string;
  scopes: string[];
  thirdPartyAppAssociations: any[];
  deviceIds: any[];
  username?: string;
  created?: string;
  updated?: string;
  roles?: string[];
  [key: string]: any; // Allow for additional fields
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  [key: string]: any;
}

export interface RegisterUserResponse {
  id?: number;
  email?: string;
  [key: string]: any;
}

export interface IsEmailAvailableResponse {
  available: boolean;
  [key: string]: any;
}

/**
 * Response for removing a third-party association. Usually empty or status only.
 */
export interface RemoveThirdPartyAssociationResponse {
  success?: boolean;
  [key: string]: any;
}

/**
 * Data structure for federated identity (external) association.
 */
export interface ExternalIdentity {
  providerService: string;
  providerNamespace: string;
  userId: string;
}

/**
 * Options for updating the current account (PUT /basic/accounts/me).
 */
export interface UpdateAccountOptions {
  thirdParty?: string;
  token?: string;
  deviceId?: string;
  external?: ExternalIdentity[];
  gamerTagAssoc?: any;
  username?: string;
  country?: string;
  language?: string;
  [key: string]: any;
}

/**
 * Response for updating the account. Usually contains updated account info.
 */
export interface UpdateAccountResponse {
  success?: boolean;
  [key: string]: any;
}

export class AuthModule {
  private core: BeamableCore;
  private context?: BeamContext;
  constructor(core: BeamableCore, context?: BeamContext) {
    this.core = core;
    this.context = context;
  }

  /** Guest login (anonymous user) */
  async guestLogin(): Promise<void> {
    const response = await this.core.request('POST', '/basic/auth/token', { grant_type: 'guest' });
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
  }

  /** Username or email login. Optionally impersonate a player in server mode by passing gamertag. */
  async loginUser(usernameOrEmail: string, password: string, gamertag?: string): Promise<LoginResponse> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'password',
      username: usernameOrEmail,
      password,
    }, gamertag ? { gamertag } : undefined);
    this.core.setTokens(response.access_token, response.refresh_token);
    console.log('AuthModule.loginUser: setTokens called with', response.access_token, response.refresh_token);
    console.log('AuthModule.loginUser: core tokens after setTokens', this.core.getTokens());
    this.context?._resolveOnReady();
    return response;
  }

  /** Register a new user with username or email. Optionally impersonate a player in server mode by passing gamertag. */
  async registerUser(usernameOrEmail: string, password: string, gamertag?: string): Promise<RegisterUserResponse> {
    const response = await this.core.request('POST', '/basic/accounts/register', {
      email: usernameOrEmail,
      password,
    }, gamertag ? { auth: true, gamertag } : { auth: true });
    console.log('AuthModule.registerUser: response', response);
    console.log('AuthModule.registerUser: core tokens after register', this.core.getTokens());
    return response;
  }

  /** External identity login (Federated Login). Optionally impersonate a player in server mode by passing gamertag. */
  async loginWithExternal(providerService: string, providerNamespace: string, externalToken: string, gamertag?: string): Promise<any> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'external',
      provider_service: providerService,
      provider_namespace: providerNamespace,
      external_token: externalToken,
    }, gamertag ? { gamertag } : undefined);
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Device ID login (experimental). Optionally impersonate a player in server mode by passing gamertag. */
  async loginWithDeviceId(deviceId: string, gamertag?: string): Promise<LoginResponse> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'device',
      client_id: deviceId,
    }, gamertag ? { gamertag } : undefined);
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Refresh token. Optionally impersonate a player in server mode by passing gamertag. */
  async refreshToken(refreshToken: string, gamertag?: string): Promise<LoginResponse> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }, gamertag ? { gamertag } : undefined);
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Third-party login. Optionally impersonate a player in server mode by passing gamertag. */
  async loginWithThirdParty(thirdParty: AuthThirdParty, externalToken: string, gamertag?: string): Promise<any> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'third_party',
      third_party: thirdParty,
      external_token: externalToken,
    }, gamertag ? { gamertag } : undefined);
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Check if a third-party account is available. Optionally impersonate a player in server mode by passing gamertag. */
  async isThirdPartyAvailable(thirdParty: AuthThirdParty, externalToken: string, gamertag?: string): Promise<any> {
    const params = new URLSearchParams({
      third_party: thirdParty,
      external_token: externalToken,
    });
    return this.core.request('GET', `/basic/accounts/available/third-party?${params.toString()}`, undefined, gamertag ? { gamertag } : undefined);
  }

  /** Check if an email is available (not already registered). Optionally impersonate a player in server mode by passing gamertag. */
  async isEmailAvailable(email: string, gamertag?: string): Promise<IsEmailAvailableResponse> {
    const params = new URLSearchParams({ email });
    return this.core.request('GET', `/basic/accounts/available?${params.toString()}`, undefined, gamertag ? { gamertag } : undefined);
  }

  /** Initiate password update (reset) for a user. Optionally impersonate a player in server mode by passing gamertag. */
  async passwordUpdateInit(email: string, gamertag?: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/password-update/init', { email }, gamertag ? { gamertag } : undefined);
  }

  /** Confirm password update with code and new password. Optionally impersonate a player in server mode by passing gamertag. */
  async passwordUpdateConfirm(email: string, code: string, newPassword: string, gamertag?: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/password-update/confirm', {
      email,
      code,
      password: newPassword,
    }, gamertag ? { gamertag } : undefined);
  }

  /** Initiate email update for a user. Optionally impersonate a player in server mode by passing gamertag. */
  async emailUpdateInit(newEmail: string, gamertag?: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/email-update/init', { newEmail }, gamertag ? { gamertag } : undefined);
  }

  /** Confirm email update with code and password. Optionally impersonate a player in server mode by passing gamertag. */
  async emailUpdateConfirm(code: string, password: string, gamertag?: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/email-update/confirm', {
      code,
      password,
    }, gamertag ? { gamertag } : undefined);
  }

  /** Get the current account info for the logged-in user. Optionally impersonate a player in server mode by passing gamertag. */
  async getCurrentAccount(gamertag?: string): Promise<AccountMeResponse> {
    return this.core.request('GET', '/basic/accounts/me', undefined, gamertag ? { auth: true, gamertag } : { auth: true });
  }

  /** Remove a third-party association from the current account. Optionally impersonate a player in server mode by passing gamertag. */
  async removeThirdPartyAssociation(provider: AuthThirdParty, gamertag?: string): Promise<RemoveThirdPartyAssociationResponse> {
    return this.core.request('DELETE', '/basic/accounts/me/third-party', { provider }, gamertag ? { gamertag } : undefined);
  }

  /** Update the current account with new properties or credentials. Optionally impersonate a player in server mode by passing gamertag. */
  async updateAccount(options: UpdateAccountOptions, gamertag?: string): Promise<UpdateAccountResponse> {
    return this.core.request('PUT', '/basic/accounts/me', options, gamertag ? { auth: true, gamertag } : { auth: true });
  }

  /**
   * Register a third-party authentication credential to the current account.
   * @param thirdParty The third-party provider (e.g., 'google', 'apple', etc.)
   * @param token The auth token from the third-party provider
   */
  async registerThirdParty(thirdParty: string, token: string): Promise<UpdateAccountResponse> {
    return this.updateAccount({ thirdParty, token });
  }

  /**
   * Register a device ID authentication credential to the current account.
   * @param deviceId The device ID to associate
   */
  async registerDevice(deviceId: string): Promise<UpdateAccountResponse> {
    return this.updateAccount({ deviceId });
  }
} 