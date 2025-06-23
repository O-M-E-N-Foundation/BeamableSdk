# Quick Start Guide

Get up and running with the Beamable JavaScript SDK in minutes. This guide will walk you through the essential concepts and show you how to make your first API calls.

## 🚀 Your First Beamable Integration

### 1. Basic Setup

First, ensure you have the SDK installed and configured (see [Installation Guide](installation.md)):

```typescript
import { configureBeamable, BeamContext } from 'beamable-javascript-sdk';

// Configure the SDK
configureBeamable({
  cid: 'your-customer-id',
  pid: 'your-project-id',
  apiUrl: 'https://api.beamable.com'
});
```

### 2. Get the Context

The `BeamContext` is your gateway to all SDK functionality:

```typescript
// Get the default context (automatically handles authentication)
const context = await BeamContext.Default;

// Wait for the context to be ready
await context.onReady;
```

### 3. Your First API Call

Let's fetch some content to verify everything is working:

```typescript
// Fetch the content manifest
const manifest = await context.Content.getPublicManifest();
console.log(`Found ${manifest.entries.length} content entries`);

// Fetch a specific piece of content
const abilityMap = await context.Content.getContent('AbilityMaps.VitalityAura');
console.log('Ability Map:', abilityMap.id);
```

## 🔐 Authentication Basics

The SDK handles authentication automatically, but you can also control it manually:

### Guest Authentication

```typescript
// Guest authentication happens automatically, but you can also do it manually
await context.Auth.guestLogin();
console.log('Guest login successful');
```

### User Authentication

```typescript
// Register a new user
const registerResponse = await context.Auth.registerUser('user@example.com', 'password123');
console.log('User registered:', registerResponse);

// Login with existing credentials
const loginResponse = await context.Auth.loginUser('user@example.com', 'password123');
console.log('Login successful:', loginResponse.access_token);
```

### Check Current Account

```typescript
// Get information about the currently logged-in user
const account = await context.Auth.getCurrentAccount();
console.log('Current user:', account.email);
console.log('Player ID:', context.playerId);
```

## 📦 Content Management

### Fetch Individual Content

```typescript
// Fetch content by ID (returns any type)
const content = await context.Content.getContent('Minions.GoblinBlue');
console.log('Content:', content.id, content.version);
```

### Fetch All Content of a Type

```typescript
// Fetch all minions
const allMinions = await context.Content.getContentByType('Minions');
console.log(`Found ${allMinions.length} minions`);

// Fetch all ability maps
const allAbilityMaps = await context.Content.getContentByType('AbilityMaps');
console.log(`Found ${allAbilityMaps.length} ability maps`);
```

### Type-Safe Content (Advanced)

After generating types (see [Type Generation](../tools/type-generation.md)):

```typescript
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';
import type { RootObject as Minions } from '../types/content/Minions';

// Type-safe content fetching
const abilityMap = await context.Content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
const minion = await context.Content.getContent<Minions>('Minions.GoblinBlue');

// TypeScript provides full intellisense
console.log(abilityMap.properties.actions.data[0].abilityName);
console.log(minion.properties.displayName.data);
```

## 🎒 Inventory Management

### Get Player Inventory

```typescript
// Get the current player's inventory
const inventory = await context.Inventory.getInventory(context.playerId!);
console.log('Currencies:', inventory.currencies);
console.log('Items:', inventory.items);
```

## 📊 Statistics

### Get Player Stats

```typescript
// Get player statistics
const stats = await context.Stats.getClientStats(context.playerId!);
console.log('Player stats:', stats);
```

## 🔄 Complete Example

Here's a complete example that demonstrates the main features:

```typescript
import { configureBeamable, BeamContext } from 'beamable-javascript-sdk';

async function beamableExample() {
  try {
    // 1. Configure the SDK
    configureBeamable({
      cid: 'your-customer-id',
      pid: 'your-project-id',
      apiUrl: 'https://api.beamable.com'
    });

    // 2. Get the context
    const context = await BeamContext.Default;
    await context.onReady;

    console.log('✅ SDK initialized successfully');
    console.log('Player ID:', context.playerId);

    // 3. Fetch content
    const manifest = await context.Content.getPublicManifest();
    console.log(`📦 Found ${manifest.entries.length} content entries`);

    // 4. Get some specific content
    const abilityMaps = await context.Content.getContentByType('AbilityMaps');
    console.log(`⚔️ Found ${abilityMaps.length} ability maps`);

    // 5. Get player inventory
    const inventory = await context.Inventory.getInventory(context.playerId!);
    console.log(`🎒 Inventory has ${inventory.currencies.length} currencies`);

    // 6. Get player stats
    const stats = await context.Stats.getClientStats(context.playerId!);
    console.log('📊 Player stats retrieved');

    console.log('🎉 All operations completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

beamableExample();
```

## 🎯 Common Patterns

### Error Handling

```typescript
try {
  const content = await context.Content.getContent('NonExistent.Content');
} catch (error) {
  if (error.message.includes('Content not found')) {
    console.log('Content does not exist');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Async/Await with Context

```typescript
// Good: Wait for context to be ready
const context = await BeamContext.Default;
await context.onReady;

// Then use the context
const content = await context.Content.getContent('Some.Content');
```

### Checking Authentication Status

```typescript
const context = await BeamContext.Default;

// Check if user is authenticated
if (context.playerId) {
  console.log('User is authenticated');
} else {
  console.log('User is not authenticated');
}
```

## 🚨 Important Notes

### Context Lifecycle

- **Always await** `BeamContext.Default` - it returns a Promise
- **Wait for `context.onReady`** before making API calls
- **The context is singleton** - use it throughout your app

### Authentication

- **Guest authentication** happens automatically
- **User authentication** requires explicit login
- **Tokens are managed** automatically by the SDK
- **Player ID** is available after authentication

### Content

- **Content is read-only** in the client SDK
- **Content types** can be generated for type safety
- **Content is cached** for performance
- **Content IDs** follow the pattern `Type.Name`

## 📋 Next Steps

Now that you have the basics:

1. **Explore the [API Reference](../api/)** for detailed method documentation
2. **Set up [Type Generation](../tools/type-generation.md)** for better development experience
3. **Check out [Examples](../examples/)** for real-world use cases
4. **Read about [Architecture](../architecture.md)** to understand the design

---

**Need help?** Check out our [Troubleshooting Guide](../troubleshooting.md) or [open an issue](https://github.com/your-org/beamable-javascript-sdk/issues). 