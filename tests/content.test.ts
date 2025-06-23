import { describe, it, expect, beforeAll } from 'vitest';
import { BeamableCore } from '../src/core/BeamableCore';
import { ContentModule } from '../src/modules/Content';
import { BeamContext, configureBeamable } from '../src/core/BeamContext';

// Import the generated content types (using RootObject as the main interface)
import type { RootObject as AbilityMaps } from '../src/types/content/AbilityMaps';
import type { RootObject as Minions } from '../src/types/content/Minions';
import type { RootObject as Currency } from '../src/types/content/currency';
import type { RootObject as Items } from '../src/types/content/items';

const cid = process.env.VITE_CID || 'test-cid';
const pid = process.env.VITE_PID || 'test-pid';
const apiUrl = process.env.VITE_API_URL || 'https://api.beamable.com';

describe('Content Module', () => {
  let context: BeamContext;
  let content: ContentModule;

  beforeAll(async () => {
    // Configure Beamable first
    configureBeamable({ cid, pid, apiUrl });
    // Initialize the context - Default returns a Promise
    context = await BeamContext.Default;
    content = context.Content;
  });

  describe('getPublicManifest', () => {
    it('should fetch the public content manifest', async () => {
      const manifest = await content.getPublicManifest();
      
      expect(manifest).toBeDefined();
      expect(manifest).toHaveProperty('entries');
      expect(Array.isArray(manifest.entries)).toBe(true);
      expect(manifest.entries.length).toBeGreaterThan(0);
      
      // Check structure of first entry
      const firstEntry = manifest.entries[0];
      expect(firstEntry).toHaveProperty('contentId');
      expect(firstEntry).toHaveProperty('uri');
      
      console.log(`Found ${manifest.entries.length} content entries in manifest`);
      console.log(`First entry: ${firstEntry.contentId}`);
    });
  });

  describe('getContent - Generic Type Safety', () => {
    it('should fetch AbilityMaps content with proper typing', async () => {
      const abilityMap = await content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
      
      // TypeScript should enforce this structure
      expect(abilityMap).toBeDefined();
      expect(abilityMap).toHaveProperty('id');
      expect(abilityMap).toHaveProperty('version');
      expect(abilityMap).toHaveProperty('properties');
      
      // Check the specific AbilityMaps structure
      expect(abilityMap.properties).toHaveProperty('actions');
      expect(abilityMap.properties.actions).toHaveProperty('data');
      expect(Array.isArray(abilityMap.properties.actions.data)).toBe(true);
      
      console.log(`Fetched AbilityMap: ${abilityMap.id}`);
      console.log(`Ability name: ${abilityMap.properties.actions.data[0]?.abilityName}`);
    });

    it('should fetch Minions content with proper typing', async () => {
      const minion = await content.getContent<Minions>('Minions.GoblinBlue');
      
      expect(minion).toBeDefined();
      expect(minion).toHaveProperty('id');
      expect(minion).toHaveProperty('version');
      expect(minion).toHaveProperty('properties');
      
      console.log(`Fetched Minion: ${minion.id}`);
    });

    it('should fetch currency content with proper typing', async () => {
      const currencyItem = await content.getContent<Currency>('currency.WUF');
      
      expect(currencyItem).toBeDefined();
      expect(currencyItem).toHaveProperty('id');
      expect(currencyItem).toHaveProperty('version');
      expect(currencyItem).toHaveProperty('properties');
      
      console.log(`Fetched Currency: ${currencyItem.id}`);
    });

    it('should throw error for non-existent content', async () => {
      await expect(
        content.getContent('NonExistent.Content')
      ).rejects.toThrow('Content not found: NonExistent.Content');
    });
  });

  describe('getContentByType - Fetch All Content of a Type', () => {
    it('should fetch all AbilityMaps content', async () => {
      const allAbilityMaps = await content.getContentByType<AbilityMaps>('AbilityMaps');
      
      expect(Array.isArray(allAbilityMaps)).toBe(true);
      expect(allAbilityMaps.length).toBeGreaterThan(0);
      
      // All items should have the AbilityMaps structure
      allAbilityMaps.forEach(abilityMap => {
        expect(abilityMap).toHaveProperty('id');
        expect(abilityMap).toHaveProperty('properties');
        expect(abilityMap.properties).toHaveProperty('actions');
      });
      
      console.log(`Fetched ${allAbilityMaps.length} AbilityMaps`);
      console.log(`Sample AbilityMap IDs: ${allAbilityMaps.slice(0, 3).map(a => a.id).join(', ')}`);
    });

    it('should fetch all Minions content', async () => {
      const allMinions = await content.getContentByType<Minions>('Minions');
      
      expect(Array.isArray(allMinions)).toBe(true);
      expect(allMinions.length).toBeGreaterThan(0);
      
      // All items should have the Minions structure
      allMinions.forEach(minion => {
        expect(minion).toHaveProperty('id');
        expect(minion).toHaveProperty('properties');
      });
      
      console.log(`Fetched ${allMinions.length} Minions`);
      console.log(`Sample Minion IDs: ${allMinions.slice(0, 3).map(m => m.id).join(', ')}`);
    });

    it('should fetch all currency content', async () => {
      const allCurrencies = await content.getContentByType<Currency>('currency');
      
      expect(Array.isArray(allCurrencies)).toBe(true);
      expect(allCurrencies.length).toBeGreaterThan(0);
      
      // All items should have the currency structure
      allCurrencies.forEach(currencyItem => {
        expect(currencyItem).toHaveProperty('id');
        expect(currencyItem).toHaveProperty('properties');
      });
      
      console.log(`Fetched ${allCurrencies.length} Currencies`);
      console.log(`Currency IDs: ${allCurrencies.map(c => c.id).join(', ')}`);
    });

    it('should return empty array for non-existent content type', async () => {
      const nonExistent = await content.getContentByType('NonExistentType');
      expect(Array.isArray(nonExistent)).toBe(true);
      expect(nonExistent.length).toBe(0);
    });
  });

  describe('Type Safety and IntelliSense', () => {
    it('should provide proper TypeScript intellisense for AbilityMaps', async () => {
      // This test demonstrates that TypeScript provides proper intellisense
      const abilityMap = await content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
      
      // TypeScript should know about these properties
      const abilityName = abilityMap.properties.actions.data[0]?.abilityName;
      const isTaunt = abilityMap.properties.actions.data[0]?.isTaunt;
      
      expect(typeof abilityName).toBe('string');
      expect(typeof isTaunt).toBe('boolean');
      
      console.log(`Ability: ${abilityName}, Is Taunt: ${isTaunt}`);
    });

    it('should provide proper TypeScript intellisense for Minions', async () => {
      const minion = await content.getContent<Minions>('Minions.GoblinBlue');
      
      // TypeScript should know about Minions-specific properties
      // (Adjust these based on the actual Minions type structure)
      expect(minion.properties).toBeDefined();
      
      console.log(`Minion ID: ${minion.id}`);
    });
  });
}); 