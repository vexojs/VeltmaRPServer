# VeltmaRPServer

This repository is the server-data folder for a local Veltma FiveM development
server. It owns server configuration, permissions, and the deployment location
for built Veltma resources. It does not replace the individual Veltma resource
repositories.

The initial server starts:

- FiveM’s basic map/spawn resources
- `veltma-core`
- `veltma-loading`
- `veltma-world`

`veltma-account` is intentionally not started yet. It requires the separate
Account API, PostgreSQL, and server-only authentication configuration. Enable
it later when those services are ready for live testing.

## What to choose in txAdmin

For this repository choose:

```text
Deployment Type: Existing Server Data
```

If your txAdmin version calls that option `Existing Project`, choose
`Existing Project`. Point the server-data folder to the absolute path of this
repository, for example:

```text
V:\VeltmaStudios\VeltmaRPServer
```

Do not choose ESX, QBCore, Qbox, or another RP framework. Do not use a Popular
Recipe as the Veltma framework. A Popular Recipe is only useful when creating a
fresh generic FiveM base and is not the deployment mode for this repository.

## Requirements

- FiveM server artifacts for the current recommended Windows build
- FiveM client with Grand Theft Auto V
- A Cfx.re account
- A server registration key from the Cfx.re Portal
- Node.js 20 or newer
- pnpm 10 or newer
- PowerShell 7 or Windows PowerShell

The initial join path does not require PostgreSQL or the Account API because
Account is not enabled in `server.cfg` yet.

## First-time setup

### 1. Download FXServer and open txAdmin

Download the current recommended server artifact from the official FiveM
server download page and extract it into a separate FXServer directory, for
example:

```text
C:\FXServer\server
```

Start `FXServer.exe`. For GTAV Enhanced, the executable may be named
`cfx-server.exe`. Open the txAdmin URL shown in the FXServer console, link your
Cfx.re account, create the txAdmin master password, and name the server
`Veltma Development`.

At the deployment-type step select `Existing Server Data` or the equivalent
`Existing Project` label. Use the absolute path to this directory and select
its `server.cfg` when txAdmin asks for the configuration file.

### 2. Create the local license file

Copy the example file without committing the copy:

```powershell
Copy-Item .\secrets.cfg.example .\secrets.cfg
```

Open `secrets.cfg` and replace the placeholder with the server registration
key created in the Cfx.re Portal. Keep this file private. It is ignored by Git.

### 3. Install the basic FiveM resources

The server-data repository contains the Veltma configuration, but it does not
vendor FiveM’s system resources. If this is a new FXServer installation, use
the official txAdmin `Popular Recipes` flow once to install the minimal
`FiveM Basic Server (CFX Default)` resources into a temporary server-data
folder. Copy its `resources` contents into:

```text
V:\VeltmaStudios\VeltmaRPServer\resources
```

At minimum the folder must contain these resources before starting:

```text
resources/mapmanager
resources/spawnmanager
resources/basic-gamemode
resources/[maps]/fivem-map-hipster
```

Do not copy the template’s `server.cfg` over this repository’s `server.cfg`.

### 4. Build and synchronize Veltma resources

Build the three resources from their source repositories. Run each command in
the named repository:

```powershell
Set-Location ..\veltma-core
pnpm install
pnpm build

Set-Location ..\veltma-world
pnpm install
pnpm build

Set-Location ..\veltma-loading
pnpm install
pnpm build
```

Then, from this repository, synchronize their built production resources:

```powershell
Set-Location V:\VeltmaStudios\VeltmaRPServer
.\scripts\sync-resources.ps1
```

The script copies only each resource manifest and built `dist` output into
`resources/[veltma]`. It does not copy source code, environment files, Git
metadata, dependencies, or test coverage, and it does not modify the source
repositories.

The resulting resource paths are:

```text
resources/[veltma]/veltma-core
resources/[veltma]/veltma-world
resources/[veltma]/veltma-loading
```

### 5. Start and join

In txAdmin, set the server data folder to this repository if it is not already
selected, confirm the `server.cfg` path, and choose `Save & Start Server`.

Wait for the console to show that the server is listening on port `30120`.
From the FiveM client press `F8` and connect locally:

```text
connect 127.0.0.1:30120
```

Alternatively use the txAdmin server page’s `Connect` action. For another
machine on the same network, use the host machine’s local IPv4 address instead
of `127.0.0.1` and allow TCP/UDP port `30120` through the host firewall.

## Expected first join

The first successful join should show:

1. the Veltma loading screen while resources load;
2. a connected player in the normal GTA V world;
3. Veltma World’s controlled low-population behavior;
4. no Account UI yet.

This is the server foundation milestone. Live testing of Account and other
Veltma scripts comes later after their required services are configured.

## Configuration files

| File | Tracked | Purpose |
| --- | --- | --- |
| `server.cfg` | Yes | Endpoints, server identity, resource start order |
| `permissions.cfg` | Yes | Non-secret ACE defaults |
| `secrets.cfg.example` | Yes | Placeholder for the local Cfx.re key |
| `secrets.cfg` | No | Local Cfx.re key loaded by `server.cfg` |

Never place a Cfx.re key, database URL, Account API shared secret, password,
token, or provider key in `server.cfg`, a resource client file, a replicated
convar, or the repository.

## Updating resources

Make changes in the original resource repository, run its checks and
production build, then run the sync script again. Do not edit the copied
resource under `resources/[veltma]` as the source of truth.

## Troubleshooting

### txAdmin cannot detect the server data

The selected path must be the folder that directly contains both `server.cfg`
and `resources`, not the FXServer artifact folder and not the `resources`
folder itself.

### The server rejects the license key

Confirm that `secrets.cfg` exists beside `server.cfg`, contains the key from the
Cfx.re Portal, and has no extra quotes or copied formatting. Never paste the
key into a public issue or commit.

### A Veltma resource is missing

Confirm the resource was built and that the sync script created its directory
under `resources/[veltma]`. The folder name must match the `ensure` name.

### The loading screen or world does not run

Check that the corresponding `dist` output was produced before synchronization,
then use txAdmin’s resource console to restart `veltma-core`,
`veltma-loading`, or `veltma-world` after rebuilding and syncing.

### Core reports a degraded database state

That is expected only when a database URL has been configured but PostgreSQL is
unreachable. The initial join path leaves `DATABASE_URL` unset, so Core remains
usable with an unconfigured database. Do not put the database URL into a client
resource or `server.cfg`.
