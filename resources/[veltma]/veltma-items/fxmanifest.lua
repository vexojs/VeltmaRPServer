fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Canonical Veltma item definitions and metadata validation'
version '0.1.0'

dependency 'veltma-core'

server_script 'dist/server/index.js'

files {
  'config/items.json',
  'config/clothing.json',
  'web/items/*'
}
