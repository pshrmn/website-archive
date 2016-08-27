const path = require('path');
const webpack = require('webpack');

const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    vendor: ['react', 'react-dom', 'socket.io-client'],
    bundle: './index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: Infinity
    })
  ]
};

switch (process.env.npm_lifecycle_event) {
case 'webpack:dev':
  break;
case 'webpack:build':
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false
    })
  ]);
  break;
}

module.exports = config;
