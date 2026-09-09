fx_version 'cerulean'
game 'gta5'
node_version '22'

author 'Veltma Studios'
description 'Reusable typed dialogs for Veltma gameplay resources'
version '0.1.0'

dependency 'veltma-core'

client_script 'dist/client/index.js'
server_script 'dist/server/index.js'

ui_page 'dist/web/index.html'

files {
  'dist/web/index.html',
  'dist/web/assets/*'
}

