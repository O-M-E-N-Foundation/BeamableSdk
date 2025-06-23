import fs from 'fs';
import path from 'path';
import { BeamableCore } from '../core/BeamableCore';
import { createRequire } from 'module';
import dotenv from 'dotenv';

dotenv.config();

function getConfigFromEnv() {
  return {
    apiUrl: process.env.VITE_API_URL || 'https://api.beamable.com',
    cid: process.env.VITE_CID || '',
    pid: process.env.VITE_PID || '',
    hash: process.env.VITE_HASH || '',
  };
}

function findProjectRoot(): string {
  // Start from current working directory and walk up until we find package.json
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  // If no package.json found, use current working directory
  return process.cwd();
}

function extractContentType(contentId: string): string {
  // Extract the content type from contentId
  // e.g., "AbilityMaps.AlliedStrength" -> "AbilityMaps"
  // e.g., "Minions.GoblinBlue" -> "Minions"
  // e.g., "items.Quest.Complete100" -> "items"
  const parts = contentId.split('.');
  return parts[0];
}

export async function generateTypes() {
  // 1. Find the consumer's project root
  const projectRoot = findProjectRoot();
  const typesDir = path.join(projectRoot, 'src', 'types', 'content');
  
  console.log(`Project root: ${projectRoot}`);
  console.log(`Types will be generated in: ${typesDir}`);

  // 2. Load config from env
  const config = getConfigFromEnv();
  if (!config.cid || !config.pid) {
    throw new Error('VITE_CID and VITE_PID must be set in environment variables or .env file');
  }
  const core = new BeamableCore(config);

  // 3. Fetch the manifest
  console.log('Fetching content manifest...');
  const manifest = await core.request('GET', '/basic/content/manifest/public/json');
  const entries = manifest.entries || manifest.manifest?.entries || [];
  if (!Array.isArray(entries)) throw new Error('No entries found in manifest');
  console.log(`Found ${entries.length} content entries in manifest`);

  // 4. Download all content JSONs and group by type
  console.log('Downloading content objects and grouping by type...');
  const contentByType: Record<string, any[]> = {};
  let downloaded = 0;
  for (const entry of entries) {
    try {
      const contentId = entry.contentId || entry.id || entry.name || `content_${downloaded}`;
      const res = await fetch(entry.uri);
      if (!res.ok) throw new Error(`Failed to fetch content: ${contentId}`);
      const json = await res.json();
      
      // Group by content type
      const contentType = extractContentType(contentId);
      if (!contentByType[contentType]) {
        contentByType[contentType] = [];
      }
      contentByType[contentType].push(json);
      
      downloaded++;
      if (downloaded % 10 === 0 || downloaded === entries.length) {
        console.log(`Downloaded ${downloaded}/${entries.length} content objects...`);
      }
    } catch (e) {
      console.warn(`Skipping ${entry.contentId || entry.id || 'unknown'}:`, e);
    }
  }

  console.log(`Grouped content into ${Object.keys(contentByType).length} types:`);
  Object.entries(contentByType).forEach(([type, items]) => {
    console.log(`  ${type}: ${items.length} items`);
  });

  // 5. Create the types directory in the consumer's project
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
    console.log(`Created types directory: ${typesDir}`);
  }

  // 6. Generate types using json2ts
  console.log('Generating TypeScript types...');
  const require = createRequire(import.meta.url || __filename);
  const json2ts = require('json2ts');
  const writtenFiles = new Set<string>();
  let generated = 0;
  
  for (const [contentType, items] of Object.entries(contentByType)) {
    // Use the first item as a representative sample for the type
    const representativeItem = items[0];
    const safeName = contentType.replace(/[^a-zA-Z0-9_]/g, '_');
    const typeName = safeName.charAt(0).toUpperCase() + safeName.slice(1);
    const tsDef = json2ts.convert(JSON.stringify(representativeItem), { rootName: typeName });
    const filePath = path.join(typesDir, `${safeName}.d.ts`);
    fs.writeFileSync(filePath, tsDef, 'utf8');
    writtenFiles.add(`${safeName}.d.ts`);
    generated++;
    console.log(`Generated type for ${contentType} (${items.length} items) -> ${safeName}.d.ts`);
  }

  // 7. Delete files in consumer's src/types/content/ not present in manifest
  console.log('Cleaning up obsolete type files...');
  const existingFiles = fs.readdirSync(typesDir);
  let deleted = 0;
  for (const file of existingFiles) {
    if (!writtenFiles.has(file)) {
      fs.unlinkSync(path.join(typesDir, file));
      deleted++;
    }
  }
  if (deleted > 0) {
    console.log(`Deleted ${deleted} obsolete type files`);
  }

  console.log(`✅ Type generation complete! Generated ${generated} content types in ${typesDir}`);
  console.log(`📁 Types are now available for import in your project`);
} 