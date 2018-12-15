const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const libraryName = 'symplasm'
const ENV_MODE = process.env.ENV
const outputFile = ENV_MODE === 'production'
  ? libraryName + '.min.js'
  : libraryName + '.js'


const paths = [ './build' ]

module.exports = {
  mode: ENV_MODE || 'development',
  entry: './src/scripts/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new CleanWebpackPlugin(paths, {}),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
};