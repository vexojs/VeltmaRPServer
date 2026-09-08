fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Server-authoritative inventory-backed clothing'
version '0.1.0'

dependencies {
  'veltma-core',
  'veltma-character',
  'veltma-items',
  'veltma-inventory',
  '/onesync'
}

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'

files {
  'stream/**/*.ydd',
  'stream/**/*.ytd',
  'stream/**/*.ymt'
}

data_file 'SHOP_PED_APPAREL_META_FILE' 'stream/**/*.ymt'
