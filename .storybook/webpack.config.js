const path = require('path');

module.exports = {
  resolve: {
    alias: {
        'vue$': 'vue/dist/vue.esm.js'
    }
  },
	module: {
		rules: [
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
    ]
	}
}