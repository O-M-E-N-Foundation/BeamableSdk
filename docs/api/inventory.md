# Inventory Module API Reference

The Inventory module provides methods for reading player inventory and items. It supports both client and server (admin) modes.

> **Note:** Adding or removing items is only available in the Beamable Server SDK. The client SDK is read-only for inventory. In server mode, you can impersonate any player using the `gamertag` parameter.

## 🧑‍💻 Usage Examples

### Client Mode
```typescript
const inventory = await context.Inventory.getInventory(context.playerId!);
console.log(inventory.currencies, inventory.items);
```

### Server Mode (Admin/Backend)
```typescript
const playerId = '1234567890';
const inventory = await context.Inventory.getInventory(playerId, playerId); // gamertag = playerId
console.log('Server-side inventory:', inventory);
```

## 📋 API Methods

### `getInventory(playerId: string, gamertag?: string)`
Get the inventory for a player. In server mode, pass the playerId as the `gamertag` to impersonate any player.

**Returns:** `Promise<InventoryResponse>`

**Example:**
```typescript
// Client mode
const inventory = await context.Inventory.getInventory(context.playerId!);
// Server mode (impersonate)
const inventory = await context.Inventory.getInventory('1234567890', '1234567890');
``` 