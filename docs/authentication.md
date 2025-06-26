# Authentication Flow

The Beamable JavaScript SDK provides a flexible authentication system supporting guest login, user login, registration, third-party, and device-based authentication. It supports both client and server (admin) modes.

## 🔑 Authentication Overview
- **Guest login**: Anonymous session for new or unregistered users (client mode only)
- **User login**: Email/username and password authentication
- **Registration**: Create new user accounts
- **Third-party login**: Google, Apple, Steam, Facebook, etc.
- **Device login**: Login with a device ID
- **Token management**: Handles access and refresh tokens automatically (client mode)
- **Server mode**: Authenticate as the server using a secret key, impersonate any player via `gamertag`

## 👩‍💻 Usage Example

### Client Mode
```typescript
import { configureBeamable, BeamContext } from 'BeamableSDK';

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

// Refresh token
await context.Auth.refreshToken('your-refresh-token');
```

### Server Mode (Admin/Backend)
```typescript
import { configureBeamable, BeamContext } from 'BeamableSDK';

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

## 🔄 AuthModule Methods
- `guestLogin()`: Anonymous login (client mode only)
- `loginUser(usernameOrEmail, password, gamertag?)`: Login with credentials (optionally impersonate in server mode)
- `registerUser(usernameOrEmail, password, gamertag?)`: Register a new user (optionally impersonate in server mode)
- `getCurrentAccount(gamertag?)`: Get info about the current user (or impersonated player in server mode)
- `refreshToken(refreshToken, gamertag?)`: Refresh the access token (optionally impersonate in server mode)
- `loginWithThirdParty(thirdParty, externalToken, gamertag?)`: Login with Google, Apple, etc. (optionally impersonate in server mode)
- `loginWithDeviceId(deviceId, gamertag?)`: Login with a device ID (optionally impersonate in server mode)
- `isEmailAvailable(email, gamertag?)`: Check if an email is available (optionally impersonate in server mode)
- `passwordUpdateInit(email, gamertag?)`: Start password reset (optionally impersonate in server mode)
- `passwordUpdateConfirm(email, code, newPassword, gamertag?)`: Confirm password reset (optionally impersonate in server mode)

## 📝 Best Practices
- Always call `configureBeamable` before using Auth methods
- Use `context.onReady` to ensure authentication is complete (client mode)
- Store tokens securely if you need to persist sessions (client mode)
- Use guest login for frictionless onboarding, then upgrade to full account (client mode)
- In server mode, use the `gamertag` parameter to impersonate any player

## 🔒 Best Practices
- Always call `configureBeamable` before using Auth methods
- Use `context.onReady` to ensure authentication is complete
- Store tokens securely if you need to persist sessions
- Use guest login for frictionless onboarding, then upgrade to full account 