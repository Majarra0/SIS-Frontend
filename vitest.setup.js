import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up the DOM after each test
afterEach(() => {
  cleanup();
});

// Provide mocks for browser APIs not implemented in jsdom
if (!global.matchMedia) {
  global.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  });
}

if (!global.scrollTo) {
  global.scrollTo = vi.fn();
}

const createMemoryStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    }
  };
};

Object.defineProperty(global, 'localStorage', {
  value: createMemoryStorage(),
  writable: true,
  configurable: true
});

global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.alert = vi.fn();

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserverMock;
}
