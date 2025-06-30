import { describe, it, expect } from 'vitest';
import { BeamContext, configureBeamable } from '../src/core/BeamContext';
import type { StatsResponse } from '../src/modules/Stats';

const cid = process.env.VITE_CID || 'test-cid';
const pid = process.env.VITE_PID || 'test-pid';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

describe('StatsModule', () => {
  it('should set, get, and delete public and private stats for the current player', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.onReady;
    expect(context.playerId).toBeDefined();
    const playerId = context.playerId!;
    console.log('Player ID for stats test:', playerId);

    // Build objectIds
    const publicObjectId = context.Stats.constructor['buildPlayerObjectId'](playerId, 'client', 'public');
    const privateObjectId = context.Stats.constructor['buildPlayerObjectId'](playerId, 'client', 'private');

    // Set public stat
    const publicStatKey = 'test_public_stat';
    const publicStatValue = Math.floor(Math.random() * 10000);
    const setPublic: StatsResponse = await context.Stats.setStats(publicObjectId, { [publicStatKey]: publicStatValue });
    console.log('Set Public Stat Response:', setPublic);
    expect(setPublic).toBeDefined();

    // Get public stat
    const getPublic: StatsResponse = await context.Stats.getStats(publicObjectId);
    console.log('Get Public Stat Response:', getPublic);
    expect(getPublic).toBeDefined();
    expect(getPublic.stats).toHaveProperty(publicStatKey, publicStatValue);

    // Delete public stat
    const delPublic: StatsResponse = await context.Stats.deleteStats(publicObjectId, [publicStatKey]);
    console.log('Delete Public Stat Response:', delPublic);
    expect(delPublic).toBeDefined();

    // Set private stat
    const privateStatKey = 'test_private_stat';
    const privateStatValue = Math.floor(Math.random() * 10000);
    const setPrivate: StatsResponse = await context.Stats.setStats(privateObjectId, { [privateStatKey]: privateStatValue });
    console.log('Set Private Stat Response:', setPrivate);
    expect(setPrivate).toBeDefined();

    // Get private stat
    const getPrivate: StatsResponse = await context.Stats.getStats(privateObjectId);
    console.log('Get Private Stat Response:', getPrivate);
    expect(getPrivate).toBeDefined();
    expect(getPrivate.stats).toHaveProperty(privateStatKey, privateStatValue);

    // Delete private stat
    const delPrivate: StatsResponse = await context.Stats.deleteStats(privateObjectId, [privateStatKey]);
    console.log('Delete Private Stat Response:', delPrivate);
    expect(delPrivate).toBeDefined();
  });

  it('should set and get public and private player stats using the /client endpoints', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.onReady;
    expect(context.playerId).toBeDefined();
    const playerId = context.playerId!;
    console.log('Player ID for stats test:', playerId);

    // Build objectIds
    const publicObjectId = context.Stats.constructor['buildPlayerObjectId'](playerId, 'client', 'public');
    const privateObjectId = context.Stats.constructor['buildPlayerObjectId'](playerId, 'client', 'private');

    // Set public stat (client endpoint)
    const publicStatKey = 'alias';
    const publicStatValue = 'TestAlias';
    const setPublic: StatsResponse = await context.Stats.setPlayerStats(publicObjectId, { [publicStatKey]: publicStatValue });
    console.log('Set Public Stat (client) Response:', setPublic);
    expect(setPublic).toBeDefined();

    // Get public stat (client endpoint)
    const getPublic: StatsResponse = await context.Stats.getPlayerStats(publicObjectId);
    console.log('Get Public Stat (client) Response:', getPublic);
    expect(getPublic).toBeDefined();

    // Set private stat (client endpoint)
    const privateStatKey = 'alias';
    const privateStatValue = 'TestAlias';
    const setPrivate: StatsResponse = await context.Stats.setPlayerStats(privateObjectId, { [privateStatKey]: privateStatValue });
    console.log('Set Private Stat (client) Response:', setPrivate);
    expect(setPrivate).toBeDefined();

    // Get private stat (client endpoint)
    const getPrivate: StatsResponse = await context.Stats.getPlayerStats(privateObjectId);
    console.log('Get Private Stat (client) Response:', getPrivate);
    expect(getPrivate).toBeDefined();
  });

  it('should set and get a stat for game vs client domain using the /client endpoints', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.onReady;
    expect(context.playerId).toBeDefined();
    const playerId = context.playerId!;
    console.log('Player ID for game/client stats test:', playerId);

    // Build objectIds for client and game domains
    const clientObjectId = context.Stats.constructor['buildPlayerObjectId'](playerId, 'client', 'public');
    const gameObjectId = context.Stats.constructor['buildPlayerObjectId'](playerId, 'game', 'public');

    // Set and get stat for client domain
    const statKey = 'game_test_stat';
    const statValue = 'ClientDomainValue';
    const setClient: StatsResponse = await context.Stats.setPlayerStats(clientObjectId, { [statKey]: statValue });
    console.log('Set Stat (client domain) Response:', setClient);
    expect(setClient).toBeDefined();
    const getClient: StatsResponse = await context.Stats.getPlayerStats(clientObjectId);
    console.log('Get Stat (client domain) Response:', getClient);
    expect(getClient).toBeDefined();

    // Set and get stat for game domain
    const statValueGame = 'GameDomainValue';
    const setGame: StatsResponse = await context.Stats.setPlayerStats(gameObjectId, { [statKey]: statValueGame });
    console.log('Set Stat (game domain) Response:', setGame);
    expect(setGame).toBeDefined();
    const getGame: StatsResponse = await context.Stats.getPlayerStats(gameObjectId);
    console.log('Get Stat (game domain) Response:', getGame);
    expect(getGame).toBeDefined();
  });

  it.only('should set and increment a "wins" stat, verifying string storage', async () => {
    // Step 1: Get a playerId using client mode
    configureBeamable({ cid, pid, apiUrl });
    const clientContext = await BeamContext.Default;
    await clientContext.onReady;
    expect(clientContext.playerId).toBeDefined();
    const playerId = clientContext.playerId!;

    // Step 2: Switch to server mode
    const secret = process.env.VITE_SECRET || 'test-secret';
    configureBeamable({ cid, pid, apiUrl, secret, mode: 'server' });
    // Force BeamContext to re-instantiate with new config
    // @ts-ignore
    BeamContext._default = null;
    const serverContext = await BeamContext.Default;
    await serverContext.onReady;
    // Build public objectId for stats
    const publicObjectId = serverContext.Stats.constructor['buildPlayerObjectId'](playerId, 'client', 'public');

    const statKey = 'wins';

    // Set 'wins' to 1 (as number)
    console.log('Calling setStats (init wins=1)');
    const set1 = await serverContext.Stats.setStats(publicObjectId, { [statKey]: 1 }, playerId.toString());
    console.log('setStats result:', set1);
    expect(set1).toBeDefined();

    // Get and verify 'wins' is '1' (string or number)
    console.log('Calling getStats (expect wins=1)');
    const get1 = await serverContext.Stats.getStats(publicObjectId, playerId.toString());
    console.log('getStats result:', get1);
    expect(get1.stats).toBeDefined();
    expect(String(get1.stats[statKey])).toBe('1');

    // Increment 'wins' by 1
    console.log('Calling incrementStats (add wins+1)');
    let inc;
    try {
      inc = await serverContext.Stats.incrementStats(publicObjectId, { [statKey]: 1 }, playerId.toString());
      console.log('incrementStats result:', inc);
    } catch (e) {
      console.error('incrementStats error:', e);
      throw e;
    }
    expect(inc).toBeDefined();

    // Get and verify 'wins' is '2' (string or number)
    console.log('Calling getStats (expect wins=2)');
    let get2;
    try {
      get2 = await serverContext.Stats.getStats(publicObjectId, playerId.toString());
      console.log('getStats after increment result:', get2);
    } catch (e) {
      console.error('getStats after increment error:', e);
      throw e;
    }
    expect(get2.stats).toBeDefined();
    expect(String(get2.stats[statKey])).toBe('2');

    // Clean up: delete the 'wins' stat
    console.log('Calling deleteStats (cleanup)');
    await serverContext.Stats.deleteStats(publicObjectId, [statKey], playerId.toString());
    console.log('deleteStats done');
  });
}); 