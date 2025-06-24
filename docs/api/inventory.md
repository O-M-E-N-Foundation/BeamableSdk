# Inventory Module API Reference

The Inventory module provides methods for reading player inventory and items.

> **Note:** Adding or removing items is only available in the Beamable Server SDK. The client SDK is read-only for inventory.

## 📋 API Methods

### `getInventory(playerId: number)`
Get the inventory for a player.

**Returns:** `Promise<InventoryResponse>`

**Example:**
```typescript
const inventory = await context.Inventory.getInventory(context.playerId!);
console.log(inventory.currencies, inventory.items);
``` 