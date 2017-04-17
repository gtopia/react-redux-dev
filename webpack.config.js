var Webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc.json');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'src', 'index.js');
var buildPath = path.resolve(__dirname, 'build');

var distPath = path.resolve(__dirname, 'dist');
var templatePath = path.resolve(__dirname, 'src', 'index.html');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var pkg = require('./package.json');
var util = require('util');

var mode = process.env.NODE_ENV.trim();
var __DEV__ = mode!=='production';

console.log('<<< Is this in DEV mode? --' + __DEV__);

// Raise tread pool size to prevent bundling stuck issue
process.env.UV_THREADPOOL_SIZE = 100;

var config = {
    devtool: __DEV__ ? 'eval' : 'source-map',
    watch: __DEV__ ? true : false,
    entry: (() => {
        var entryObj = {
            app: [
                'babel-polyfill',
                mainPath
            ]
        };

        if (__DEV__) {
            entryObj.app.push('webpack-hot-middleware/client');
        }

        return entryObj;
    })(),
    output: {
        path: __DEV__ ? buildPath : distPath,
        filename: 'bundle.js',
        // publicPath: __DEV__ ? "http://local.sina.cn/test/" : "http://simg.sinajs.cn/products/news/items/2017/top_topics/"
        publicPath: '/build/'
    },
    module: {
        preLoaders: [
            {
                test: /\.js(x)?$/,
                loader: 'eslint',
                exclude: nodeModulesPath
            }
        ],
        loaders: [
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.js(x)?$/,
                loader: 'babel',
                exclude: nodeModulesPath
            },
            {
                test: /\.(css|scss)$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                loader: 'url?limit=1&name=static/img/' + (mode === 'production' ? '[name]-[hash:6].[ext]' : '[name].[ext]')
            },
            {
                test: /\.tpl$/,
                loader: 'tmodjs'
            },
            {
                test: /\.html$/,
                loader: 'html?minimize=false&interpolate=true'
            }
        ]
    },
    plugins: (() => {
        var pluginList = [
            new Webpack.NoErrorsPlugin(),
            new HtmlWebpackPlugin({
                title: 'Top Topic',
                template: templatePath,
                filename: 'index.html',
                chunks: ['app'],
                inject: 'body'
            })
        ];

        if (__DEV__) {
            pluginList = pluginList.concat([
                new Webpack.HotModuleReplacementPlugin(),
                new Webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js'),
                new Webpack.optimize.DedupePlugin()
            ]);
        }
        else {
            pluginList = pluginList.concat([
                new Webpack.NoErrorsPlugin(), 
                new Webpack.optimize.OccurenceOrderPlugin(),
                new Webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    },
                    output: {
                        comments: false
                    },
                    mangle: {
                        except: ['$', 'exports', 'require']
                    }
                }),
                new Webpack.optimize.CommonsChunkPlugin('vendors', util.format('js/vendors.%s.js', pkg.version))
            ]);
        }

        return pluginList;
    })(),
    resolve: {
        extensions: ['', '.js', '.jsx', '.tpl', '.scss', '.css'],
        modulesDirectories: ['node_modules']
    },
    eslint: {
        configFile: eslintrcPath
    },
    postcss: function () {
        return [
            autoprefixer({
                browsers: ['>1%']
            }),
            precss
        ];
    }
};

module.exports = config;
