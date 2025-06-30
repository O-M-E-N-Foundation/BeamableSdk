# Changelog

All notable changes to this project will be documented in this file.


## [1.0.6] - 2024-05-XX
### Added
- Exposed `BeamableCore`, `AuthModule`, `InventoryModule`, `StatsModule`, and `ContentModule` in the public API for advanced usage and manual login flows.
- Added documentation and tests for logging in a user before accessing `BeamContext.Default` to avoid unwanted guest creation.

### Fixed
- Fixed server-mode DELETE signature calculation to omit the body, resolving 'Invalid Signature' errors.
- Fixed `deleteStats` to send a string for single-stat deletes, matching Beamable API expectations.
- Improved test coverage for server mode, impersonation, and stats incrementing.

## [1.0.3] - 2024-05-XX
### Added
- Server mode support: configure the SDK with a secret and `mode: 'server'` to sign requests and impersonate players.
- Support for `X-BEAM-SIGNATURE` and `X-BEAM-GAMERTAG` headers in server mode.
- All modules (Auth, Inventory, Stats, Content) support optional `gamertag` for impersonation.
- Tests for server mode, impersonation, and server-only endpoints.

### Changed
- Refactored stats API: `setStats` now only uses 'set', and new `incrementStats` method uses 'add' for numeric increments.
- Improved ESM and CommonJS compatibility in build output and `package.json`.

### Fixed
- Documentation overhaul: clarified client/server usage, impersonation, and security best practices.
- Added GitHub repository metadata to `package.json`.

## [1.0.7] - 2024-05-XX
### Fixed
- Centralized access and refresh tokens in BeamableCore. All SDK instances and static methods now share the same authentication state.
- Fixed issues where logging in with one instance did not update the token for BeamContext.Default or other modules.
- Ensures correct player context after login in both tests and real applications.

## [1.0.0] - 2024-05-XX
### Added
- Initial release of the Beamable JavaScript/TypeScript SDK.
- Modular architecture: Auth, Inventory, Stats, Content modules.
- Strong TypeScript typing and NPM publishing support.
- Support for both client and server (admin) use cases.
- Basic tests and documentation for all modules. 