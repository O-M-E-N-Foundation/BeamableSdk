# Content Module API Reference

The Content module provides type-safe access to Beamable content with support for generic types and auto-generated TypeScript interfaces.

## 📦 Overview

The Content module allows you to:
- Fetch the public content manifest
- Retrieve individual content objects by ID
- Get all content of a specific type
- Use TypeScript generics for type safety

## 🔧 Basic Usage

```typescript
import { BeamContext } from 'BeamableSDK';

const context = await BeamContext.Default;
const content = context.Content;
```

## 📋 API Methods

### `getPublicManifest()`

Fetches the public content manifest containing all available content entries.

**Returns:** `Promise<ContentManifestResponse>`

**Example:**
```typescript
const manifest = await content.getPublicManifest();
console.log(`Found ${manifest.entries.length} content entries`);

// Access manifest structure
manifest.entries.forEach(entry => {
  console.log(`${entry.contentId}: ${entry.uri}`);
});
```

**Response Type:**
```typescript
interface ContentManifestResponse {
  manifest: {
    id: string;
    checksum: string;
    created: string;
    updated: string;
    entries: ContentManifestEntry[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface ContentManifestEntry {
  id: string;
  type: string;
  uri: string;
  contentId: string;
  [key: string]: any;
}
```

### `getContent<T>(contentId: string)`

Fetches a specific content object by its ID and returns it as the specified type.

**Parameters:**
- `contentId` (string): The ID of the content to fetch (e.g., 'AbilityMaps.VitalityAura')

**Returns:** `Promise<T>`

**Example:**
```typescript
// Fetch without type safety
const abilityMap = await content.getContent('AbilityMaps.VitalityAura');
console.log('Ability Map:', abilityMap.id);

// Fetch with type safety (after generating types)
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';

const typedAbilityMap = await content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
console.log('Ability Name:', typedAbilityMap.properties.actions.data[0].abilityName);
```

**Error Handling:**
```typescript
try {
  const content = await content.getContent('NonExistent.Content');
} catch (error) {
  if (error.message.includes('Content not found')) {
    console.log('Content does not exist');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### `getContentByType<T>(contentType: string)`

Fetches all content objects of a specific type.

**Parameters:**
- `contentType` (string): The type of content to fetch (e.g., 'AbilityMaps', 'Minions')

**Returns:** `Promise<T[]>`

**Example:**
```typescript
// Fetch all ability maps
const allAbilityMaps = await content.getContentByType('AbilityMaps');
console.log(`Found ${allAbilityMaps.length} ability maps`);

// Fetch with type safety
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';

const typedAbilityMaps = await content.getContentByType<AbilityMaps>('AbilityMaps');
typedAbilityMaps.forEach(abilityMap => {
  console.log(`${abilityMap.id}: ${abilityMap.properties.actions.data[0].abilityName}`);
});
```

**Empty Results:**
```typescript
// Returns empty array if no content of that type exists
const nonExistent = await content.getContentByType('NonExistentType');
console.log(nonExistent.length); // 0
```

## 🎯 Type Safety with Generics

### Using Generated Types

After running the type generation CLI (see [Type Generation](../tools/type-generation.md)):

```typescript
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';
import type { RootObject as Minions } from '../types/content/Minions';
import type { RootObject as Currency } from '../types/content/currency';

// Type-safe content fetching
const abilityMap = await content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
const minion = await content.getContent<Minions>('Minions.GoblinBlue');
const currency = await content.getContent<Currency>('currency.WUF');

