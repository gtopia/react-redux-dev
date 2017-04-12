var Webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    util = require('util'),
    pkg = require('./package.json'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

var nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    mainPath = path.resolve(__dirname, 'src', 'index.js'),
    buildPath = path.resolve(__dirname, 'dist'),
    cssBundleName = util.format('style.bundle.%s.css', pkg.version),
    jsBundleName = util.format('js/app.bundle.%s.js', pkg.version),
    templatePath = path.resolve(__dirname, 'src', 'index.tpl');

// Raise tread pool size to prevent bundling stuck issue
process.env.UV_THREADPOOL_SIZE = 100;

var config = {
    devtool: 'source-map',
    entry: {
        app: [
            'babel-polyfill',
            mainPath
        ]
    },
    output: {
        path: buildPath,
        filename: jsBundleName
    },
    module: {
        loaders: [
            {
                test: /\.js(x)?$/,
                loader: 'babel',
                exclude: nodeModulesPath
            },
            {
                test: /\.(css|scss)$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!postcss')
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url?limit=8192&name=static/img/[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new Webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin(cssBundleName, {
            allChunks: true
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new Webpack.optimize.CommonsChunkPlugin('vendors', util.format('js/vendors.%s.js', pkg.version)),
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new Webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new HtmlWebpackPlugin({
            title: 'Top Topic',
            template: templatePath,
            filename: 'index.html',
            chunks: ['app'],
            inject: 'body'
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.json'],
        modulesDirectories: ['node_modules']
    },
    postcss: function () {
        return [autoprefixer, precss];
    }
};


module.exports = config;
