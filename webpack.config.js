const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./public/dist"),
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(c|sc|sa)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-transform-runtime"],
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        loader: "file-loader",
        options: {
          publicPath: "/",
          name: "[path][name].[ext]?[fullhash]",
          esModule: false,
        },
      },
      {
        test: /\.mp4$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "video",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],

  devServer: {
    // publicPath: "/",
    host: "localhost",
    port: 3000,
    open: true,
    historyApiFallback: true,
    hot: true,
  },
};
