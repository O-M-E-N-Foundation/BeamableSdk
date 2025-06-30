# Beamable JavaScript SDK

A modern, type-safe JavaScript/TypeScript SDK for Beamable, featuring modular architecture, comprehensive authentication, content management, and developer-friendly tooling. Supports both client and server (admin) use cases from a single SDK.

## 🚀 Features

- **🔐 Complete Authentication** - Guest, user, third-party, and device ID login
- **📦 Type-Safe Content API** - Generic content fetching with auto-generated types
- **🎯 Modular Architecture** - Clean separation of concerns with context pattern
- **🛠️ Developer Tools** - CLI for type generation and content management
- **✅ Comprehensive Testing** - Full test coverage with real API integration
- **📱 Modern JavaScript** - ESM/CJS compatible with TypeScript support
- **🛡️ Server/Admin Mode** - Signed requests, player impersonation, and admin APIs

## 📚 Documentation

### Getting Started
- [Installation & Setup](docs/installation.md) - Get up and running quickly
- [Quick Start Guide](docs/quickstart.md) - Your first Beamable integration
- [Configuration](docs/configuration.md) - Environment setup and options

### Core Concepts
- [Architecture Overview](docs/architecture.md) - Understanding the SDK structure
- [BeamContext Pattern](docs/beamcontext.md) - The unified context approach
- [Authentication Flow](docs/authentication.md) - Complete auth system guide

### API Reference
- [Auth Module](docs/api/auth.md) - User authentication and management
- [Content Module](docs/api/content.md) - Type-safe content fetching
- [Inventory Module](docs/api/inventory.md) - Player inventory management
- [Stats Module](docs/api/stats.md) - Player statistics and data

### Developer Tools
- [Type Generation CLI](docs/tools/type-generation.md) - Auto-generate content types
- [Testing Guide](docs/testing.md) - Running and writing tests
- [CLI Reference](docs/tools/cli.md) - Command-line tool documentation

### Advanced Topics
- [Content Type System](docs/advanced/content-types.md) - Understanding generated types
- [Error Handling](docs/advanced/error-handling.md) - Best practices for errors
- [Performance Optimization](docs/advanced/performance.md) - Tips for production use

### Examples & Tutorials
- [Basic Integration](docs/examples/basic-integration.md) - Simple game integration
- [Content Management](docs/examples/content-management.md) - Working with content
- [User Management](docs/examples/user-management.md) - User registration and login

## 🛠️ Quick Installation

```bash
npm install @omen.foundation/beamable-sdk
```

## 🔧 Type Generation

The SDK includes a CLI tool to automatically generate TypeScript types from your Beamable realm content:

```bash
# Generate types in your project's src/types/content/ directory
npx beamable generateTypes

# Or if you have the SDK installed locally
npm run generateTypes
```

**Setup:**
1. Create a `.env` file in your project root:
   ```env
   VITE_CID=your-customer-id
   VITE_PID=your-project-id
   VITE_API_URL=https://api.beamable.com
   # For server mode:
   VITE_SECRET=your-server-secret
   ```

2. Run the type generation tool:
   ```bash
   npx beamable generateTypes
   ```

3. Types will be generated in `src/types/content/` and can be imported in your code:
   ```typescript
   import type { AbilityMaps, Minions, Items } from './types/content';
   ```

**What it does:**
- Fetches your realm's content manifest from Beamable
- Downloads all content objects and groups them by type
- Generates TypeScript declaration files (`.d.ts`) for each content type
- Places them in your project's `src/types/content/` directory
- Cleans up obsolete type files automatically

## 🎯 Quick Example (Client & Server)

### Client Mode (Browser, Desktop, Mobile)
```typescript
import { BeamContext, configureBeamable } from '@omen.foundation/beamable-sdk';

// Configure the SDK (client mode)
configureBeamable({
  cid: 'your-customer-id',
  pid: 'your-project-id',
  apiUrl: 'https://api.beamable.com'
});

const context = await BeamContext.Default;
await context.onReady;

// Fetch type-safe content
const abilityMap = await context.Content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
const allMinions = await context.Content.getContentByType<Minions>('Minions');

console.log(`Ability: ${abilityMap.properties.actions.data[0].abilityName}`);
```

### 🛡️ Server Mode (Admin/Backend)
```typescript
import { BeamContext, configureBeamable } from '@omen.foundation/beamable-sdk';

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
const inventory = await context.Inventory.getInventory(playerId, playerId); // gamertag = playerId
const stats = await context.Stats.getStats(`client.public.player.${playerId}`, playerId);

// Call server-only/admin APIs
const params = new URLSearchParams({ query: 'marco@mantical.ai', page: '0', pagesize: '10' }).toString();
const accounts = await context.core.request('GET', `/basic/accounts/search?${params}`);
console.log('Accounts:', accounts);
```

**Security Note:**
- Never expose your server secret in client-side code.
- Use server mode only in trusted backend environments.

## 📦 Package Structure

```
src/
├── core/           # Core SDK functionality
│   ├── BeamableCore.ts
│   └── BeamContext.ts
├── modules/        # Feature modules
│   ├── Auth.ts
│   ├── Content.ts
│   ├── Inventory.ts
│   └── Stats.ts
├── types/          # Generated content types
│   └── content/
├── cli/            # Developer tools
│   ├── beamable.ts
│   └── generateTypes.ts
└── index.ts        # Main entry point
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm test auth
npm test content
npm test inventory
npm test stats

# Generate content types
npm run generateTypes
```

## 🤝 Contributing

See [Contributing Guide](docs/contributing.md) for development setup and guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Beamable Documentation](https://docs.beamable.com/)
- [API Reference](https://docs.beamable.com/reference)
- [Community Discord](https://discord.gg/beamable)

---

**Need help?** Check out our [Troubleshooting Guide](docs/troubleshooting.md) or [open an issue](https://github.com/your-org/beamable-javascript-sdk/issues).

## Advanced Usage: Manual Login Before Context

If you want to log in an existing user (and avoid creating a new guest user), you can use the AuthModule directly:

```ts
import { configureBeamable, BeamableCore, AuthModule, BeamContext } from '@omen.foundation/beamable-sdk';

configureBeamable({ cid, pid, apiUrl });
const core = new BeamableCore();
const auth = new AuthModule(core);
await auth.loginUser('user@email.com', 'password');
const context = await BeamContext.Default;
await context.onReady;
```

This pattern works for all login methods (username/password, third-party, etc.). 