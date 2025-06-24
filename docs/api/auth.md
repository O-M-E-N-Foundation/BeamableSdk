# Auth Module API Reference

The Auth module provides all authentication-related operations for the Beamable JavaScript SDK.

## 📋 API Methods

### `guestLogin()`
Anonymous guest login. Automatically called on first context use if no user is logged in.

**Returns:** `Promise<void>`

**Example:**
```typescript
await context.Auth.guestLogin();
```

---

### `loginUser(usernameOrEmail: string, password: string)`
Login with email/username and password.

**Returns:** `Promise<LoginResponse>`

**Example:**
```typescript
const response = await context.Auth.loginUser('user@example.com', 'password123');
console.log(response.access_token);
```

---

### `registerUser(usernameOrEmail: string, password: string)`
Register a new user.

**Returns:** `Promise<RegisterUserResponse>`

**Example:**
```typescript
await context.Auth.registerUser('user@example.com', 'password123');
```

---

### `getCurrentAccount()`
Get info about the currently logged-in user.

**Returns:** `Promise<AccountMeResponse>`

**Example:**
```typescript
const account = await context.Auth.getCurrentAccount();
console.log(account.email);
```

---

### `refreshToken(refreshToken: string)`
Refresh the access token.

**Returns:** `Promise<LoginResponse>`

**Example:**
```typescript
const newTokens = await context.Auth.refreshToken('your-refresh-token');
```

---

### `loginWithThirdParty(thirdParty: AuthThirdParty, externalToken: string)`
Login with a third-party provider (Google, Apple, Steam, Facebook).

**Returns:** `Promise<any>`

---

### `loginWithDeviceId(deviceId: string)`
Login with a device ID.

**Returns:** `Promise<LoginResponse>`

---

### `isEmailAvailable(email: string)`
Check if an email is available for registration.

**Returns:** `Promise<IsEmailAvailableResponse>`

---

### `passwordUpdateInit(email: string)`
Start password reset process (sends code to email).

**Returns:** `Promise<any>`

---

### `passwordUpdateConfirm(email: string, code: string, newPassword: string)`
Confirm password reset with code and new password.

**Returns:** `Promise<any>`

---

### `emailUpdateInit(newEmail: string)`
Start email update process (sends code to new email).

**Returns:** `Promise<any>`

---

### `emailUpdateConfirm(code: string, password: string)`
Confirm email update with code and password.

**Returns:** `Promise<any>`

---

### `removeThirdPartyAssociation(provider: AuthThirdParty)`
Remove a third-party account association.

**Returns:** `Promise<RemoveThirdPartyAssociationResponse>`

---

### `updateAccount(options: UpdateAccountOptions)`
Update account details (username, country, etc).

**Returns:** `Promise<UpdateAccountResponse>`

---

### `registerThirdParty(thirdParty: string, token: string)`
Register a third-party account.

**Returns:** `Promise<UpdateAccountResponse>`

---

### `registerDevice(deviceId: string)`
Register a device for the current account.

**Returns:** `Promise<UpdateAccountResponse>` 