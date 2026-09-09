fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description '24/7 market content and world interactions for Veltma'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-businesses',
  'veltma-shops',
  'veltma-interaction',
  'veltma-dialog',
  'veltma-hud',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'
