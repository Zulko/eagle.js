module.exports = function (api) {
  if (api.env('test')) {
    return {
      presets: [
        [
          '@babel/preset-env',
        ],
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    }
  }

  return {
    presets: [
      ['@babel/preset-env', {'modules': false}]
    ],
    plugins: ['@babel/plugin-transform-runtime'],
    comments: false
  }
}
