// This file runs before all other modules
// Ensures storage polyfill is loaded before any component that might use localStorage

// Import polyfill directly to ensure it runs immediately
import './lib/storage-polyfill';

export async function register() {
  // This runs on server startup
}

