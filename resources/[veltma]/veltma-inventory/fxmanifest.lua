fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Secure character inventory with hands, pockets, and backpack capacity'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-account',
  'veltma-character',
  'veltma-items',
  'veltma-hud',
  'veltma-interaction',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'

ui_page 'dist/web/index.html'

files {
  'dist/web/index.html',
  'dist/web/assets/*'
}
