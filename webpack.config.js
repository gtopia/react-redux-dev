var Webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');
var path = require('path');
var nodeModulesPath = path.join(__dirname, 'node_modules');
var eslintrcPath = path.join(__dirname, '.eslintrc.json');
var mainPath = path.join(__dirname, 'src', 'index.js');
var templatePath = path.join(__dirname, 'src', 'index.html');
var buildPath = path.join(__dirname, 'build');
var distPath = path.join(__dirname, 'dist');

var __DEV__ = process.env.NODE_ENV.trim()!=='production';
console.log(`> This is ${__DEV__ ? "DEVELOPMENT" : "PRODUCTION"} mode.`);

var config = {
    devtool: __DEV__ ? 'eval' : 'cheap-module-source-map',
    watch: false,
    entry: (() => {
        var entryObj = {
            'app': [mainPath],
            'libs': [
                'react', 'react-dom', 'prop-types', 'immutable',
                'redux', 'react-redux', 'redux-thunk', 'react-router-dom',
                'babel-polyfill', 'classnames', 'keymirror'
            ]
        };

        if (__DEV__) {
            entryObj.app.push('webpack-hot-middleware/client');
        }

        return entryObj;
    })(),
    output: {
        path: __DEV__ ? buildPath : distPath,
        filename: __DEV__ ? 'js/[name].bundle.js' : 'js/[name].bundle-[chunkhash:8].js',
        publicPath: __DEV__ ? '/tmpdir/' : "//simg.sinajs.cn/products/news/items/2017/top_topics/"
    },
    module: {
        noParse: /jquery|zepto/,
        rules: [
            {
                test: /\.js(x)?$/,
                enforce: "pre",
                loader: 'eslint-loader',
                exclude: [nodeModulesPath]
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
                use: __DEV__ ? [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'img/[name].[ext]'
                        }
                    }
                ] : [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'img/[name]-[hash:8].[ext]'
                        }
                    }, 
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            optipng: {
                                optimizationLevel: 7,
                            },
                            mozjpeg: {
                                quality: 65,
                                progressive: true
                            },
                            gifsicle: {
                                interlaced: true,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        }
                    }
                ]
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
                title: 'TEMP_TITLE',
                template: templatePath,
                filename: 'index.html',
                chunks: ['app', 'libs', 'commons'],
                inject: 'body',
                hash: false,
                chunksSortMode: function (chunk1, chunk2) {
                    var order = ['commons', 'libs', 'app'];
                    var order1 = order.indexOf(chunk1.names[0]);
                    var order2 = order.indexOf(chunk2.names[0]);
                    return order1 - order2;  
                }
            }),
            new ExtractTextPlugin({
                filename: __DEV__ ? 'css/bundle.css' : 'css/bundle-[contenthash:8].css',
                allChunks: true,
                disable: false
            }),
            new Webpack.optimize.CommonsChunkPlugin({
                name: 'commons',
                minChunks: 2,
                chunks: ['app', 'libs'],
                filename: __DEV__ ? 'js/[name].bundle.js' : 'js/[name].bundle-[chunkhash:8].js'
            }),
            new SpritesmithPlugin({
                src: {
                    cwd: path.join(__dirname, 'src', 'static', 'sprite'),
                    glob: '*.*'
                },
                target: {
                    image: path.join(__dirname, 'src', 'static', 'img', 'auto-sprite.png'),
                    css: path.join(__dirname, 'src', 'static', 'style', 'auto-sprite.scss')
                },
                apiOptions: {
                    // Path by which generated image will be referenced in API.
                    // 相对于使用sprite的scss文件的路径
                    cssImageRef: "../../static/img/auto-sprite.png"
                },
                spritesmithOptions: {
                    algorithm: 'binary-tree',
                    padding: 2
                }
            }),
        ];

        if (__DEV__) {
            pluginList = pluginList.concat([
                new Webpack.HotModuleReplacementPlugin()
            ]);
        }
        else {
            pluginList = pluginList.concat([
                new Webpack.optimize.ModuleConcatenationPlugin(),
                new UglifyJsPlugin({
                    include: /\/src/,
                    exclude: /\/node_modules/,
                    parallel: true,
                    sourceMap: true,
                    uglifyOptions: {
                        ecma: 8,
                        parse: {
                            html5_comments: true
                        },
                        compress: {
                            collapse_vars: true,
                            drop_console: true,
                            drop_debugger: true,
                            inline: false,
                            typeofs: false,
                            warnings: false
                        },
                        mangle: {
                            keep_classnames: false,
                            keep_fnames: false,
                            reserved: ['$', 'module', 'exports', 'require']
                        },
                        output: {
                            comments: false
                        },
                        ie8: true,
                        safari10: true
                    }
                })
            ]);
        }

        return pluginList;
    })(),
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [
            path.join(__dirname, 'src', 'static'),
            path.join(__dirname, 'node_modules')
        ],
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react', 'index.js'),
            'react-dom': path.join(__dirname, 'node_modules', 'react-dom', 'index.js'),
            'react-redux': path.join(__dirname, 'node_modules', 'react-redux', 'dist', 'react-redux.min.js'),
            'redux': path.join(__dirname, 'node_modules', 'redux', 'dist', 'redux.min.js'),
            'immutable': path.join(__dirname, 'node_modules', 'immutable', 'dist', 'immutable.min.js')
        }
    }
};

module.exports = config;
