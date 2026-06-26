/**
 * TRAJECTORY EVALUATION — Authentication
 * File: src/__tests__/trajectories/auth.trajectory.test.jsx
 *
 * WHAT THIS FILE TESTS:
 * The complete authentication state machine in Fixify:
 *
 *   [No Token] → [Login form] → [Validation Error] → [API Call]
 *       → [Authenticated] → [Token in localStorage] → [Logout] → [No Token]
 *
 * TWO THINGS ARE TESTED HERE:
 * 1. AuthContext (src/context/AuthContext.jsx) — the global state manager that
 *    stores the admin's token, society name, and block list.
 * 2. Login Page (src/pages/Login.jsx) — the UI form that drives the auth flow.
 *
 * TOOLS USED:
 * - renderHook    → renders a React hook without a visible UI component
 * - render        → renders a full React component tree into a fake DOM
 * - screen        → queries the fake DOM for elements (by text, role, placeholder, etc.)
 * - fireEvent     → simulates browser events (click, keydown) synchronously
 * - userEvent     → simulates real user interactions (typing) asynchronously
 * - vi.spyOn      → intercepts a function call and replaces it with a custom return value
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../../context/AuthContext'
import { ThemeProvider } from '../../context/ThemeContext'
import Login from '../../pages/Login'
import * as authApi from '../../api/auth'  // imported as a namespace so vi.spyOn can intercept it

/**
 * Wrapper component — wraps children with all required React Context providers.
 * Every component in Fixify needs both AuthProvider (auth state) and
 * ThemeProvider (color tokens) to render without crashing.
 */
