const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TinyPngWebpackPlugin = require('tinypng-webpack-plugin');
const common = require('./webpack.common');
const TINY_PNG_KEY = 'nkpbOJ0HiErpI12dSPO2nLELZLr7Bd43'; // tinypng免费版上限每月500张

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
        }),
        // new TinyPngWebpackPlugin({
        //     key: TINY_PNG_KEY,
        //     ext: ['png', 'jpeg', 'jpg']
        // })
    ]
});