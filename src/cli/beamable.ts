#!/usr/bin/env node

const [,, command] = process.argv;

if (command === 'generateTypes') {
  // Try to import from compiled version first, fallback to source
  try {
    require('./generateTypes').generateTypes().catch((e: unknown) => {
      console.error('❌ Type generation failed:', e);
      process.exit(1);
    });
  } catch {
    // Fallback to source version for development
    import('./generateTypes').then(mod => {
      mod.generateTypes().catch((e: unknown) => {
        console.error('❌ Type generation failed:', e);
        process.exit(1);
      });
    });
  }
} else if (command === '--help' || command === '-h' || !command) {
  console.log(`
🚀 Beamable SDK CLI

Available commands:
  generateTypes    Generate TypeScript types from your Beamable realm content
  --help, -h       Show this help message

Usage:
  npx beamable generateTypes    # Generate types in your project's src/types/content/
  npm run generateTypes         # If you have the SDK installed locally

Environment Variables:
  VITE_CID         Your Beamable Customer ID (required)
  VITE_PID         Your Beamable Project ID (required)
  VITE_API_URL     Beamable API URL (default: https://api.beamable.com)
  VITE_HASH        Content hash (optional)

Example:
  VITE_CID=your-cid VITE_PID=your-pid npx beamable generateTypes
`);
} else {
  console.error('❌ Unknown command:', command);
  console.log('Run "beamable --help" for available commands');
  process.exit(1);
} 