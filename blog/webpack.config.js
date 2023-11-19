const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  output: {
    filename: 'main.ejs',
    publicPath: process.env.NODE_ENV === 'production' ? "https://mellifluous-cocada-015edf.netlify.app/" : "http://localhost:8080/",
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
        storefrontApp: process.env.NODE_ENV === 'production' ? 'https://resplendent-strudel-83725d.netlify.app/assets/storefrontEntry.js' : 'http://localhost:3000/assets/storefrontEntry.js'
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
      template: "./index.ejs",
      inject: true,
      filename: "./index.html",
    }),
    new NodePolyfillPlugin()
  ],
  target: 'web',
});
