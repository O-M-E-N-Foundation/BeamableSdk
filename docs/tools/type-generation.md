# Type Generation CLI

The Type Generation CLI automatically generates TypeScript type definitions from your Beamable content, providing full type safety and intellisense for content operations.

## 🚀 Overview

The type generation tool:
- **Fetches your content manifest** from Beamable
- **Downloads all content objects** and analyzes their structure
- **Groups content by type** (e.g., all `AbilityMaps.*` → one `AbilityMaps` type)
- **Generates TypeScript interfaces** for each content type
- **Maintains sync** with your content (deletes obsolete types)

## 🛠️ Installation

The CLI is included with the SDK. No additional installation required.

## 📋 Usage

### Basic Usage

```bash
# Using npm script
npm run generateTypes

# Using npx (once published)
npx beamable generateTypes

# Using the CLI directly
tsx ./src/cli/beamable.ts generateTypes
```

### Environment Setup

Ensure your `.env` file contains the required credentials:

```env
VITE_CID=your-customer-id
VITE_PID=your-project-id
VITE_API_URL=https://api.beamable.com
```

## 🔄 What It Does

### 1. Content Discovery

The tool starts by fetching your content manifest:

```
Fetching content manifest...
Found 869 content entries in manifest
```

### 2. Content Download & Analysis

Downloads all content objects and groups them by type:

```
Downloading content objects and grouping by type...
Downloaded 869/869 content objects...
Grouped content into 18 types:
  stores: 6 items
  skus: 18 items
  Roadmap: 14 items
  vip: 1 items
  Probability: 39 items
  listings: 85 items
  items: 604 items
  EggSprites: 1 items
  currency: 5 items
  CcgKit: 30 items
  Maintenance: 1 items
  leaderboards: 4 items
  SkuExtension: 18 items
  Bosses: 2 items
  Themes: 3 items
  StoreSection: 3 items
  AbilityMaps: 30 items
  Minions: 5 items
```

### 3. Type Generation

Generates one TypeScript file per content type:

```
Generating TypeScript types...
Generated type for stores (6 items) -> stores.d.ts
Generated type for skus (18 items) -> skus.d.ts
Generated type for Roadmap (14 items) -> Roadmap.d.ts
...
Generated type for AbilityMaps (30 items) -> AbilityMaps.d.ts
Generated type for Minions (5 items) -> Minions.d.ts
```

### 4. Cleanup

Removes obsolete type files to keep everything in sync:

```
Cleaning up obsolete type files...
Deleted 705 obsolete type files
Type generation complete! Generated 18 content types in src/types/content/
```

## 📁 Generated Files

### Output Location

Types are generated in `src/types/content/`:

```
src/types/content/
├── AbilityMaps.d.ts
├── Minions.d.ts
├── currency.d.ts
├── items.d.ts
├── listings.d.ts
├── stores.d.ts
└── ... (18 total files)
```

### File Structure

Each generated file contains:

```typescript
// Example: AbilityMaps.d.ts
export interface LegacyContentId {
  data: string;
}

export interface AbilityContent {
  data: string;
}

export interface Qualifier {
  value: number;
  operation: string;
  stat: string;
}

export interface Data {
  abilityName: string;
  resSickness: boolean;
  isTaunt: boolean;
  isTargeting: boolean;
  persist: boolean;
  applyTo: string;
  qualifiers: Qualifier[];
}

export interface Action {
  data: Data[];
}

export interface Property {
  legacyContentId: LegacyContentId;
  abilityContent: AbilityContent;
  actions: Action;
}

export interface RootObject {
  id: string;
  version: string;
  properties: Property;
}
```

## 🎯 Using Generated Types

### Import Types

```typescript
// Import with type aliases for cleaner code
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';
import type { RootObject as Minions } from '../types/content/Minions';
import type { RootObject as Currency } from '../types/content/currency';
```

### Type-Safe Content Fetching

```typescript
import { BeamContext } from 'BeamableSDK';
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';

const context = await BeamContext.Default;

// Type-safe content fetching
const abilityMap = await context.Content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');

// Full TypeScript intellisense
console.log(abilityMap.properties.actions.data[0].abilityName); // ✅ Type-safe
console.log(abilityMap.properties.actions.data[0].isTaunt);     // ✅ Type-safe
```

### Batch Type-Safe Operations

```typescript
// Fetch all content of a type with full type safety
const allAbilityMaps = await context.Content.getContentByType<AbilityMaps>('AbilityMaps');

allAbilityMaps.forEach(abilityMap => {
  const action = abilityMap.properties.actions.data[0];
  console.log(`${abilityMap.id}: ${action.abilityName} (Taunt: ${action.isTaunt})`);
});
```

