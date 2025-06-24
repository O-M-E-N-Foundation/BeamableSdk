# Architecture Overview

The Beamable JavaScript SDK is built with a modular, type-safe architecture that provides a clean separation of concerns and excellent developer experience.

## 🏗️ High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Your Application                        │
├──────────────────────────────────────────────────────────────┤
│                    BeamContext                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────┐ │
│  │    Auth       │ │   Content     │ │  Inventory    │ │Stats│ │
│  │   Module      │ │   Module      │ │   Module      │ │Module│ │
│  └───────────────┘ └───────────────┘ └───────────────┘ └─────┘ │
├──────────────────────────────────────────────────────────────┤
│                   BeamableCore                             │
│  ┌───────────────┐                                         │
│  │   Config      │                                         │
│  │   & Token     │                                         │
│  │   Storage     │                                         │
│  └───────────────┘                                         │
│  ┌───────────────┐                                         │
│  │   HTTP        │                                         │
│  │   Request     │                                         │
│  │   Methods     │                                         │
│  └───────────────┘                                         │
├──────────────────────────────────────────────────────────────┤
│                   Beamable API                              │
└──────────────────────────────────────────────────────────────┘
```

## 🎯 Design Principles

### 1. **Modular Architecture**
- **Single Responsibility**: Each module handles one specific domain
- **Loose Coupling**: Modules communicate through well-defined interfaces
- **High Cohesion**: Related functionality is grouped together

### 2. **Context Pattern**
- **Unified Interface**: Single entry point for all SDK operations
- **State Management**: Centralized authentication and configuration state
- **Lifecycle Management**: Automatic initialization and setup

### 3. **Type Safety**
- **Generic APIs**: Type-safe content fetching with TypeScript generics
- **Auto-generated Types**: Content types generated from actual Beamable content
- **Compile-time Safety**: Catch errors at development time, not runtime

### 4. **Developer Experience**
- **Intuitive API**: Familiar patterns from other SDKs
- **Comprehensive Documentation**: Clear examples and guides
- **Developer Tools**: CLI for type generation and content management

## 📦 Core Components

### BeamContext

The central orchestrator that provides access to all SDK functionality.

```typescript
import { BeamContext } from 'BeamableSDK';

class BeamContext {
  // Singleton instance
  static get Default(): Promise<BeamContext>;

  // Module access
  readonly Auth: AuthModule;
  readonly Content: ContentModule;
  readonly Inventory: InventoryModule;
  readonly Stats: StatsModule;

  // State
  readonly playerId: number | null;
  readonly onReady: Promise<void>;
  readonly core: BeamableCore;
}
```

**Key Features:**
- **Singleton Pattern**: Single instance per application
- **Async Initialization**: Handles authentication and setup
- **Module Access**: Provides typed access to all modules
- **State Management**: Tracks authentication and player state
- **onReady**: Promise that resolves when the context is fully initialized (after login and player info fetch)

### BeamableCore

The low-level foundation that handles HTTP communication, authentication, and configuration.

```typescript
import { BeamableCore, BeamableConfig } from 'BeamableSDK';

class BeamableCore {
  // Static configuration
  static configure(config: BeamableConfig): void;
  static get globalConfig(): BeamableConfig;

  // Instance methods
  constructor(config?: BeamableConfig);
  setTokens(accessToken: string, refreshToken?: string): void;
  getTokens(): { accessToken: string | null; refreshToken: string | null };
  request(method: string, path: string, data?: any, opts?: { auth?: boolean, microservice?: boolean | string }): Promise<any>;
  requestMicroservice(method: string, msName: string, path: string, data?: any, opts?: { auth?: boolean }): Promise<any>;
}
```

**Key Features:**
- **HTTP Abstraction**: Handles all API communication
- **Authentication Management**: Token storage and refresh
- **Configuration Management**: Environment and runtime config
- **Error Handling**: Centralized error processing

## 🔧 Module Architecture

### Module Pattern

Each module is constructed with a `BeamableCore` instance (and sometimes the `BeamContext`).

```typescript
// Example module import
import { AuthModule, ContentModule, InventoryModule, StatsModule } from 'BeamableSDK';

class AuthModule {
  constructor(core: BeamableCore, context?: BeamContext) {}
  // ...methods
}
class ContentModule {
  constructor(core: BeamableCore) {}
  // ...methods
}
// ...other modules follow similar pattern
```

### Auth Module

Handles all authentication-related operations.

```typescript
import { AuthModule } from 'BeamableSDK';

