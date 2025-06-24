# Authentication Flow

The Beamable JavaScript SDK provides a flexible authentication system supporting guest login, user login, registration, third-party, and device-based authentication.

## 🔑 Authentication Overview
- **Guest login**: Anonymous session for new or unregistered users
- **User login**: Email/username and password authentication
- **Registration**: Create new user accounts
- **Third-party login**: Google, Apple, Steam, Facebook, etc.
- **Device login**: Login with a device ID
- **Token management**: Handles access and refresh tokens automatically

## 🧑‍💻 Usage Example

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

## 🔄 AuthModule Methods
- `guestLogin()`: Anonymous login
- `loginUser(usernameOrEmail, password)`: Login with credentials
- `registerUser(usernameOrEmail, password)`: Register a new user
- `getCurrentAccount()`: Get info about the current user
- `refreshToken(refreshToken)`: Refresh the access token
- `loginWithThirdParty(thirdParty, externalToken)`: Login with Google, Apple, etc.
- `loginWithDeviceId(deviceId)`: Login with a device ID
- `isEmailAvailable(email)`: Check if an email is available
- `passwordUpdateInit(email)`: Start password reset
- `passwordUpdateConfirm(email, code, newPassword)`: Confirm password reset

## 🔒 Best Practices
- Always call `configureBeamable` before using Auth methods
- Use `context.onReady` to ensure authentication is complete
- Store tokens securely if you need to persist sessions
- Use guest login for frictionless onboarding, then upgrade to full account 