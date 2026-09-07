fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Veltma Character resource'
version '0.1.0'

dependency 'veltma-core'
dependency 'veltma-account'

-- Character creation checks that Inventory is started before granting the
-- initial outfit. It cannot be a manifest dependency because Inventory uses
-- Character's server exports.

server_script 'dist/server/index.js'
client_script 'dist/client/index.js'

ui_page 'dist/web/index.html'

files {
  'dist/web/index.html',
  'dist/web/assets/*'
}
