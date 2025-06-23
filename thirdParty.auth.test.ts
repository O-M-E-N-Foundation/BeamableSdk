import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { BeamContext, configureBeamable } from './src/core/BeamContext';
import type { UpdateAccountResponse } from './src/modules/Auth';

// Configure these for your environment
const cid = process.env.VITE_CID || 'test-cid';
const pid = process.env.VITE_PID || 'test-pid';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

// Google OAuth config (prefer VITE_ vars, fallback to defaults)
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_REDIRECT_URI = process.env.VITE_GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || 'http://localhost';
const GOOGLE_SCOPE = 'openid email profile';

// Helper to build the Google OAuth URL
function buildGoogleOAuthUrl() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'token',
    scope: GOOGLE_SCOPE,
    include_granted_scopes: 'true',
    state: 'beamable-test',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

test('registers Google third-party credential via interactive OAuth', async ({ browser }) => {
  configureBeamable({ cid, pid, apiUrl });
  const context = await BeamContext.Default;
  await context.Auth.guestLogin();

  // Open a new browser page for Google OAuth
  const page = await browser.newPage();
  const oauthUrl = buildGoogleOAuthUrl();
  console.log('\n\n*** Please complete Google login in the opened browser window. ***');
  await page.goto(oauthUrl);

  // Wait for redirect to our redirect URI with access_token in URL fragment
  await page.waitForURL(url => url.toString().startsWith(GOOGLE_REDIRECT_URI) && url.toString().includes('access_token'), { timeout: 120_000 });
  const redirectedUrl = page.url();
  // Extract access_token from URL fragment
  const fragment = redirectedUrl.split('#')[1];
  const params = new URLSearchParams(fragment);
  const googleToken = params.get('access_token');
  expect(googleToken).toBeTruthy();
  await page.close();

  // Now use the Google token to register third-party
  const response: UpdateAccountResponse = await context.Auth.registerThirdParty('google', googleToken!);
  expect(response).toBeDefined();
  // Optionally assert on response fields if known
  console.log('registerThirdParty response:', response);
}); 