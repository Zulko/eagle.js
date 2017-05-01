var shell = require('shelljs')

shell.exec('node-sass -r src/themes -o dist/themes')
shell.cp('-r', 'src/themes/assets', 'dist/themes/assets')
