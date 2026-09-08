fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Reusable proximity and look-at interaction runtime for Veltma'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-hud',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'
