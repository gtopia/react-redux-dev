/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: Webpack配置。
 */
var Webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BabiliPlugin = require("babili-webpack-plugin");
var SpritesmithPlugin = require('webpack-spritesmith');

var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var eslintrcPath = path.resolve(__dirname, '.eslintrc.json');
var zeptoPath = path.resolve(__dirname, 'src/static/lib/zepto.1.2.0.min.js');
var mainPath = path.resolve(__dirname, 'src', 'index.js');
var templatePath = path.resolve(__dirname, 'src', 'index.html');
var buildPath = path.resolve(__dirname, 'build');
var distPath = path.resolve(__dirname, 'dist');

var mode = process.env.NODE_ENV.trim();
var __DEV__ = mode!=='production';
console.log(`> You're in ${__DEV__ ? "DEVELOPMENT" : "PRODUCTION"} mode.`);

// Raise tread pool size to prevent bundling stuck issue
process.env.UV_THREADPOOL_SIZE = 100;

var config = {
    devtool: __DEV__ ? 'eval' : 'source-map',
    watch: __DEV__ ? true : false,
    entry: (() => {
        var entryObj = {
            'app': [mainPath],
            'libs': [
                'react', 'react-dom', 'prop-types', 'immutable',
                'redux', 'react-redux', 'redux-thunk', 'react-router-dom',
                'babel-polyfill', 'zepto', 'swiper', 'classnames', 'keymirror'
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
        publicPath: __DEV__ ? '/tmpdir/' : "http://simg.sinajs.cn/products/news/items/2017/top_topics/"
    },
    module: {
        // noParse: /jquery|zepto|react\.min|react\-dom\.min|react\-redux\.min|redux\.min|immutable\.min/,
        noParse: /jquery|zepto/,
        rules: [
            {
                test: /\.js(x)?$/,
                enforce: "pre",
                loader: 'eslint-loader',
                exclude: [nodeModulesPath, zeptoPath]
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
            // {
            //     test: /\.tpl$/,
            //     loader: "art-template-loader",
            //     // options: {
            //     //   // art-template options (if necessary)
            //     //   imports: require.resolve('./template-imports'),
            //     //   compressor: source => {
            //     //       return source
            //     //           // remove newline / carriage return
            //     //           .replace(/\n/g, "")

            //     //           // remove whitespace (space and tabs) before tags
            //     //           .replace(/[\t ]+\</g, "<")

            //     //           // remove whitespace between tags
            //     //           .replace(/\>[\t ]+\</g, "><")

            //     //           // remove whitespace after tags
            //     //           .replace(/\>[\t ]+$/g, ">")
                          
            //     //           // remove comments
            //     //           .replace(/<!--[\w\W]*?-->/g, "");
            //     //   }
            //     // }
            // },
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
                    cwd: path.resolve(__dirname, 'src/static/sprite/'),
                    glob: '*.*'
                },
                target: {
                    image: path.resolve(__dirname, 'src/static/img/auto-sprite.png'),
                    css: path.resolve(__dirname, 'src/static/style/auto-sprite.scss')
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
                new BabiliPlugin({}, {
                    comments: false
                })
                // new Webpack.optimize.UglifyJsPlugin({
                //     sourceMap: false,
                //     // compress: {
                //     //     warnings: false,
                //     //     drop_console: true
                //     // },
                //     // output: {
                //     //     comments: false
                //     // },
                //     mangle: {
                //         except: ['$', 'exports', 'require']
                //     },

                //     // 最紧凑的输出
                //     beautify: false,
                //     // 删除所有的注释
                //     comments: false,
                //     compress: {
                //       // 在UglifyJs删除没有用到的代码时不输出警告  
                //       warnings: false,
                //       // 删除所有的 `console` 语句
                //       // 还可以兼容ie浏览器
                //       drop_console: true,
                //       // 内嵌定义了但是只用到一次的变量
                //       collapse_vars: true,
                //       // 提取出出现多次但是没有定义成变量去引用的静态值
                //       reduce_vars: true,
                //     }
                // })
            ]);
        }

        return pluginList;
    })(),
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'src', 'static'),
            path.resolve(__dirname, 'node_modules')
        ],
        alias: {
            'zepto': zeptoPath,
            'swiper': path.join(__dirname, 'node_modules', 'swiper', 'dist', 'js', 'swiper.min.js'),
            'swiper-css': path.join(__dirname, 'node_modules', 'swiper', 'dist', 'css', 'swiper.min.css'),
            'react': path.join(__dirname, 'node_modules', 'react', 'dist', 'react.js'),
            'react-dom': path.join(__dirname, 'node_modules', 'react-dom', 'dist', 'react-dom.min.js'),
            'react-redux': path.join(__dirname, 'node_modules', 'react-redux', 'dist', 'react-redux.min.js'),
            'redux': path.join(__dirname, 'node_modules', 'redux', 'dist', 'redux.min.js'),
            'immutable': path.join(__dirname, 'node_modules', 'immutable', 'dist', 'immutable.min.js')
        }
    }
};

module.exports = config;
