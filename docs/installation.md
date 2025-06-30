# Installation & Setup

This guide will help you install and configure the Beamable JavaScript SDK for your project.

## 📦 Installation

### NPM Installation

```bash
npm install @omen.foundation/beamable-sdk
```

### Yarn Installation

```bash
yarn add @omen.foundation/beamable-sdk
```

### PNPM Installation

```bash
pnpm add @omen.foundation/beamable-sdk
```

## 🛠️ Environment Setup

### Required Environment Variables (Client Mode)

Create a `.env` file in your project root with the following variables:

```env
# Required: Your Beamable Customer ID
VITE_CID=your-customer-id

# Required: Your Beamable Project ID  
VITE_PID=your-project-id

# Optional: Custom API URL (defaults to https://api.beamable.com)
VITE_API_URL=https://api.beamable.com

# Optional: Content hash for microservices (if needed)
VITE_HASH=your-content-hash
```

### Additional Variables for Server Mode

```env
# Required for server mode: Your Beamable secret key
VITE_SECRET=your-server-secret
```

### Finding Your Credentials

1. **Customer ID (CID)**: Found in your Beamable portal under Account Settings
2. **Project ID (PID)**: Found in your Beamable portal under the specific project
3. **API URL**: Usually `https://api.beamable.com` unless you're using a custom environment
4. **Secret Key**: Found in your Beamable portal under Project Settings (for server/admin use)

### Environment Variable Prefix

The SDK uses the `VITE_` prefix for environment variables to work seamlessly with Vite-based projects. If you're using a different build tool, you can access these variables directly:

```typescript
// For non-Vite projects, you can set these directly
process.env.VITE_CID = 'your-customer-id';
process.env.VITE_PID = 'your-project-id';
process.env.VITE_SECRET = 'your-server-secret';
```

## 🚀 Initial Configuration

### Basic Setup (Client Mode)

```typescript
import { configureBeamable } from '@omen.foundation/beamable-sdk';

// Configure the SDK with your credentials
configureBeamable({
  cid: process.env.VITE_CID!,
  pid: process.env.VITE_PID!,
  apiUrl: process.env.VITE_API_URL || 'https://api.beamable.com',
  hash: process.env.VITE_HASH || ''
});
```

### Server Mode Setup (Admin/Backend)

```typescript
import { configureBeamable } from '@omen.foundation/beamable-sdk';

configureBeamable({
  cid: process.env.VITE_CID!,
  pid: process.env.VITE_PID!,
  apiUrl: process.env.VITE_API_URL || 'https://api.beamable.com',
  secret: process.env.VITE_SECRET!,
  mode: 'server'
});
```

- In server mode, the SDK signs all requests with your secret key and supports impersonation via the `gamertag` parameter.
- Guest login and player info fetch are skipped in server mode.

### TypeScript Setup

If you're using TypeScript, make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true
  }
}
```

### Vite Configuration

For Vite projects, ensure your `vite.config.ts` includes:

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@omen.foundation/beamable-sdk']
  }
});
```

## 🔍 Verification

### Test Your Installation

Create a simple test file to verify everything is working:

```typescript
import { configureBeamable, BeamContext } from '@omen.foundation/beamable-sdk';

async function testInstallation() {
  try {
    // Configure the SDK (client or server mode)
    configureBeamable({
      cid: process.env.VITE_CID!,
      pid: process.env.VITE_PID!,
      apiUrl: 'https://api.beamable.com',
      // secret: process.env.VITE_SECRET!,
      // mode: 'server'
    });

    // Get the context
    const context = await BeamContext.Default;
    
    // Test basic functionality
    const manifest = await context.Content.getPublicManifest();
    console.log('✅ SDK is working! Found', manifest.entries.length, 'content entries');
    
  } catch (error) {
    console.error('❌ Installation test failed:', error);
  }
}

testInstallation();
```

### Common Issues

#### Environment Variables Not Loading

If your environment variables aren't loading:

1. **Check file location**: Ensure `.env` is in your project root
2. **Check variable names**: Must start with `VITE_`
3. **Restart your dev server**: Environment variables require a restart

#### TypeScript Errors

If you see TypeScript errors:

1. **Check imports**: Use named imports, not default imports
2. **Check tsconfig**: Ensure `esModuleInterop` is enabled
3. **Check types**: Install `@types/node` if needed

#### Network Errors

If you see network errors:

1. **Check credentials**: Verify CID and PID are correct
2. **Check API URL**: Ensure it's accessible from your network
3. **Check CORS**: For browser usage, ensure CORS is configured

## 📱 Framework-Specific Setup

### React Setup

```typescript
// In your main App.tsx or index.tsx
import { configureBeamable } from '@omen.foundation/beamable-sdk';

// Configure once at app startup
configureBeamable({
  cid: import.meta.env.VITE_CID,
  pid: import.meta.env.VITE_PID,
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.beamable.com'
});
```

### Vue Setup

```typescript
// In your main.ts
import { configureBeamable } from '@omen.foundation/beamable-sdk';

configureBeamable({
  cid: import.meta.env.VITE_CID,
  pid: import.meta.env.VITE_PID,
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.beamable.com'
});
```

### Node.js Setup

```typescript
// In your main server file
import { configureBeamable } from '@omen.foundation/beamable-sdk';
import dotenv from 'dotenv';

dotenv.config();

configureBeamable({
  cid: process.env.VITE_CID!,
  pid: process.env.VITE_PID!,
  apiUrl: process.env.VITE_API_URL || 'https://api.beamable.com',
  secret: process.env.VITE_SECRET!,
  mode: 'server'
});
```

## 🔐 Security Considerations

### Environment Variables

- **Never commit credentials** to version control
- **Use different credentials** for development and production
- **Rotate credentials** regularly
- **Use secret management** in production environments

### API Security

- **HTTPS only** in production
- **Validate all inputs** before sending to API
- **Handle errors gracefully** without exposing sensitive information
- **Use appropriate scopes** for different operations
- **Never expose your server secret in client-side code**

## 📋 Next Steps

Once you have the SDK installed and configured:

1. **Read the [Quick Start Guide](quickstart.md)** to make your first API call
2. **Explore the [API Reference](../api/)** to understand available features
3. **Check out [Examples](../examples/)** for common use cases
4. **Set up [Type Generation](../tools/type-generation.md)** for content types

---

**Need help?** Check out our [Troubleshooting Guide](../troubleshooting.md) or [open an issue](https://github.com/your-org/beamable-javascript-sdk/issues). 