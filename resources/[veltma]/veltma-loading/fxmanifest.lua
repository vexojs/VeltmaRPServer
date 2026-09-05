fx_version 'cerulean'
game 'gta5'

author 'Veltma Studios'
description 'Configurable Veltma loading screen'
version '0.1.0'

dependency 'veltma-core'

loadscreen 'dist/ui/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

files {
    'dist/ui/index.html',
    'dist/ui/assets/**/*'
}
