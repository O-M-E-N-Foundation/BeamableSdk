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

  /** Username or email login */
  async loginUser(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'password',
      username: usernameOrEmail,
      password,
    });
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Register a new user with username or email */
  async registerUser(usernameOrEmail: string, password: string): Promise<RegisterUserResponse> {
    const response = await this.core.request('POST', '/basic/accounts/register', {
      email: usernameOrEmail,
      password,
    }, { auth: true });
    return response;
  }

  /** External identity login (Federated Login) */
  async loginWithExternal(providerService: string, providerNamespace: string, externalToken: string): Promise<any> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'external',
      provider_service: providerService,
      provider_namespace: providerNamespace,
      external_token: externalToken,
    });
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Device ID login (experimental: using grant_type 'device' and client_id field) */
  async loginWithDeviceId(deviceId: string): Promise<LoginResponse> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'device',
      client_id: deviceId,
    });
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Refresh token */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Third-party login (Google, Apple, Steam, Facebook) */
  async loginWithThirdParty(thirdParty: AuthThirdParty, externalToken: string): Promise<any> {
    const response = await this.core.request('POST', '/basic/auth/token', {
      grant_type: 'third_party',
      third_party: thirdParty,
      external_token: externalToken,
    });
    this.core.setTokens(response.access_token, response.refresh_token);
    this.context?._resolveOnReady();
    return response;
  }

  /** Check if a third-party account is available */
  async isThirdPartyAvailable(thirdParty: AuthThirdParty, externalToken: string): Promise<any> {
    const params = new URLSearchParams({
      third_party: thirdParty,
      external_token: externalToken,
    });
    return this.core.request('GET', `/basic/accounts/available/third-party?${params.toString()}`);
  }

  /** Check if an email is available (not already registered) */
  async isEmailAvailable(email: string): Promise<IsEmailAvailableResponse> {
    const params = new URLSearchParams({ email });
    return this.core.request('GET', `/basic/accounts/available?${params.toString()}`);
  }

  /**
   * Initiate password update (reset) for a user. Sends a code to the user's email.
   * @param email The user's email address
   */
  async passwordUpdateInit(email: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/password-update/init', { email });
  }

  /**
   * Confirm password update with code and new password.
   * @param email The user's email address
   * @param code The code sent to the user's email
   * @param newPassword The new password to set
   */
  async passwordUpdateConfirm(email: string, code: string, newPassword: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/password-update/confirm', {
      email,
      code,
      password: newPassword,
    });
  }

  /**
   * Initiate email update for a user. Sends a code to the new email address.
   * @param newEmail The new email address
   */
  async emailUpdateInit(newEmail: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/email-update/init', { newEmail });
  }

  /**
   * Confirm email update with code and password.
   * @param code The code sent to the new email
   * @param password The user's current password
   */
  async emailUpdateConfirm(code: string, password: string): Promise<any> {
    return this.core.request('POST', '/basic/accounts/email-update/confirm', {
      code,
      password,
    });
  }

  /**
   * Get the current account info for the logged-in user.
   */
  async getCurrentAccount(): Promise<AccountMeResponse> {
    return this.core.request('GET', '/basic/accounts/me', undefined, { auth: true });
  }

  /**
   * Remove a third-party association from the current account.
   * Not testable in CI unless a third-party is linked.
   * @param provider The third-party provider to remove (e.g., 'Google', 'Apple', etc.)
   */
  async removeThirdPartyAssociation(provider: AuthThirdParty): Promise<RemoveThirdPartyAssociationResponse> {
    // The API may require a body or query param; here we send provider in the body for clarity.
    return this.core.request('DELETE', '/basic/accounts/me/third-party', { provider });
  }

  /**
   * Update the current account with new properties or credentials.
   * See https://docs.beamable.com/reference/put_basic-accounts-me
   */
  async updateAccount(options: UpdateAccountOptions): Promise<UpdateAccountResponse> {
    return this.core.request('PUT', '/basic/accounts/me', options, { auth: true });
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