# Stats Module API Reference

The Stats module provides methods for managing player statistics and data.

## 📋 API Methods

### `buildPlayerObjectId(playerId: number | string, domain?: string, access?: string): string`
Helper to build a player stats objectId. Defaults: domain = 'client', access = 'public'.

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!); // e.g., 'client.public.player.12345'
```

---

### `getStats(objectId: string)`
Get stats for a given objectId.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!);
const stats = await context.Stats.getStats(objectId);
console.log(stats);
```

---

### `setStats(objectId: string, stats: Record<string, any>)`
Set stats for a given objectId.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!);
await context.Stats.setStats(objectId, { score: 100, level: 5 });
```

---

### `deleteStats(objectId: string, keys: string[])`
Delete specific stat keys for a given objectId.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!);
await context.Stats.deleteStats(objectId, ['score', 'level']);
```

---

### `getPlayerStats(objectId: string)`
Get player stats for a given objectId using the `/client` endpoint (browser/JS safe).

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!);
const stats = await context.Stats.getPlayerStats(objectId);
console.log(stats);
```

---

### `setPlayerStats(objectId: string, stats: Record<string, any>)`
Set player stats for a given objectId using the `/client` endpoint (browser/JS safe).

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!);
await context.Stats.setPlayerStats(objectId, { score: 200 });
``` 