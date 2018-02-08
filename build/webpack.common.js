const path = require('path');
const getParentPath = require('./util').getParentPath;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ROOT = getParentPath('html');
const NODE_MODULES_PATH = path.resolve(ROOT, 'node_modules')
const SOHU_PUBLIC_PATH = path.resolve(ROOT, 'sohu_public');
const STATIC_PATH = path.resolve(ROOT, 'static/v7');

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname, '../src/js/index.js')],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'assets/[name].[hash:7].js',
        publicPath: ''
    },
    resolve: {
        modules: [NODE_MODULES_PATH, 'node_modules'],
        alias: {
            sohu_public: SOHU_PUBLIC_PATH,
            static: STATIC_PATH
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            // exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 1000,
                name: 'assets/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 1000,
                name: 'assets/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                publicPath: '../',
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: { importLoaders: 1 }
                }, {
                    loader: 'postcss-loader'
                }]
            })
        }, {
            test: /\.html$/,
            use: {
                loader: 'html-loader',
                options: {
                  attrs: [':data-src', ':data-scratchie', 'audio:src', 'video:src', 'img:src'],
                  interpolate: true
                }
            }
        }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'assets/index.[hash:7].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html')
        })
    ]
}