const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const deps = require("./package.json").dependencies;
const path = require('path');
module.exports = (_, argv) => ({
  mode: "production",
  devtool: "source-map",
  output: {
      path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: "/",
    assetModuleFilename: "[path][name][ext]",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    fallback: {
      fs: require.resolve("browserify-fs"),
    },
    alias: {
      process: 'process/browser'
    }
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
    hot: "only"
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ]
      },
      {
        test: /\.(json)$/,
        use: [
          {
            loader: "json-loader",
          }
        ]
      },
      {
        test: /\.md$/,
        use: 'raw-loader'
      }
    ],
  },

  target: "es2020",
  experiments: {
    outputModule: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "blog",
      library: { type: "module" },
      filename: "storefrontEntry.js",
      remotes: {
        storefrontApp: 'https://resplendent-strudel-83725d.netlify.app/assets/storefrontEntry.js',
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
        filename: "index.html",
      template: path.join(__dirname, "./index.ejs"),
      inject: false,
      minify: false,
      hash: false
    }),
    new NodePolyfillPlugin()
  ],
  target: 'web',
});
