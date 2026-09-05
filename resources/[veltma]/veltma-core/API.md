# Veltma Core Public API

The runtime API is exposed by the `veltma-core` FiveM resource. Consumers should use these exports and events instead of importing Core implementation modules.

## Server exports

| Export | Contract |
| --- | --- |
| `getApiVersion()` | Returns the public API major version, currently `1`. |
| `isReady()` | Returns `true` only when Core is ready. |
| `getHealth()` | Returns lifecycle state, resource name, player count, timestamps, and safe database health. |
| `getPlayer(source)` / `getPlayers()` | Returns server-owned player snapshots. Invalid sources return no player. |
| `getSession(source)` / `getSessions()` | Returns connection-scoped session snapshots. |
| `getIdentifiers(source)` | Returns normalized supported identifiers; invalid sources return an empty object. |
| `hasPermission(source, permission)` | Performs a server-side ACE check and fails closed. |
| `requirePermission(source, permission)` | Throws a safe `FORBIDDEN` error when the ACE check fails. |
| `registerPermission(permission)` | Validates and records a permission name; it does not alter ACE principals. |
| `transitionPlayer(source, state, sessionPatch?)` | Applies the Core state machine and emits the corresponding lifecycle event. |
| `consumeRateLimit(key, rule?, cost?)` | Consumes an in-memory token bucket and returns the decision. |
| `isDatabaseReady()` / `getDatabaseHealth()` | Reports database readiness without connection details. |
| `getDatabase()` | Returns a server-only Drizzle capability while ready; connection internals are blocked. |
| `reconnectDatabase()` | Retries database initialization and returns safe Core health. |
| `registerRpc(name, schema, handler, options?)` | Registers a server RPC with Zod validation and optional rate limiting. |

`source` is always interpreted as a server-side FiveM player source. Core does not accept a client-provided source as authority. Public methods return snapshots rather than mutable registry/session objects.

## Client exports

| Export | Contract |
| --- | --- |
| `callServer(name, payload)` | Sends a validated RPC envelope and returns a Promise for the safe response. |
| `getRuntime()` | Returns only the client resource name and resource state. |

The client export surface does not include database, server session, player registry, permission, environment, or secret data.

## Server lifecycle events

Listen with FiveM's server-local `on` function:

```text
veltma:core:starting
veltma:core:ready
veltma:core:degraded
veltma:core:stopping
veltma:core:player:connected
veltma:core:account:authenticated
veltma:core:character:selected
veltma:core:player:ready
veltma:core:player:dropped
```

Core events carry safe snapshots. External player/session event payloads omit arbitrary session metadata. Account and character resources own the decision to authenticate/select, but must use `transitionPlayer` so Core validates the state transition and publishes the contract event.

## Player transitions

The valid progression is:

```text
connecting -> connected -> authenticated -> character-selected -> ready
```

Players may move to `dropping` from an active state. Disconnect cleanup is owned by Core. Invalid transitions return a safe conflict error. Core does not persist account or character records.

## Database contract

Database access is server-only. `getDatabase()` fails with `UNAVAILABLE` until the configured database passes its health check. `getDatabaseHealth()` returns only `state`, `configured`, `reachable`, and `ready`. The public Drizzle proxy blocks the underlying client and connection-internal properties. `DATABASE_URL` is never returned through an export, event, RPC response, or log.

## Compatibility contract

Consumers should declare `dependency 'veltma-core'` in their `fxmanifest.lua`, check `isReady()` during startup, and handle `veltma:core:ready`/`veltma:core:degraded` when Core is restarted or the database recovers. The API major version is available through `getApiVersion()`; breaking changes require a new major version.
