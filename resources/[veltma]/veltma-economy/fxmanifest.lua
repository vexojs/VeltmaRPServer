fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Server-authoritative Veltma economy and transaction ledger'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-account',
  'veltma-hud'
}

server_script 'dist/server/index.js'

