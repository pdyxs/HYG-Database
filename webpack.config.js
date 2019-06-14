const path = require("path");
const package = require('./package.json');
const webpack = require('webpack');

module.exports = function makeWebpackConfig() {
  var config = {};

  config.target = 'node';

  config.resolve = {
    modules: [path.resolve(__dirname, "src/"), "node_modules"]
  };

  config.entry = ['@babel/polyfill', "./src/index.js"];

  config.devtool = 'inline-source-map';

  config.output = {
    path: path.resolve(__dirname, ""),
    publicPath: "",
    filename: "collate.js"
  };

  config.module = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  };

  config.plugins = [];

  return config;
}();
