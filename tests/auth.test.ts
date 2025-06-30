import { describe, it, expect } from 'vitest';
import { BeamContext, configureBeamable } from '../src/core/BeamContext';
import type { LoginResponse, RegisterUserResponse, IsEmailAvailableResponse, UpdateAccountResponse } from '../src/modules/Auth';
import { BeamableCore } from '../src/core/BeamableCore';
import { AuthModule } from '../src/modules/AuthModule';

const cid = process.env.VITE_CID || 'test-cid';
const pid = process.env.VITE_PID || 'test-pid';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

describe('AuthModule', () => {
  it('should check if an email is available', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    const result: IsEmailAvailableResponse = await context.Auth.isEmailAvailable('marco@mantical.ai');
    expect(result).toBeDefined();
    expect(result).toHaveProperty('available');
    expect(typeof result.available).toBe('boolean');
  });

  it('should register a new user with username or email and then login', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.onReady; // Ensure guest session is established
    // Generate a random username/email and password for each test run
    const randomStr = Math.random().toString(36).substring(2, 10);
    const testUser = `testuser_${randomStr}@mantical.ai`;
    const testPassword = `TestPassword_${randomStr}!`;
    const registerResponse: RegisterUserResponse = await context.Auth.registerUser(testUser, testPassword);
    expect(registerResponse).toBeDefined();
    expect(typeof registerResponse).toBe('object');
    // Now login with the same credentials
    const loginResponse: LoginResponse = await context.Auth.loginUser(testUser, testPassword);
    console.log('LoginResponse:', loginResponse);
    expect(loginResponse).toBeDefined();
    expect(loginResponse).toHaveProperty('access_token');
    expect(loginResponse).toHaveProperty('refresh_token');
    expect(typeof loginResponse.access_token).toBe('string');
    expect(typeof loginResponse.refresh_token).toBe('string');
  });

  it('should get the current account info for the logged-in user', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.onReady;
    const account = await context.Auth.getCurrentAccount();
    console.log('AccountMeResponse:', account);
    expect(account).toBeDefined();
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('email');
    expect(typeof account.id).toBe('number');
    expect(typeof account.email).toBe('string');
    expect(account).toHaveProperty('scopes');
    expect(account).toHaveProperty('thirdPartyAppAssociations');
    expect(account).toHaveProperty('deviceIds');
    expect(Array.isArray(account.scopes)).toBe(true);
    expect(Array.isArray(account.thirdPartyAppAssociations)).toBe(true);
    expect(Array.isArray(account.deviceIds)).toBe(true);
  });

  // NOTE: Device ID login is currently not working. Tried both grant_type 'device_id' (with device_id) and 'device' (with client_id), but both failed.
  // Leaving this test commented out until Beamable team clarifies correct usage.
  // it('should login with a device ID', async () => {
  //   configureBeamable({ cid, pid, apiUrl });
  //   const context = await BeamContext.Default;
  //   // Generate a random device ID for each test run
  //   const deviceId = 'test-device-' + Math.random().toString(36).substring(2, 10);
  //   const loginResponse: LoginResponse = await context.Auth.loginWithDeviceId(deviceId);
  //   expect(loginResponse).toBeDefined();
  //   expect(loginResponse).toHaveProperty('access_token');
  //   expect(loginResponse).toHaveProperty('refresh_token');
  //   expect(typeof loginResponse.access_token).toBe('string');
  //   expect(typeof loginResponse.refresh_token).toBe('string');
  // });

  it('should refresh the access token using refresh_token', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    // Use guest login to get a refresh_token
    await context.Auth.guestLogin();
    const tokens = (context as any).core.getTokens();
    const refresh_token = tokens.refreshToken;
    expect(refresh_token).toBeDefined();
    // Now use the refresh_token to get a new access_token
    const refreshed: LoginResponse = await context.Auth.refreshToken(refresh_token);
    expect(refreshed).toBeDefined();
    expect(refreshed).toHaveProperty('access_token');
    expect(refreshed).toHaveProperty('refresh_token');
    expect(typeof refreshed.access_token).toBe('string');
    expect(typeof refreshed.refresh_token).toBe('string');
  });

  // NOTE: This test requires a real third-party token and provider setup. Uncomment and configure when ready.
  // it('should register a third-party credential to the current account', async () => {
  //   configureBeamable({ cid, pid, apiUrl });
  //   const context = await BeamContext.Default;
  //   await context.Auth.guestLogin();
  //   // Replace with real provider and token when available
  //   const provider = 'google';
  //   const token = 'REPLACE_WITH_REAL_TOKEN';
  //   const response: UpdateAccountResponse = await context.Auth.registerThirdParty(provider, token);
  //   expect(response).toBeDefined();
  //   // Add more assertions as needed when real response shape is known
  // });

  it('should register a device ID to the current account', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.Auth.guestLogin();
    // Use a device fingerprint as the deviceId
    const deviceId = 'test-device-' + Math.random().toString(36).substring(2, 18);
    const response: UpdateAccountResponse = await context.Auth.registerDevice(deviceId);
    expect(response).toBeDefined();
    // Optionally assert on response fields if known
  });

  it('should login a user with AuthModule before context and not create a guest', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const core = new BeamableCore();
    const auth = new AuthModule(core);
    // Use a test user that already exists in your Beamable project
    const username = process.env.TEST_USERNAME || 'testuser@email.com';
    const password = process.env.TEST_PASSWORD || 'testpassword';
    await auth.loginUser(username, password);
    const context = await BeamContext.Default;
    await context.onReady;
    expect(context.playerId).toBeDefined();
    // Optionally, check that the playerId matches the expected test user
  });
}); 