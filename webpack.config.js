var webpack = require('webpack');
var pkg = require('./package.json');
const path = require('path');

const validate = require('webpack-validator');


const PATHS = {
  app: path.join(__dirname, 'client/src'),
  build: path.join(__dirname, 'client/dist')
};


const config = {
    entry: {
        app: PATHS.app,
        vendors: Object.keys(pkg.dependencies)
    },

    output: {
        path: PATHS.build,
        filename: '[name].js'
    },

    plugins: [
        // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js'),
        new webpack.HotModuleReplacementPlugin({
          multiStep: true
        })
        // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //       warnings: false
        //     }
        // })
    ],

    devServer: {
        contentBase: PATHS.build,
        // historyApiFallback: true,
        hot: true,
        inline: true,
        open: true,
        port: 7070,
        stats: 'errors-only', // 'minimal',
        // stats : {
        //     exclude: ['node_modules']
        // }
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                query: {presets:['react', 'es2015']},
                include: [PATHS.app]
            },
            {test: /\.json$/, loader: "json-loader"},
            {
              test: /\.css/,
              include: [PATHS.app],
              loader: 'style!css'
            }
        ]
    },
};

module.exports = config;


module.exports = validate(config);

