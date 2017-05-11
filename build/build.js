var shell = require('shelljs')

shell.rm('-r', 'dist')

shell.exec('node-sass -r src/themes -o dist/themes')
shell.cp('-r', 'src/themes/assets', 'dist/themes/assets')
shell.exec('rollup -c build/rollup.config.js')