class AuthModule {
  async guestLogin(): Promise<void>;
  async loginUser(usernameOrEmail: string, password: string): Promise<LoginResponse>;
  async registerUser(usernameOrEmail: string, password: string): Promise<RegisterUserResponse>;
  async getCurrentAccount(): Promise<AccountMeResponse>;
  // ...other methods for third-party, device, federated login, etc.
}
```

### Content Module

Provides type-safe access to Beamable content.

```typescript
import { ContentModule } from 'BeamableSDK';

class ContentModule {
  async getPublicManifest(): Promise<ContentManifestResponse>;
  async getContent<T>(contentId: string): Promise<T>;
  async getContentByType<T>(contentType: string): Promise<T[]>;
}
```

### Inventory Module

Manages player inventory and items.

```typescript
import { InventoryModule } from 'BeamableSDK';

class InventoryModule {
  async getInventory(playerId: number): Promise<InventoryResponse>;
  async addItem(playerId: number, itemId: string, amount: number): Promise<void>;
  async removeItem(playerId: number, itemId: string, amount: number): Promise<void>;
}
```

### Stats Module

Handles player statistics and data.

```typescript
import { StatsModule } from 'BeamableSDK';

class StatsModule {
  async getClientStats(playerId: number): Promise<StatsResponse>;
  async setClientStats(playerId: number, stats: Record<string, any>): Promise<void>;
}
```

## 🔄 Data Flow

### 1. Initialization Flow

```
Application Start
       ↓
configureBeamable({ cid, pid, apiUrl })
       ↓
BeamContext.Default
       ↓
BeamContext authenticates (guest or user login)
       ↓
BeamContext fetches player info
       ↓
BeamContext.onReady resolves
```

### 2. Content Fetching Flow

```
Content Request
       ↓
Validate Authentication
       ↓
Check Cache
       ↓
HTTP Request to Beamable API
       ↓
Parse Response
       ↓
Type Conversion (if generic)
       ↓
Return Result
```

### 3. Authentication Flow

```
Auth Request
       ↓
Validate Credentials
       ↓
HTTP Request to Auth Endpoint
       ↓
Parse Response
       ↓
Store Tokens
       ↓
Update Context State
       ↓
Return Result
```

## 🎨 Design Patterns

### 1. **Singleton Pattern**
Used for `BeamContext` to ensure a single instance per application.

```typescript
class BeamContext {
  private static instance: BeamContext | null = null;
  
  static get Default(): Promise<BeamContext> {
    if (!this.instance) {
      this.instance = new BeamContext();
    }
    return Promise.resolve(this.instance);
  }
}
```

### 2. **Factory Pattern**
Used for creating HTTP clients and other dependencies.

```typescript
class HttpClientFactory {
  static create(config: BeamableConfig): HttpClient {
    return new HttpClient(config.apiUrl, config.timeout);
  }
}
```

### 3. **Strategy Pattern**
Used for different authentication methods.

```typescript
interface AuthStrategy {
  authenticate(credentials: any): Promise<AuthResult>;
}

class GuestAuthStrategy implements AuthStrategy {
  async authenticate(): Promise<AuthResult> {
    // Guest authentication logic
  }
}

class UserAuthStrategy implements AuthStrategy {
  async authenticate(credentials: UserCredentials): Promise<AuthResult> {
    // User authentication logic
  }
}
```

### 4. **Observer Pattern**
Used for authentication state changes.

```typescript
class AuthManager {
  private listeners: AuthStateListener[] = [];
  
  addListener(listener: AuthStateListener): void {
    this.listeners.push(listener);
  }
  
