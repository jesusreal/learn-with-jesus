var webpack = require('webpack');
// var pkg = require('./package.json');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'src'),
  nodeModules: path.join(__dirname, 'node_modules'),
  build: path.join(__dirname, 'dist')
};

module.exports = {
  entry: {
    // vendors: Object.keys(pkg.dependencies),
    app: PATHS.app + '/index.js'
  },

  resolve: {
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js'],
    // modules: ['./src', './node_modules'],
  },

  output: {
    path: PATHS.build,
    filename: '[name].js'
  },

  plugins: [
    new CopyWebpackPlugin(
      [
        {
          context: 'src',
          to: '',
          from: {
            glob: 'img/**/*',
            dot: true
          }
        }
      ],
      {
        ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'],
        debug: 'warning'
      }
    ),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      // hash: false,
      // inject: true,
      // compile: true,
      // favicon: false,
      // minify: false,
      // cache: true,
      // showErrors: true,
      // chunks: 'all',
      // excludeChunks: [],
      // xhtml: true
    }),
    new CleanWebpackPlugin(['dist'], {
      verbose: true
    }),
    // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js'),
    new webpack.HotModuleReplacementPlugin({
      //   multiStep: true
    })
    // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false
    //     }
    // })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  devServer: {
    // contentBase: PATHS.build,
    historyApiFallback: true,
    // hot: true,
    // inline: true,
    open: true,
    port: 7070,
    // stats: 'errors-only' // 'minimal',
    // stats : {
    //     exclude: ['node_modules']
    // }
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          query: { presets: ['react', 'es2015'] }
        },
        exclude: [PATHS.nodeModules]
      },
      // {test: /\.json$/, loader: "json-loader"},
      {
        test: /\.css/,
        include: [PATHS.app, PATHS.nodeModules + '/normalize.css'],
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[hash:20].[ext]',
          limit: 10000
        }
      }
    ]
  },
};
