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
        rules: [
            {
                test: /\.js(x)?$/,
                enforce: "pre",
                loader: 'eslint-loader',
                exclude: nodeModulesPath
            },
            {
                test: /\.js(x)?$/,
                loader: 'babel-loader',
                exclude: nodeModulesPath
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: [{
                        loader: 'style-loader',
                    }],
                    use: [
                        {
                            loader: 'css-loader',
                            // options: {
                            //     modules: true,
                            //     localIdentName: '[name]__[local]--[hash:base64:5]',
                            // },
                        }, 
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    name: 'static/img/' + (__DEV__ ? '[name].[ext]' : '[name]-[hash:6].[ext]')
                }
            },
            {
                test: /\.tpl$/,
                loader: 'tmodjs-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: false,
                    interpolate: true
                }
            }
        ]
    },
    plugins: (() => {
        var pluginList = [
            new Webpack.LoaderOptionsPlugin({
                debug: false,
                minimize: true,
                options: {
                    postcss: [
                        autoprefixer({
                            browsers: ['>1%']
                        }),
                        precss
                    ],
                    eslint: {
                        configFile: eslintrcPath
                    }
                }
            }),
            new Webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin({
                title: 'Top Topic',
                template: templatePath,
                filename: 'index.html',
                chunks: ['app'],
                inject: 'body'
            }),
            new ExtractTextPlugin({
                filename: 'bundle.css',
                allChunks: true,
                disable: false
            })
        ];

        if (__DEV__) {
            pluginList = pluginList.concat([
                new Webpack.HotModuleReplacementPlugin(),
                new Webpack.optimize.CommonsChunkPlugin({
                    name: 'commons',
                    filename: 'commons.bundle.js'
                })
            ]);
        }
        else {
            pluginList = pluginList.concat([
                new Webpack.optimize.UglifyJsPlugin({
                    sourceMap: false,
                    // compress: {
                    //     warnings: false,
                    //     drop_console: true
                    // },
                    // output: {
                    //     comments: false
                    // },
                    mangle: {
                        except: ['$', 'exports', 'require']
                    },

                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                    compress: {
                      // 在UglifyJs删除没有用到的代码时不输出警告  
                      warnings: false,
                      // 删除所有的 `console` 语句
                      // 还可以兼容ie浏览器
                      drop_console: true,
                      // 内嵌定义了但是只用到一次的变量
                      collapse_vars: true,
                      // 提取出出现多次但是没有定义成变量去引用的静态值
                      reduce_vars: true,
                    }
                }),
                new Webpack.optimize.CommonsChunkPlugin({
                    name: 'commons',
                    filename: util.format('js/commons.%s.js', pkg.version)
                })
            ]);
        }

        return pluginList;
    })(),
    resolve: {
        extensions: ['.js', '.jsx', '.tpl', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules')
        ]
    }
};

module.exports = config;