## 🔄 When to Regenerate Types

### Automatic Regeneration

Run the CLI whenever:

- **Content is added** to your Beamable realm
- **Content is modified** (structure changes)
- **Content is deleted** from your realm
- **New content types** are created
- **Content properties** are updated

### Development Workflow

```bash
# 1. Make changes to content in Beamable portal
# 2. Regenerate types
npm run generateTypes

# 3. Use updated types in your code
# 4. TypeScript will catch any breaking changes
```

### CI/CD Integration

Add type generation to your build process:

```json
{
  "scripts": {
    "prebuild": "npm run generateTypes",
    "build": "your-build-command",
    "generateTypes": "tsx ./src/cli/beamable.ts generateTypes"
  }
}
```

## 🚨 Important Notes

### Content Type Grouping

The tool groups content by the first part of the content ID:

- `AbilityMaps.VitalityAura` → `AbilityMaps` type
- `Minions.GoblinBlue` → `Minions` type
- `currency.WUF` → `currency` type

### Type Consistency

- **One type per content group** - all items in a group share the same structure
- **Representative sampling** - uses the first item in each group to generate the type
- **Automatic cleanup** - removes types for content that no longer exists

### Performance

- **Downloads all content** - can take time for large content sets
- **Progress feedback** - shows download progress every 10 items
- **Error handling** - continues processing even if some content fails to download

## 🔧 Advanced Usage

### Custom Configuration

You can modify the type generation behavior by editing `src/cli/generateTypes.ts`:

```typescript
// Customize type naming
const typeName = safeName.charAt(0).toUpperCase() + safeName.slice(1);

// Customize file naming
const filePath = path.join(typesDir, `${safeName}.d.ts`);

// Customize type generation options
const tsDef = json2ts.convert(JSON.stringify(representativeItem), { 
  rootName: typeName 
});
```

### Integration with Build Tools

#### Webpack

```javascript
// webpack.config.js
const { execSync } = require('child_process');

module.exports = {
  // ... other config
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap('GenerateTypes', () => {
          try {
            execSync('npm run generateTypes', { stdio: 'inherit' });
          } catch (error) {
            console.warn('Type generation failed:', error.message);
          }
        });
      }
    }
  ]
};
```

#### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

export default defineConfig({
  plugins: [
    {
      name: 'generate-types',
      buildStart() {
        try {
          execSync('npm run generateTypes', { stdio: 'inherit' });
        } catch (error) {
          console.warn('Type generation failed:', error.message);
        }
      }
    }
  ]
});
```

## 🐛 Troubleshooting

### Common Issues

#### Environment Variables Not Set

```
Error: VITE_CID and VITE_PID must be set in environment variables or .env file
```

**Solution:** Ensure your `.env` file contains the required variables.

#### Network Errors

```
Error: Failed to fetch content: SomeContent
```

**Solution:** Check your internet connection and API credentials.

#### Type Generation Errors

```
Error: "[object Object]" is not valid JSON
```

**Solution:** This is usually a temporary issue. Try running the command again.

#### Permission Errors

```
Error: EACCES: permission denied
```

**Solution:** Ensure you have write permissions to the `src/types/content/` directory.

### Debug Mode

For detailed debugging, you can modify the CLI to show more information:

```typescript
// In src/cli/generateTypes.ts, add more console.log statements
console.log('Debug: Processing content type:', contentType);
console.log('Debug: Content structure:', JSON.stringify(representativeItem, null, 2));
```

## 📋 Best Practices

### Development Workflow

1. **Generate types early** - Run after initial setup
2. **Regenerate frequently** - After any content changes
3. **Use type aliases** - For cleaner imports
4. **Handle errors gracefully** - Content may not always be available
5. **Cache when appropriate** - For performance in production

### Type Usage

1. **Import with aliases** - `import type { RootObject as AbilityMaps }`
2. **Use generics** - `getContent<AbilityMaps>(contentId)`
3. **Leverage intellisense** - Let TypeScript guide your development
4. **Handle optional properties** - Some content may have missing fields

### Maintenance

1. **Keep types in sync** - Regenerate after content changes
2. **Version control types** - Commit generated types to your repository
3. **Document custom types** - If you extend the generated types
4. **Test type safety** - Ensure your code compiles with strict TypeScript

## 🔗 Related Documentation

- [Content Module API](../api/content.md) - Using the generated types
- [Content Type System](../advanced/content-types.md) - Understanding the type system
- [CLI Reference](cli.md) - Other CLI commands
- [Architecture](../architecture.md) - Understanding the SDK design

---

**Need help?** Check out our [Troubleshooting Guide](../troubleshooting.md) or [open an issue](https://github.com/your-org/beamable-javascript-sdk/issues). 