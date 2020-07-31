var path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    filename: 'script.js',
    path:     path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        // test: /\.exec\.js$/,
        include: [
          path.resolve(__dirname, "script"), 
        ],
        use: ['script-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
};
