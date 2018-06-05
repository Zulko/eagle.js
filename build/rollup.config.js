var babel = require('rollup-plugin-babel')
var vue = require('rollup-plugin-vue')
var pkg = require('../package.json')

var banner = `/*
 * eagle.js v${pkg.version}
 *
 * @license
 * Copyright 2017-2018, Zulko
 * Released under the ISC License
 */`

module.exports = {
  input: 'src/main.js',
  output: [
    { file: 'dist/eagle.cjs.js', format: 'cjs', banner },
		{ file: 'dist/eagle.es.js', format: 'es', banner }
  ],
  external: [
    'highlight.js',
    'lodash'
  ],
  plugins: [
    vue({
      css: 'dist/eagle.css'
    }),
    babel()
  ]
}