const Wrapper = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </AuthProvider>
)


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 1 — AuthContext Initial State
// What does AuthContext contain when the app first loads?
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 1 — AuthContext initial state', () => {

  // Clear localStorage before each test so previous test data does not interfere
  beforeEach(() => localStorage.clear())

  it('starts with null auth when no token in localStorage', () => {
    // Render the useAuth hook inside AuthProvider and read its return value
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    // When no token exists, auth should be null (user is not logged in)
    expect(result.current.auth).toBeNull()
  })

  it('rehydrates token from localStorage on mount', () => {
    // Simulate a returning user whose token was saved from a previous session
    localStorage.setItem('fixify_token', 'existing-token-abc')

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    // AuthContext reads localStorage on startup — auth should not be null
    expect(result.current.auth).not.toBeNull()

    // The token must match what we stored
    expect(result.current.auth.token).toBe('existing-token-abc')
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 2 — Login / Logout State Transitions
// Tests the login() and logout() functions provided by AuthContext
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 2 — Login flow: state transitions', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks() // reset any spies from previous tests
  })

  it('step 1: login() stores token in AuthContext and localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    // Simulate the data returned by the Django backend after a successful login
    const mockData = {
      token:        'tok-123',
      society_name: 'Green Acres',
      blocks:       ['Block A', 'Block B'],
    }

    // act() ensures React processes the state update before we assert
    act(() => result.current.login(mockData))

    // The token must be stored in AuthContext so components can read it
    expect(result.current.auth.token).toBe('tok-123')

    // The society name is shown in the Header component
    expect(result.current.auth.society_name).toBe('Green Acres')

    // The blocks array populates filter dropdowns across all pages
    expect(result.current.auth.blocks).toEqual(['Block A', 'Block B'])

    // The token must also be persisted to localStorage for page refreshes
    expect(localStorage.getItem('fixify_token')).toBe('tok-123')
  })

  it('step 2: logout() clears auth and removes token from localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    // First log in, then log out — testing the full cycle
    act(() => result.current.login({ token: 'tok-123', society_name: 'Green Acres', blocks: [] }))
    act(() => result.current.logout())

    // After logout, auth must be null — user is no longer authenticated
    expect(result.current.auth).toBeNull()

    // The token must be removed from localStorage — page refresh should not re-authenticate
    expect(localStorage.getItem('fixify_token')).toBeNull()
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 3 — Login Page Validation
// Tests the full step-by-step journey through the Login form:
//   render → empty submit → partial submit → wrong credentials → error clears
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 3 — Login page validation trajectory', () => {

  /**
   * Helper: renders the Login page inside all required providers.
   * MemoryRouter is needed because Login uses useNavigate() from React Router.
   */
  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Wrapper>
          <Login />
        </Wrapper>
      </MemoryRouter>
    )

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('step 1: page renders email, password inputs and Sign in button', () => {
    renderLogin()

    // Query by placeholder text — this is how the HTML input is identified in the DOM
    expect(screen.getByPlaceholderText('admin@fixify.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()

    // Query by accessible role — buttons have role="button" and name from their text content
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('step 2: submitting empty form shows validation error', async () => {
    renderLogin()

    // Click Sign In without entering anything
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // The Login page checks for empty fields before calling the API
    // findByText waits for the element to appear (in case of async state update)
    expect(await screen.findByText(/please enter your email and password/i)).toBeInTheDocument()
  })

  it('step 3: submitting email only (no password) shows validation error', async () => {
    renderLogin()

    // Type only an email, leave password empty
    const emailInput = screen.getByPlaceholderText('admin@fixify.com')
    await userEvent.type(emailInput, 'admin@fixify.com')

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Both fields must be filled — email alone is not enough
    expect(await screen.findByText(/please enter your email and password/i)).toBeInTheDocument()
  })

  it('step 4: API error response shows error message on screen', async () => {
    // Intercept loginAdmin() and make it reject with a fake 401 error
    // This simulates the Django backend returning "Invalid credentials"
    vi.spyOn(authApi, 'loginAdmin').mockRejectedValueOnce({
      response: { data: { detail: 'Invalid credentials. Please try again.' } },
    })

    renderLogin()

    // Fill both fields with wrong credentials
    await userEvent.type(screen.getByPlaceholderText('admin@fixify.com'), 'wrong@test.com')
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass')

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // The error message from the API response must appear on screen
    expect(await screen.findByText('Invalid credentials. Please try again.')).toBeInTheDocument()
  })

  it('step 5: typing in inputs clears the error message', async () => {
    // Set up so the first login attempt fails with an error
    vi.spyOn(authApi, 'loginAdmin').mockRejectedValueOnce({
      response: { data: { detail: 'Invalid credentials. Please try again.' } },
    })

    renderLogin()

    const emailInput    = screen.getByPlaceholderText('admin@fixify.com')
    const passwordInput = screen.getByPlaceholderText('Enter your password')

    // Trigger the error state first
    await userEvent.type(emailInput, 'wrong@test.com')
    await userEvent.type(passwordInput, 'wrongpass')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await screen.findByText('Invalid credentials. Please try again.')

    // Now type a new character into the email field
    await userEvent.type(emailInput, 'a')

    // The error must disappear — good UX: the user knows their input is being accepted
    expect(screen.queryByText('Invalid credentials. Please try again.')).not.toBeInTheDocument()
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 4 — Password Visibility Toggle
// The eye icon button next to the password field toggles input type between
// "password" (hidden) and "text" (visible)
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 4 — Password visibility toggle', () => {

  it('password starts hidden, toggle shows it, toggle again hides it', async () => {
    render(
      <MemoryRouter>
        <Wrapper>
          <Login />
        </Wrapper>
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('Enter your password')

    // Passwords must be hidden by default (type="password" masks characters)
    expect(passwordInput).toHaveAttribute('type', 'password')

    // The visibility toggle button is rendered as the next sibling of the input
    const toggleBtn = passwordInput.nextElementSibling
    fireEvent.click(toggleBtn)

    // After one click, password becomes visible (type="text")
    expect(passwordInput).toHaveAttribute('type', 'text')

    // After a second click, password is hidden again
    fireEvent.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
