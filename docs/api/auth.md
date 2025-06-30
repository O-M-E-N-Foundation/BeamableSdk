# Auth Module API Reference

The Auth module provides all authentication-related operations for the Beamable JavaScript SDK. It supports both client and server (admin) modes.

## 🚦 Modes: Client & Server
- **Client Mode**: Handles authentication and tokens automatically. Use for browser, desktop, or mobile apps.
- **Server Mode**: Authenticate as the server using a secret key. Impersonate any player by passing their player ID as the `gamertag` parameter to any method.

## 🧑‍💻 Usage Examples

### Client Mode
```typescript
import { configureBeamable, BeamContext } from '@omen.foundation/beamable-sdk';

configureBeamable({ cid: 'your-cid', pid: 'your-pid', apiUrl: 'https://api.beamable.com' });
const context = await BeamContext.Default;
await context.onReady;

// Guest login (automatic on first use)
await context.Auth.guestLogin();

// Register a new user
await context.Auth.registerUser('user@example.com', 'password123');

// Login with email/username
await context.Auth.loginUser('user@example.com', 'password123');

// Get current account info
const account = await context.Auth.getCurrentAccount();
```

### Server Mode (Admin/Backend)
```typescript
import { configureBeamable, BeamContext } from '@omen.foundation/beamable-sdk';

configureBeamable({
  cid: process.env.VITE_CID!,
  pid: process.env.VITE_PID!,
  apiUrl: process.env.VITE_API_URL || 'https://api.beamable.com',
  secret: process.env.VITE_SECRET!,
  mode: 'server'
});
const context = await BeamContext.Default;

// Impersonate a player for any Auth API call
const playerId = '1234567890';
const account = await context.Auth.getCurrentAccount(playerId);
```

## 📋 API Methods

### `guestLogin()`
Anonymous guest login. Automatically called on first context use if no user is logged in. **Not available in server mode.**

**Returns:** `Promise<void>`

**Example:**
```typescript
await context.Auth.guestLogin(); // client mode only
```

---

### `loginUser(usernameOrEmail: string, password: string, gamertag?: string)`
Login with email/username and password. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<LoginResponse>`

**Example:**
```typescript
// Client mode
const response = await context.Auth.loginUser('user@example.com', 'password123');
// Server mode (impersonate)
const response = await context.Auth.loginUser('user@example.com', 'password123', '1234567890');
```

---

### `registerUser(usernameOrEmail: string, password: string, gamertag?: string)`
Register a new user. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<RegisterUserResponse>`

**Example:**
```typescript
await context.Auth.registerUser('user@example.com', 'password123'); // client
await context.Auth.registerUser('user@example.com', 'password123', '1234567890'); // server
```

---

### `getCurrentAccount(gamertag?: string)`
Get info about the currently logged-in user (or impersonated player in server mode).

**Returns:** `Promise<AccountMeResponse>`

**Example:**
```typescript
const account = await context.Auth.getCurrentAccount(); // client
const account = await context.Auth.getCurrentAccount('1234567890'); // server
```

---

### `refreshToken(refreshToken: string, gamertag?: string)`
Refresh the access token. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<LoginResponse>`

**Example:**
```typescript
const newTokens = await context.Auth.refreshToken('your-refresh-token'); // client
const newTokens = await context.Auth.refreshToken('your-refresh-token', '1234567890'); // server
```

---

### `loginWithThirdParty(thirdParty: AuthThirdParty, externalToken: string, gamertag?: string)`
Login with a third-party provider (Google, Apple, Steam, Facebook). Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<any>`

---

### `loginWithDeviceId(deviceId: string, gamertag?: string)`
Login with a device ID. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<LoginResponse>`

---

### `isEmailAvailable(email: string, gamertag?: string)`
Check if an email is available for registration. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<IsEmailAvailableResponse>`

---

### `passwordUpdateInit(email: string, gamertag?: string)`
Start password reset process (sends code to email). Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<any>`

---

### `passwordUpdateConfirm(email: string, code: string, newPassword: string, gamertag?: string)`
Confirm password reset with code and new password. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<any>`

---

### `emailUpdateInit(newEmail: string, gamertag?: string)`
Start email update process (sends code to new email). Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<any>`

---

### `emailUpdateConfirm(code: string, password: string, gamertag?: string)`
Confirm email update with code and password. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<any>`

---

### `removeThirdPartyAssociation(provider: AuthThirdParty, gamertag?: string)`
Remove a third-party account association. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<RemoveThirdPartyAssociationResponse>`

---

### `updateAccount(options: UpdateAccountOptions, gamertag?: string)`
Update account details (username, country, etc). Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<UpdateAccountResponse>`

---

### `registerThirdParty(thirdParty: string, token: string, gamertag?: string)`
Register a third-party account. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<UpdateAccountResponse>`

---

### `registerDevice(deviceId: string, gamertag?: string)`
Register a device for the current account. Optionally impersonate a player in server mode by passing `gamertag`.

**Returns:** `Promise<UpdateAccountResponse>`

---

## 📝 Best Practices
- Always call `configureBeamable` before using Auth methods
- Use `context.onReady` to ensure authentication is complete (client mode)
- Store tokens securely if you need to persist sessions (client mode)
- Use guest login for frictionless onboarding, then upgrade to full account (client mode)
- In server mode, use the `gamertag` parameter to impersonate any player
- Guest login is not available in server mode
- Never expose your server secret in client-side code 