const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TinyPngWebpackPlugin = require('tinypng-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
    plugins: [
        new CleanWebpackPlugin([path.resolve('dist')], {
            root: path.resolve('../')
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: { warnings: false },
                mangle: { safari10: true }
            },
            parallel: true
        })
    ]
});