const path = require('path');

module.exports = async ({ config }) => {
  config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js';
  config.module.rules.push(...[
    {
      test: /\.(scss|css)$/,
      use: ['style-loader', 'css-loader', {
        loader: 'sass-loader',
        options: {
          data: '$sass-env: development;'
        }
      }],
      include: path.resolve(__dirname, "../")
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: ['file-loader']
    },
    {
      test: /\.stories\.js?$/,
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      enforce: 'pre',
    }
  ]);

  return config;
}