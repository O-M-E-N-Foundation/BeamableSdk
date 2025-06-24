# Beamable JavaScript SDK

A modern, type-safe JavaScript/TypeScript SDK for Beamable, featuring modular architecture, comprehensive authentication, content management, and developer-friendly tooling.

## 🚀 Features

- **🔐 Complete Authentication** - Guest, user, third-party, and device ID login
- **📦 Type-Safe Content API** - Generic content fetching with auto-generated types
- **🎯 Modular Architecture** - Clean separation of concerns with context pattern
- **🛠️ Developer Tools** - CLI for type generation and content management
- **✅ Comprehensive Testing** - Full test coverage with real API integration
- **📱 Modern JavaScript** - ESM/CJS compatible with TypeScript support

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
npm install BeamableSDK
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

## 🎯 Quick Example

```typescript
import { BeamContext, configureBeamable } from 'BeamableSDK';

// Configure the SDK
configureBeamable({
  cid: 'your-customer-id',
  pid: 'your-project-id',
  apiUrl: 'https://api.beamable.com'
});

// Get the context and authenticate
const context = await BeamContext.Default;

// Fetch type-safe content
const abilityMap = await context.Content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
const allMinions = await context.Content.getContentByType<Minions>('Minions');

console.log(`Ability: ${abilityMap.properties.actions.data[0].abilityName}`);
```

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