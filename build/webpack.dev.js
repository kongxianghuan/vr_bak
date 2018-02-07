const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const IPv4 = require('./util').getIPv4();

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        host: IPv4 || 'localhost',
        disableHostCheck: true,
        contentBase: path.resolve('./dist')
    },
    plugins: []
})