// Full TypeScript intellisense
console.log(abilityMap.properties.actions.data[0].abilityName); // ✅ Type-safe
console.log(abilityMap.properties.actions.data[0].isTaunt);     // ✅ Type-safe
console.log(minion.properties.displayName.data);                // ✅ Type-safe
```

### Type Inference

If you don't specify a type, the content is returned as `any`:

```typescript
// No type safety
const content = await content.getContent('AbilityMaps.VitalityAura');
console.log(content.properties.actions.data[0].abilityName); // ⚠️ No type checking
```

## 📊 Content Structure

### Standard Content Format

All content objects follow this basic structure:

```typescript
interface ContentObject {
  id: string;           // Content ID (e.g., 'AbilityMaps.VitalityAura')
  version: string;      // Content version
  properties: {         // Content-specific properties
    [key: string]: any;
  };
}
```

### Content ID Format

Content IDs follow the pattern: `Type.Name`

Examples:
- `AbilityMaps.VitalityAura`
- `Minions.GoblinBlue`
- `currency.WUF`
- `items.Quest.Complete100`

## 🔄 Common Patterns

### Fetching Related Content

```typescript
// Get all content of a type, then fetch specific items
const allAbilityMaps = await content.getContentByType('AbilityMaps');
const specificAbility = allAbilityMaps.find(ability => 
  ability.id === 'AbilityMaps.VitalityAura'
);
```

### Error Handling

```typescript
async function fetchContentSafely(contentId: string) {
  try {
    const content = await content.getContent(contentId);
    return { success: true, data: content };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      contentId 
    };
  }
}

const result = await fetchContentSafely('AbilityMaps.VitalityAura');
if (result.success) {
  console.log('Content:', result.data);
} else {
  console.log('Error:', result.error);
}
```

### Batch Content Fetching

```typescript
async function fetchMultipleContent(contentIds: string[]) {
  const results = await Promise.allSettled(
    contentIds.map(id => content.getContent(id))
  );
  
  return results.map((result, index) => ({
    contentId: contentIds[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}

const batchResults = await fetchMultipleContent([
  'AbilityMaps.VitalityAura',
  'Minions.GoblinBlue',
  'currency.WUF'
]);
```

## 🚨 Important Notes

### Content Availability

- **Content is read-only** in the client SDK
- **Content must exist** in your Beamable realm
- **Content is cached** for performance
- **Content types** are generated from your actual content

### Performance Considerations

- **Use `getContentByType`** when you need multiple items of the same type
- **Cache results** when appropriate for your use case
- **Handle errors gracefully** as content may not always be available
- **Consider pagination** for large content sets (if supported)

### Type Generation

- **Run type generation** after content changes: `npm run generateTypes`
- **Import types** from the generated files in `src/types/content/`
- **Use type aliases** for cleaner imports: `import type { RootObject as AbilityMaps }`
- **Regenerate types** when content structure changes

## 📋 Examples

### Complete Content Management Example

```typescript
import { BeamContext } from 'BeamableSDK';
import type { RootObject as AbilityMaps } from '../types/content/AbilityMaps';
import type { RootObject as Minions } from '../types/content/Minions';

async function contentManagementExample() {
  const context = await BeamContext.Default;
  const content = context.Content;

  try {
    // 1. Get the manifest
    const manifest = await content.getPublicManifest();
    console.log(`📦 Found ${manifest.entries.length} content entries`);

    // 2. Get all ability maps with type safety
    const abilityMaps = await content.getContentByType<AbilityMaps>('AbilityMaps');
    console.log(`⚔️ Found ${abilityMaps.length} ability maps`);

    // 3. Get a specific ability map
    const vitalityAura = await content.getContent<AbilityMaps>('AbilityMaps.VitalityAura');
    console.log(`✨ ${vitalityAura.properties.actions.data[0].abilityName}`);

    // 4. Get all minions
    const minions = await content.getContentByType<Minions>('Minions');
    console.log(`👹 Found ${minions.length} minions`);

    // 5. Display content information
    abilityMaps.forEach(ability => {
      const action = ability.properties.actions.data[0];
      console.log(`${ability.id}: ${action.abilityName} (Taunt: ${action.isTaunt})`);
    });

  } catch (error) {
    console.error('❌ Content management error:', error);
  }
}
```

## 🔗 Related Documentation

- [Type Generation](../tools/type-generation.md) - Generate TypeScript types for your content
- [Content Type System](../advanced/content-types.md) - Understanding generated types
- [Examples](../examples/content-management.md) - Real-world content management examples
- [Architecture](../architecture.md) - Understanding the SDK architecture

---

**Need help?** Check out our [Troubleshooting Guide](../troubleshooting.md) or [open an issue](https://github.com/your-org/beamable-javascript-sdk/issues). 