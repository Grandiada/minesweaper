const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
  const devMode = options.mode != 'production';
  const isDevServer = process.env.WEBPACK_DEV_SERVER;

  return {
    mode: options.mode,
    entry: {
      minesweaper: './src/app/index.tsx',
    },
    devServer: {
      historyApiFallback: {
        index: '/index.html'
      },
      host: '127.0.0.1',
      open: true,
    },
    output: {
      path: path.resolve(__dirname, 'build/'),
      filename: '[name].min.js',
      publicPath: '/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
                reloadAll: true,
              },
            },
            { loader: 'css-loader', options: { modules: true } },
            'sass-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif|ttf)$/i, //to support eg. background-image property
          loader: 'file-loader',
        },
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[name].css' : '[name].[hash].css',
      }),
      new ForkTsCheckerWebpackPlugin({
        useTypescriptIncrementalApi: true
      }),
    ]
  }
};
