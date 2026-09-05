# Veltma Loading

`veltma-loading` is a reusable React/Vite loading screen for FiveM. It provides the first branded experience while a player connects and resources load. It is not the Account UI and contains no authentication, gameplay, database, server, or network-event logic.

## Scope

Implemented Loading Phases 1–5:

- Resource foundation with React, TypeScript, Vite, pnpm, and a FiveM `loadscreen` manifest.
- Configurable name, logo, background image/video, links, rules, messages, progress, and status UI.
- Typed handling for supported FiveM loading-screen browser messages, including `loadProgress`.
- Browser development mode with mock loading events through `pnpm dev`.
- Small production bundle with local assets supported and no required remote requests.

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer
- FXServer with GTA V
- `veltma-core` available before this resource starts

## Install and build

```text
pnpm install
pnpm build
```

The built loading screen is emitted to `dist/ui`. Install the repository as the `veltma-loading` resource and add:

```text
ensure veltma-core
ensure veltma-loading
```

The manifest uses `loadscreen 'dist/ui/index.html'`, packages the generated files, and enables the loading-screen cursor. The loading screen closes using FiveM's normal loading-screen lifetime; manual shutdown is not enabled because this resource has no client script.

## Branding configuration

Edit `src/shared/config/index.ts` and rebuild. Configuration is non-secret, static, and bundled into the UI:

- `serverName` and `tagline` configure the visible identity.
- `logoUrl` accepts a local path or HTTPS URL.
- `backgroundImageUrl` and `backgroundVideoUrl` accept a local path or HTTPS URL. Video takes precedence when both are set.
- `links` accepts HTTPS links only.
- `rules` and `messages` are capped, short display strings.

Local assets should be added under `public/` so Vite copies them into the build. For example, `public/assets/background.webp` can be configured as `./assets/background.webp`.

Server handover data may provide a validated `serverName` override through `window.nuiHandoverData`. Other handover values are ignored by the UI.

## Browser development

```text
pnpm dev
```

The Vite browser preview listens for normal `message` events and emits a small mock sequence only in development mode. This simulates resource loading, data loading, map loading, and completion without requiring FiveM. Production builds do not schedule mock events.

## Validation commands

```text
pnpm typecheck
pnpm test
pnpm build
pnpm lint
pnpm format:check
```

## Runtime behavior and safety

The UI validates incoming browser messages with Zod, ignores unknown or malformed event payloads, never displays raw initialization log lines, and never reads environment variables. React escapes visible text and only HTTPS links are accepted by configuration. No FiveM client/server script, NUI callback, RPC, database dependency, secret, or backend service is included.

## Manual FiveM test

1. Build with `pnpm build`.
2. Put the repository in the server's resources directory.
3. Start `veltma-core` before `veltma-loading`.
4. Connect with a FiveM client and confirm the configured branding appears.
5. Confirm the progress bar responds while resources initialize and the screen closes when loading completes.
6. Restart the server/resource and verify the browser preview remains optional and no stale state is carried between loads.
