const path = require('path');

module.exports = async ({ config }) => {
  // Overwrite the default storybook webpack config for same tests loaders are applied serially
  config.module.rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.(scss|css)$/,
      use: ['vue-style-loader', 'css-loader', {
        loader: 'sass-loader',
        options: {
          data: '$sass-env: development;'
        }
      }],
      include: path.resolve(__dirname, '../')
    },
    {
      test: /\.pug$/,
      loader: 'pug-plain-loader'
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: ['file-loader']
    }
  ];

  return config;
}