  private notifyListeners(state: AuthState): void {
    this.listeners.forEach(listener => listener(state));
  }
}
```

## 🔐 Security Architecture

### 1. **Token Management**
- **Secure Storage**: Tokens stored in memory (not localStorage)
- **Automatic Refresh**: Handles token expiration automatically
- **Scope Validation**: Ensures proper permissions for operations

### 2. **Request Security**
- **HTTPS Only**: All requests use secure connections
- **Input Validation**: All inputs validated before sending
- **Error Handling**: Sensitive information not exposed in errors

### 3. **Authentication Flow**
- **Guest First**: Automatic guest authentication for immediate access
- **User Upgrade**: Seamless transition from guest to user
- **Token Persistence**: Maintains session across page reloads

## 📊 Performance Considerations

### 1. **Caching Strategy**
- **Content Caching**: Frequently accessed content cached in memory
- **Token Caching**: Authentication tokens cached for reuse
- **Manifest Caching**: Content manifest cached to reduce API calls

### 2. **Request Optimization**
- **Batch Operations**: Multiple operations combined where possible
- **Lazy Loading**: Content loaded only when needed
- **Connection Pooling**: HTTP connections reused efficiently

### 3. **Memory Management**
- **Object Pooling**: Reuse objects to reduce garbage collection
- **Weak References**: Use weak references for cached data
- **Disposal**: Proper cleanup of resources when context is disposed

## 🔧 Configuration Architecture

### 1. **Environment Configuration**
```typescript
interface BeamableConfig {
  cid: string;           // Customer ID
  pid: string;           // Project ID
  apiUrl: string;        // API base URL
  hash?: string;         // Content hash (optional)
  timeout?: number;      // Request timeout
  retries?: number;      // Retry attempts
}
```

### 2. **Runtime Configuration**
- **Dynamic Updates**: Configuration can be updated at runtime
- **Validation**: All configuration validated on startup
- **Defaults**: Sensible defaults for optional parameters

### 3. **Environment Variables**
- **VITE_ Prefix**: Compatible with Vite and other build tools
- **Fallback Support**: Works with different environment systems
- **Type Safety**: Environment variables typed and validated

## 🧪 Testing Architecture

### 1. **Unit Testing**
- **Module Isolation**: Each module tested independently
- **Mock Dependencies**: External dependencies mocked for testing
- **Type Safety**: Tests ensure type safety is maintained

### 2. **Integration Testing**
- **Real API Calls**: Tests against actual Beamable API
- **End-to-End**: Full workflow testing
- **Error Scenarios**: Network and API error handling

### 3. **Test Utilities**
- **Test Helpers**: Common testing utilities and mocks
- **Fixtures**: Sample data for testing
- **Assertions**: Custom assertions for SDK-specific testing

## 🔄 Error Handling

### 1. **Error Hierarchy**
```typescript
class BeamableError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

class AuthenticationError extends BeamableError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
  }
}

class ContentError extends BeamableError {
  constructor(message: string) {
    super(message, 'CONTENT_ERROR');
  }
}
```

### 2. **Error Recovery**
- **Automatic Retry**: Network errors retried automatically
- **Graceful Degradation**: Partial failures handled gracefully
- **User Feedback**: Clear error messages for users

### 3. **Error Reporting**
- **Structured Errors**: Errors include context and codes
- **Logging**: Comprehensive error logging for debugging
- **Analytics**: Error tracking for monitoring

## 📈 Scalability

### 1. **Horizontal Scaling**
- **Stateless Design**: No server-side state dependencies
- **Connection Pooling**: Efficient resource usage
- **Load Distribution**: Requests distributed across endpoints

### 2. **Vertical Scaling**
- **Memory Efficiency**: Minimal memory footprint
- **CPU Optimization**: Efficient algorithms and data structures
- **Resource Management**: Proper cleanup and disposal

### 3. **Future Extensibility**
- **Plugin Architecture**: Easy to add new modules
- **API Versioning**: Support for multiple API versions
- **Feature Flags**: Gradual feature rollout support

## 🔗 Integration Points

### 1. **Framework Integration**
- **React**: Hooks and context providers
- **Vue**: Composables and plugins
- **Angular**: Services and modules
- **Vanilla JS**: Direct usage

### 2. **Build Tool Integration**
- **Webpack**: Plugin support
- **Vite**: Native integration
- **Rollup**: Plugin architecture
- **Parcel**: Zero configuration

### 3. **Runtime Integration**
- **Node.js**: Server-side usage
- **Browser**: Client-side usage
- **React Native**: Mobile support
- **Electron**: Desktop applications

## 📋 Best Practices

### 1. **Development**
- **Type Safety**: Always use TypeScript generics
- **Error Handling**: Comprehensive error handling
- **Testing**: Write tests for all new features
- **Documentation**: Keep documentation updated

### 2. **Performance**
- **Caching**: Use appropriate caching strategies
- **Lazy Loading**: Load content only when needed
- **Batch Operations**: Combine multiple operations
- **Resource Management**: Proper cleanup

### 3. **Security**
- **Input Validation**: Validate all inputs
- **Token Security**: Secure token storage
- **HTTPS Only**: Use secure connections
- **Error Sanitization**: Don't expose sensitive data

## 🔗 Related Documentation

- [BeamContext Pattern](beamcontext.md) - Detailed context pattern explanation
- [Authentication Flow](authentication.md) - Complete authentication system
- [Content Type System](../advanced/content-types.md) - Type generation and usage
- [API Reference](../api/) - Detailed API documentation
- [Examples](../examples/) - Real-world usage examples

---

**Need help?** Check out our [Troubleshooting Guide](troubleshooting.md) or [open an issue](https://github.com/your-org/beamable-javascript-sdk/issues). 