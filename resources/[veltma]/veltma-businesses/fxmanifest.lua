fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Reusable player-owned business lifecycle and management for Veltma'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-account',
  'veltma-items',
  'veltma-economy',
  'veltma-shops',
  'veltma-dialog',
  'veltma-hud',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'

ui_page 'dist/web/index.html'

files {
  'dist/web/index.html',
  'dist/web/assets/*'
}
