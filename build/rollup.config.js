const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const vue = require('rollup-plugin-vue')
const pkg = require('../package.json')

const banner = `/*
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
    commonjs(),
    vue(),
    babel({
      runtimeHelpers: true
    })
  ]
}
