const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "public/index.html"),
  filename: "index.html"
});

const buildDirectory = "build";

module.exports = {
  mode: "development",
  entry: __dirname + "/src/app/index.tsx",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions " } }
              ],
              "@babel/preset-react"
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            experimentalWatchApi: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disable: true
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, buildDirectory),
  },
  devServer: {
    contentBase: path.join(__dirname, buildDirectory),
    compress: true,
    port: 80
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new CopyPlugin({
      patterns: [
        {from: "./resources", to: "resources"},
      ],
    }),
  ]
};