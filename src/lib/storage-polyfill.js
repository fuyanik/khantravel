// Storage polyfill for SSR
// Prevents localStorage errors during server-side rendering

// This needs to run before any imports that might use localStorage
if (typeof window === 'undefined') {
  // Create a comprehensive no-op storage mock that matches Storage API
  class StorageMock {
    constructor() {
      this.store = {};
    }
    
    getItem(key) {
      return this.store[key] || null;
    }
    
    setItem(key, value) {
      this.store[key] = String(value);
    }
    
    removeItem(key) {
      delete this.store[key];
    }
    
    clear() {
      this.store = {};
    }
    
    get length() {
      return Object.keys(this.store).length;
    }
    
    key(index) {
      const keys = Object.keys(this.store);
      return keys[index] || null;
    }
  }
  
  // Create instances
  const localStorageMock = new StorageMock();
  const sessionStorageMock = new StorageMock();
  
  // Define them as non-enumerable properties on global
  try {
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
    
    Object.defineProperty(global, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    // Fallback if defineProperty fails
    global.localStorage = localStorageMock;
    global.sessionStorage = sessionStorageMock;
  }
}

