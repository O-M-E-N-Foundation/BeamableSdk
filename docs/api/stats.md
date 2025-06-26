# Stats Module API Reference

The Stats module provides methods for managing player statistics and data. It supports both client and server (admin) modes.

> **Note:** The `/object/stats/{objectId}/` endpoint is only available in server mode. In server mode, you can impersonate any player using the `gamertag` parameter.

## 🧑‍💻 Usage Examples

### Client Mode
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!);
const stats = await context.Stats.getPlayerStats(objectId);
console.log(stats);
```

### Server Mode (Admin/Backend)
```typescript
const playerId = '1234567890';
const objectId = StatsModule.buildPlayerObjectId(playerId);
const stats = await context.Stats.getStats(objectId, playerId); // gamertag = playerId
console.log('Server-side stats:', stats);
```

## 📋 API Methods

### `buildPlayerObjectId(playerId: number | string, domain?: string, access?: string): string`
Helper to build a player stats objectId. Defaults: domain = 'client', access = 'public'.

**Example:**
```typescript
const objectId = StatsModule.buildPlayerObjectId(context.playerId!); // e.g., 'client.public.player.12345'
```

---

### `getStats(objectId: string, gamertag?: string)`
Get stats for a given objectId. In server mode, pass the playerId as the `gamertag` to impersonate any player.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
// Client mode
const stats = await context.Stats.getStats(objectId);
// Server mode (impersonate)
const stats = await context.Stats.getStats(objectId, '1234567890');
```

---

### `setStats(objectId: string, stats: Record<string, any>, gamertag?: string)`
Set stats for a given objectId. In server mode, pass the playerId as the `gamertag` to impersonate any player.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
// Client mode
await context.Stats.setStats(objectId, { score: 100, level: 5 });
// Server mode (impersonate)
await context.Stats.setStats(objectId, { score: 100, level: 5 }, '1234567890');
```

---

### `deleteStats(objectId: string, keys: string[], gamertag?: string)`
Delete specific stat keys for a given objectId. In server mode, pass the playerId as the `gamertag` to impersonate any player.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
// Client mode
await context.Stats.deleteStats(objectId, ['score', 'level']);
// Server mode (impersonate)
await context.Stats.deleteStats(objectId, ['score', 'level'], '1234567890');
```

---

### `getPlayerStats(objectId: string, gamertag?: string)`
Get player stats for a given objectId using the `/client` endpoint (browser/JS safe). In server mode, pass the playerId as the `gamertag` to impersonate any player.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
// Client mode
const stats = await context.Stats.getPlayerStats(objectId);
// Server mode (impersonate)
const stats = await context.Stats.getPlayerStats(objectId, '1234567890');
```

---

### `setPlayerStats(objectId: string, stats: Record<string, any>, gamertag?: string)`
Set player stats for a given objectId using the `/client` endpoint (browser/JS safe). In server mode, pass the playerId as the `gamertag` to impersonate any player.

**Returns:** `Promise<StatsResponse>`

**Example:**
```typescript
// Client mode
await context.Stats.setPlayerStats(objectId, { score: 200 });
// Server mode (impersonate)
await context.Stats.setPlayerStats(objectId, { score: 200 }, '1234567890');
``` 