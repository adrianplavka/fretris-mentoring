
const path = require('path');
const merge = require('webpack-merge');
const nodemonPlugin = require('nodemon-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new nodemonPlugin({
            watch: "src/.dist",
            ignore: ["*.js.map"],
            verbose: true
        })
    ],
});
