const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: ["babel-polyfill", "./src/index.js"],
	output: {
		path: path.join(__dirname, "/build"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["es2015", "react", "stage-2"]
					}
				}
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [{ loader: "style-loader" }, { loader: "css-loader" }]
			},
			{
				test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
				loader: "file-loader?name=[name].[ext]"
			}
		]
	},
	plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
	devServer: {
		proxy: {
			"/api/*": "http://localhost:5000"
		}
	}
};
