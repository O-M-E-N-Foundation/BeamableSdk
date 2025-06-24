# Stats Module API Reference

The Stats module provides methods for managing player statistics and data.

## 📋 API Methods

### `getClientStats(playerId: number)`
Get statistics for a player.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
const stats = await context.Stats.getClientStats(context.playerId!);
console.log(stats);
```

---

### `setClientStats(playerId: number, stats: Record<string, any>)`
Set statistics for a player.

**Returns:** `Promise<void>`

**Example:**
```typescript
await context.Stats.setClientStats(context.playerId!, { score: 100, level: 5 });
``` 