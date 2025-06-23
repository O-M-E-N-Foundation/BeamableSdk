import { describe, it, expect } from 'vitest';
import { BeamContext, configureBeamable } from '../src/core/BeamContext';

const cid = process.env.VITE_CID || 'test-cid';
const pid = process.env.VITE_PID || 'test-pid';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

describe('BeamContext', () => {
  it('should resolve BeamContext.Default and onReady after configuration', async () => {
    configureBeamable({
      cid,
      pid,
      apiUrl,
    });
    const context = await BeamContext.Default;
    await context.onReady;
    expect(context).toBeInstanceOf(BeamContext);
    expect(context.Auth).toBeDefined();
    expect(context.Inventory).toBeDefined();
    expect(context.Stats).toBeDefined();
    expect(context.Content).toBeDefined();
  });
}); 