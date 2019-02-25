var babel = require('rollup-plugin-babel')
var vue = require('rollup-plugin-vue')
var pkg = require('../package.json')

var banner = `/*
 * eagle.js v${pkg.version}
 *
 * @license
 * Copyright 2017-2019, Zulko
 * Released under the ISC License
 */`

module.exports = {
  input: 'src/main.js',
  output: [
    { file: 'dist/eagle.cjs.js', format: 'cjs', banner, exports: 'named' },
		{ file: 'dist/eagle.es.js', format: 'es', banner }
  ],
  external: [
    'vue',
    'lodash.throttle'
  ],
  plugins: [
    vue({
      css: 'dist/eagle.css'
    }),
    babel()
  ]
}
