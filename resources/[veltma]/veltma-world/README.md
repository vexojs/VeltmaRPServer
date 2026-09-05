# Veltma World

Veltma World is the standalone client resource that establishes Veltma's controlled blank-city baseline. It keeps players and intentionally spawned entities available while suppressing ambient GTA pedestrians, scenarios, traffic, emergency services, dispatch, and wanted escalation.

It does not implement Account, Character, Spawn, Phone, Housing, Garage, Police, EMS, gameplay entities, or server networking.

## Current scope

Implemented World Phase 1.1, 1.2, 2.1, 2.2, 2.3, 3, 4, 5, and 6:

- standalone TypeScript FiveM resource setup
- strict blank-world configuration with all controls enabled by default
- client-side pedestrian and scenario density suppression
- client-side traffic, parked vehicle, boat, train, and garbage-truck suppression
- random cop, dispatch, emergency-service, and wanted-level suppression
- bounded one-time setup plus one frame callback for frame-scoped density and wanted natives
- no entity deletion loop and no player-ped deletion
- tests for defaults, safety, idempotence, and disabled frame-loop behavior

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer
- FXServer with GTA V support

## Installation

Build the resource and place `veltma-world` in the server's `resources` directory:

```text
pnpm install
pnpm build
```

Then add this to `server.cfg`:

```text
ensure veltma-world
```

World has no server script and does not require Veltma Core for its current client-native-only scope. Add a Core dependency only when a later, proven World capability needs Core APIs.

## Configuration

Configuration is in `src/shared/config/index.ts` and is bundled into the client resource. Defaults are intentionally strict:

```text
disablePedestrians       true
disableTraffic           true
disableParkedVehicles    true
disableRandomVehicles    true
disableEmergencyServices true
disableDispatch          true
disableWantedLevel       true
disableScenarios         true
```

There are no secrets or environment variables in this resource. Product/gameplay tuning belongs in configuration files, not private deployment environment variables.

## Runtime behavior

Frame-scoped density natives are applied from a single `setTick` callback only when at least one corresponding control is enabled. Persistent population controls are applied once at startup. World never scans or deletes peds, vehicles, or player entities.

The resource intentionally has no network events, RPC handlers, exports, database access, or server authority. Future Police/EMS resources may intentionally create their own entities; they must coordinate any desired ambient behavior explicitly rather than relying on GTA population defaults.

## Development and testing

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

The automated tests inject native bindings and verify calls without requiring FXServer. A live check should connect several players, drive across the map, enter interiors, observe that ambient peds, traffic, and emergency responses do not repopulate, restart the resource, and confirm player peds remain untouched.

## Security and stability

World has no client-provided authority inputs and no network boundary. It does not delete entities, inspect credentials, load environment variables, or access server-only data. The only recurring work is the minimum frame callback required by FiveM's `*_THIS_FRAME` density controls and wanted-level enforcement.

## Troubleshooting

- If ambient traffic or pedestrians appear, confirm the production build exists at `dist/client/index.js` and that `ensure veltma-world` is after the resource is copied into the server resources directory.
- If custom Police/EMS behavior is affected, disable only the corresponding World configuration flags and let the owning resource manage its entities explicitly.
- If wanted stars return, verify that no other resource is setting a wanted level and that the World client resource is running for the affected player.
