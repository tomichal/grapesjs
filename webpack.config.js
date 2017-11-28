const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const webpack = require('webpack');
const fs = require('fs');
let plugins = [];

var env = process.env.WEBPACK_ENV || 'dev'

module.exports = env => {

  const output = {
    filename: '../octo/frontend/src/javascripts/tomichal-fork-grapes.js',
    library: 'grapesjs',
    libraryTarget: 'umd',
  };

  if (env == 'prod') {
    plugins = [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({ minimize:true, compressor: {warnings:false}}),
      new webpack.BannerPlugin(`${pkg.name} - ${pkg.version}`),
    ];
  } else if (env == 'dev') {

  } else {
    const index = 'index.html';
    const indexDev = `_${index}`;
    const template = fs.existsSync(indexDev) ? indexDev : index;
    plugins.push(new HtmlWebpackPlugin({ template }));
  }

  plugins.push(new webpack.ProvidePlugin({
    _: 'underscore',
    Backbone: 'backbone'
  }));

  return {
    entry: './src',
    output: output,
    plugins: plugins,
    module: {
      loaders: [{
        test: /grapesjs\/index\.js$/,
        loader: 'string-replace-loader',
        query: {
          search: '<# VERSION #>',
          replace: pkg.version
        }
      },{
        test: /\.js$/,
        loader: 'babel-loader',
        include: /src/
      }],
    },
    resolve: {
      modules: ['src', 'node_modules'],
      alias: {
        jquery: 'cash-dom'
      }
    }
  };
}
