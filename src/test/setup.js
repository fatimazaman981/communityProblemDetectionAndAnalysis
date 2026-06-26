/**
 * TEST SETUP FILE — runs automatically before every test file
 *
 * Vitest loads this file first (configured in vite.config.js → test.setupFiles).
 * It sets up the global testing environment so every test starts in a clean,
 * predictable state without needing a real browser or a real backend server.
 */

// Import jest-dom — adds extra matchers like toBeInTheDocument(), toBeDisabled(), etc.
// Without this, assertions like expect(element).toBeInTheDocument() would not exist.
import '@testing-library/jest-dom'
import { vi } from 'vitest'

/**
 * MOCK localStorage
 *
 * jsdom (the fake browser environment used by Vitest) does not fully support
 * localStorage, so we replace it with a simple JavaScript object-based
 * implementation that behaves identically.
 *
 * This lets AuthContext save/load tokens in tests exactly as it does in production,
 * without actually writing to a real browser's storage.
 */
const localStorageMock = (() => {
  let store = {} // in-memory object acts as the storage container

  return {
    getItem:    (key)        => store[key] ?? null,         // return null if key not set
    setItem:    (key, value) => { store[key] = String(value) }, // always store as string
    removeItem: (key)        => { delete store[key] },      // delete the key
    clear:      ()           => { store = {} },              // wipe everything
  }
})()

// Attach our mock as the global localStorage so all code that calls
// localStorage.getItem / setItem / removeItem uses our fake version
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

/**
 * MOCK Axios HTTP client
 *
 * Our tests must never send real HTTP requests to the Django backend.
 * We replace the entire Axios instance with a mock that returns nothing by default.
 * Individual test files can override this with vi.spyOn() to simulate
 * specific API responses (success or error).
 *
 * The interceptors.request.use mock prevents errors when AuthContext registers
 * the Bearer token interceptor on startup.
 */
vi.mock('../api/axiosInstance', () => ({
  default: {
    post:         vi.fn(), // mock for POST requests (e.g. login)
    get:          vi.fn(), // mock for GET requests (e.g. complaints list)
    interceptors: { request: { use: vi.fn() } }, // mock the token interceptor
  },
}))

/**
 * SUPPRESS React Router future-flag console warnings
 *
 * React Router v7 emits deprecation warnings about future flags during tests.
 * We silence them so the test output stays clean and readable.
 */
vi.stubGlobal('console', {
  ...console,       // keep all other console methods (log, error, etc.) intact
  warn: vi.fn(),    // replace warn with a silent no-op
})
