/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: false,

  entry: ["babel-polyfill", "./src/index.js"],

  output: {
    path: path.resolve(__dirname, "./public/src"),
    filename: "bundle.js",
    publicPath: "/"
  },

  plugins:
    process.env.NODE_ENV === "production"
      ? [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({ minimize: true }),
          new webpack.DefinePlugin({
            "process.env": {
              // This has effect on the react lib size
              NODE_ENV: JSON.stringify("production")
            }
          })
        ]
      : [],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader:
          "babel-loader?presets[]=es2015&presets[]=react,presets[]=stage-2"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },

  node: {
    console: true,
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
