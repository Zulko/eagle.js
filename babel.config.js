module.exports = function (api) {
  if (api.env('test')) {
    return {
      presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}]
      ]
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
