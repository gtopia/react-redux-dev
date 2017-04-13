var Webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc.json');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'src', 'index.js');
var buildPath = path.resolve(__dirname, 'dist');

const tempDir = 'build';
var testPath = path.resolve(__dirname, 'src', tempDir);
// var testPath = path.resolve(__dirname, 'test');
var templatePath = path.resolve(__dirname, 'src', 'index.html');

var pkg = require('./package.json');
var util = require('util');
var cssBundleName = util.format('style.bundle.%s.css', pkg.version);
var jsBundleName = util.format('js/bundle.%s.js', pkg.version);

var mode = process.env.NODE_ENV.trim();
var isDev = mode !== 'production';

// Raise tread pool size to prevent bundling stuck issue
process.env.UV_THREADPOOL_SIZE = 100;

var config = {
    devtool: isDev ? 'eval' : 'source-map',
    watch: true,
    entry: isDev ? {
        app: [
            'babel-polyfill',
            'webpack-hot-middleware/client',
            mainPath
        ]
    } : {
        app: [
            'babel-polyfill',
            mainPath
        ]
    },
    output: {
        path: isDev ? testPath : buildPath,
        filename: isDev ? 'bundle.js' : jsBundleName,
        // publicPath: isDev ? "http://local.sina.cn/test/" : "http://simg.sinajs.cn/products/news/items/2017/top_topics/"
        publicPath: '/' + tempDir + '/'
    },
    module: {
        noParse: [/autoit\.js$/],
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
                loader: 'url?limit=1&name=img/' + (mode === 'production' ? '[name]-[hash:6].[ext]' : '[name].[ext]')
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
        ];

        if (isDev) {
            pluginList.concat([
                new Webpack.HotModuleReplacementPlugin(),
                new Webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js'),
                new Webpack.optimize.DedupePlugin()
            ]);
        }
        else {
            pluginList.concat([
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

        return pluginList.push(
            new HtmlWebpackPlugin({
                title: 'Top Topic',
                template: templatePath,
                filename: 'index.html',
                chunks: ['app'],
                inject: 'body'
            })
        );
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
