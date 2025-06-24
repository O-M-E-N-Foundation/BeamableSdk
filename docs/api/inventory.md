# Inventory Module API Reference

The Inventory module provides methods for managing player inventory and items.

## 📋 API Methods

### `getInventory(playerId: number)`
Get the inventory for a player.

**Returns:** `Promise<InventoryResponse>`

**Example:**
```typescript
const inventory = await context.Inventory.getInventory(context.playerId!);
console.log(inventory.currencies, inventory.items);
```

---

### `addItem(playerId: number, itemId: string, amount: number)`
Add an item to a player's inventory.

**Returns:** `Promise<void>`

**Example:**
```typescript
await context.Inventory.addItem(context.playerId!, 'item123', 1);
```

---

### `removeItem(playerId: number, itemId: string, amount: number)`
Remove an item from a player's inventory.

**Returns:** `Promise<void>`

**Example:**
```typescript
await context.Inventory.removeItem(context.playerId!, 'item123', 1);
``` 