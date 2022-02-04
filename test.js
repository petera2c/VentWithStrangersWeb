const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  let plugins;

  if (argv.mode === "development")
    plugins = [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|en/),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: '"development"',
        },
      }),
    ];
  else {
    plugins = [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|en/),
      new CopyWebpackPlugin([{ from: "./static" }]),
    ];
  }
  return {
    context: path.join(__dirname, ""),

    entry: ["babel-polyfill", "./src/index.js"],
    output: {
      path: path.join(__dirname, "/build"),
      publicPath: "/",

      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["es2015", "react", "stage-2"],
            },
          },
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
        },
        {
          test: /\.(jpe?g|ico|gif|png|svg|woff|ttf|wav|mp3)$/,
          loader: "file-loader?name=[name].[ext]",
        },
      ],
    },

    plugins: plugins,
    devServer: {
      proxy: {
        "/api/*": "http://localhost:5000",
        "/sitemap.xml": "http://localhost:5000",
      },
      disableHostCheck: true,
      historyApiFallback: true,
    },
  };
};
