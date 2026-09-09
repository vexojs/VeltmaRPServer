fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Generic server-authoritative commerce engine for Veltma'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-account',
  'veltma-items',
  'veltma-inventory',
  'veltma-interaction',
  'veltma-dialog',
  'veltma-economy',
  'veltma-hud',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'

ui_page 'dist/web/index.html'

files {
  'config/shops.json',
  'dist/web/index.html',
  'dist/web/assets/*'
}

