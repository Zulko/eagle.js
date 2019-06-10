module.exports = function(api) {
  console.log(api.env)
  if (api.env('test')) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' }}]
      ]
    }
  }

  return {
    presets: [
      ['@babel/preset-env', { 'modules': false}]
    ],
    plugins: ['@babel/plugin-transform-runtime'],
    comments: false
  }
}