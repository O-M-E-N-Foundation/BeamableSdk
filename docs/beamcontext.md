# BeamContext Pattern

The `BeamContext` is the central orchestrator of the Beamable JavaScript SDK. It manages authentication, session state, and provides unified access to all feature modules (Auth, Content, Inventory, Stats).

## 🚀 Purpose
- **Single entry point** for all SDK operations
- **Manages authentication** and player session
- **Exposes feature modules** as properties
- **Handles initialization and state** (e.g., playerId, onReady)
- **Supports both client and server (admin) modes**

## 🏕️ How It Works

- `BeamContext.Default` is a singleton Promise that resolves to the default context for your app.
- On first access, it automatically authenticates (guest login if needed, unless in server mode) and fetches player info.
- All modules (Auth, Content, Inventory, Stats) are available as properties.
- The `onReady` Promise resolves when the context is fully initialized.
- In **server mode**, guest login and player info fetch are skipped, and all API calls can impersonate any player using the `gamertag` parameter.

## 👩‍💻 Usage Example

### Client Mode
```typescript
import { configureBeamable, BeamContext } from 'BeamableSDK';

// Configure the SDK (client mode)
configureBeamable({
  cid: 'your-customer-id',
  pid: 'your-project-id',
  apiUrl: 'https://api.beamable.com'
});

// Get the default context (singleton)
const context = await BeamContext.Default;
await context.onReady;

// Access modules
await context.Auth.guestLogin();
const manifest = await context.Content.getPublicManifest();
const inventory = await context.Inventory.getInventory(context.playerId!);
const stats = await context.Stats.getPlayerStats(context.playerId!);
```

### Server Mode (Admin/Backend)
```typescript
import { configureBeamable, BeamContext } from 'BeamableSDK';

configureBeamable({
  cid: process.env.VITE_CID!,
  pid: process.env.VITE_PID!,
  apiUrl: process.env.VITE_API_URL || 'https://api.beamable.com',
  secret: process.env.VITE_SECRET!,
  mode: 'server'
});
const context = await BeamContext.Default;

// Impersonate any player using gamertag
const playerId = '1234567890';
const inventory = await context.Inventory.getInventory(playerId, playerId);
const stats = await context.Stats.getStats(`client.public.player.${playerId}`, playerId);
```

## 🔄 Lifecycle

1. **Configure**: Call `configureBeamable` with your credentials (and secret/mode for server mode).
2. **Get Context**: Use `await BeamContext.Default` to get the singleton context.
3. **Ready**: Wait for `context.onReady` before making player-specific calls (client mode only).
4. **Use Modules**: Access `context.Auth`, `context.Content`, `context.Inventory`, `context.Stats`.

## 📝 Best Practices
- Always call `configureBeamable` before accessing `BeamContext.Default`.
- Await `context.onReady` before using player-specific features (client mode).
- Use the singleton pattern (`BeamContext.Default`) for app-wide state.
- Use the exposed modules for all Beamable API calls.
- In server mode, use the `gamertag` parameter to impersonate any player.

## 🔒 State Management
- `playerId` is set after authentication (client mode).
- Tokens are managed internally by the context and core.
- The context automatically refreshes state after login or token refresh (client mode).
- In server mode, tokens are not used; requests are signed with your secret key.

## 🔄 Additional Notes
- **Server Mode**: This mode is designed for backend operations where you might want to impersonate a player.
- **Gamertag**: In server mode, you can use the `gamertag` parameter to impersonate any player.
- **Tokens**: In client mode, tokens are used for authentication and state management.
- **State Management**: The context automatically refreshes state after login or token refresh.
- **API Calls**: All API calls are made through the context, ensuring consistent access to all modules. 