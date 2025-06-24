# BeamContext Pattern

The `BeamContext` is the central orchestrator of the Beamable JavaScript SDK. It manages authentication, session state, and provides unified access to all feature modules (Auth, Content, Inventory, Stats).

## 🚀 Purpose
- **Single entry point** for all SDK operations
- **Manages authentication** and player session
- **Exposes feature modules** as properties
- **Handles initialization and state** (e.g., playerId, onReady)

## 🏗️ How It Works

- `BeamContext.Default` is a singleton Promise that resolves to the default context for your app.
- On first access, it automatically authenticates (guest login if needed) and fetches player info.
- All modules (Auth, Content, Inventory, Stats) are available as properties.
- The `onReady` Promise resolves when the context is fully initialized.

## 🧑‍💻 Usage Example

```typescript
import { configureBeamable, BeamContext } from 'BeamableSDK';

// Configure the SDK (once at app startup)
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
const stats = await context.Stats.getClientStats(context.playerId!);
```

## 🔄 Lifecycle

1. **Configure**: Call `configureBeamable` with your credentials.
2. **Get Context**: Use `await BeamContext.Default` to get the singleton context.
3. **Ready**: Wait for `context.onReady` before making player-specific calls.
4. **Use Modules**: Access `context.Auth`, `context.Content`, `context.Inventory`, `context.Stats`.

## 📝 Best Practices
- Always call `configureBeamable` before accessing `BeamContext.Default`.
- Await `context.onReady` before using player-specific features.
- Use the singleton pattern (`BeamContext.Default`) for app-wide state.
- Use the exposed modules for all Beamable API calls.

## 🔒 State Management
- `playerId` is set after authentication.
- Tokens are managed internally by the context and core.
- The context automatically refreshes state after login or token refresh. 