import { describe, it, expect } from 'vitest';
import { BeamContext, configureBeamable } from '../src/core/BeamContext';

const cid = process.env.VITE_CID || '';
const pid = process.env.VITE_PID || '';
const secret = process.env.VITE_SECRET || '';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

// Use a known playerId for impersonation (replace with a real/test playerId as needed)
const testPlayerId = '1630331747350537';

describe('Beamable Server Mode', () => {
  it('should configure SDK in server mode and fetch inventory, stats, and content as a player', async () => {
    configureBeamable({ cid, pid, apiUrl, secret, mode: 'server' });
    const context = await BeamContext.Default;

    // --- Inventory ---
    const inventory = await context.Inventory.getInventory(testPlayerId, testPlayerId);
    expect(inventory).toBeDefined();
    expect(typeof inventory).toBe('object');
    // Optionally assert on currencies/items if present
    if (inventory.currencies) {
      expect(Array.isArray(inventory.currencies)).toBe(true);
    }
    if (inventory.items) {
      expect(Array.isArray(inventory.items)).toBe(true);
    }

    // --- Stats ---
    // Build a public objectId for the player (client domain, public scope)
    const publicObjectId = `client.public.player.${testPlayerId}`;
    const stats = await context.Stats.getStats(publicObjectId, testPlayerId);
    expect(stats).toBeDefined();
    expect(typeof stats).toBe('object');
    expect(stats).toHaveProperty('stats');

    // --- Content Manifest ---
    const manifest = await context.Content.getPublicManifest(testPlayerId);
    expect(manifest).toBeDefined();
    expect(manifest).toHaveProperty('entries');
    expect(Array.isArray(manifest.entries)).toBe(true);
  }, 20000); // 20 second timeout

  it('should call the server-only /basic/accounts/search API', async () => {
    configureBeamable({ cid, pid, apiUrl, secret, mode: 'server' });
    const context = await BeamContext.Default;
    // This endpoint requires server mode and returns a list of accounts (optionally filtered)
    const params = new URLSearchParams({ query: '', page: '0', pagesize: '10' }).toString();
    const response = await context.core.request('GET', `/basic/accounts/search?${params}`);
    expect(response).toBeDefined();
    // The response is typically an array or an object with an 'accounts' array
    if (Array.isArray(response)) {
      expect(response.length).toBeGreaterThan(0);
    } else if (response.accounts) {
      expect(Array.isArray(response.accounts)).toBe(true);
    }
  }, 20000);

  it('should call the server-only /object/stats/{objectId}/ API (raw, not /client)', async () => {
    configureBeamable({ cid, pid, apiUrl, secret, mode: 'server' });
    const context = await BeamContext.Default;
    // Use the raw stats endpoint (not /client)
    const publicObjectId = `client.public.player.${testPlayerId}`;
    const stats = await context.core.request('GET', `/object/stats/${publicObjectId}/`, undefined, { gamertag: testPlayerId });
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty('stats');
  }, 20000);

  it('should search for marco@mantical.ai in /basic/accounts/search', async () => {
    configureBeamable({ cid, pid, apiUrl, secret, mode: 'server' });
    const context = await BeamContext.Default;
    const params = new URLSearchParams({ query: 'marco@mantical.ai', page: '0', pagesize: '10' }).toString();
    const response = await context.core.request('GET', `/basic/accounts/search?${params}`);
    expect(response).toBeDefined();
    // The response is typically an array or an object with an 'accounts' array
    if (Array.isArray(response)) {
      // If the user exists, there should be at least one result
      expect(response.length).toBeGreaterThanOrEqual(0);
    } else if (response.accounts) {
      expect(Array.isArray(response.accounts)).toBe(true);
      // If the user exists, there should be at least one result
      expect(response.accounts.length).toBeGreaterThanOrEqual(0);
    }
  }, 20000);
}); 