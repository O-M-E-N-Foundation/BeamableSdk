import { describe, it, expect } from 'vitest';
import { BeamContext, configureBeamable } from '../src/core/BeamContext';
import type { InventoryResponse, InventoryCurrency } from '../src/modules/Inventory';

const cid = process.env.VITE_CID || 'test-cid';
const pid = process.env.VITE_PID || 'test-pid';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

describe('InventoryModule', () => {
  it('should get inventory for the current player', async () => {
    configureBeamable({ cid, pid, apiUrl });
    const context = await BeamContext.Default;
    await context.onReady;
    
    // Ensure we have a playerId
    expect(context.playerId).toBeDefined();
    expect(typeof context.playerId).toBe('number');
    
    // Get the player's inventory
    const inventory: InventoryResponse = await context.Inventory.getInventory(context.playerId!.toString());
    console.log('InventoryResponse:', inventory);
    
    expect(inventory).toBeDefined();
    expect(typeof inventory).toBe('object');
    
    // Assert on currencies if they exist
    if (inventory.currencies) {
      expect(Array.isArray(inventory.currencies)).toBe(true);
      inventory.currencies.forEach((currency: InventoryCurrency) => {
        expect(currency).toHaveProperty('id');
        expect(currency).toHaveProperty('amount');
        expect(currency).toHaveProperty('properties');
        expect(typeof currency.id).toBe('string');
        expect(typeof currency.amount).toBe('number');
        expect(Array.isArray(currency.properties)).toBe(true);
      });
    }
    
    // Assert on items if they exist
    if (inventory.items) {
      expect(Array.isArray(inventory.items)).toBe(true);
    }
  });
}); 