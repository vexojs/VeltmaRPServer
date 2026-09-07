fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Veltma Death and hospital respawn'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-character',
  'veltma-identity',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'

ui_page 'dist/web/index.html'

files {
  'dist/web/index.html',
  'dist/web/assets/*'
}
