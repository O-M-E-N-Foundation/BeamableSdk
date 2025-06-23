import type { BeamableCore } from '../core/BeamableCore';

/**
 * Response from GET /object/inventory/{playerId}/
 * Contains the player's inventory items and currencies
 */
export interface InventoryResponse {
  currencies?: InventoryCurrency[];
  items?: InventoryItem[];
  [key: string]: any; // Allow for additional fields
}

/**
 * Represents a currency in the player's inventory
 */
export interface InventoryCurrency {
  id: string;
  amount: number;
  properties: any[];
  [key: string]: any; // Allow for additional fields
}

/**
 * Represents an item in the player's inventory
 */
export interface InventoryItem {
  id: string;
  proxyId?: string;
  amount?: number;
  properties?: Record<string, any>;
  [key: string]: any; // Allow for additional fields
}

export class InventoryModule {
  private core: BeamableCore;
  constructor(core: BeamableCore) {
    this.core = core;
  }

  /**
   * Get the inventory for a specific player
   * @param playerId The player's ID
   * @returns Promise<InventoryResponse> The player's inventory data
   */
  async getInventory(playerId: string): Promise<InventoryResponse> {
    return this.core.request('GET', `/object/inventory/${playerId}/`, undefined, { auth: true });
  }
  // Add more inventory methods as needed
} 