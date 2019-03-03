
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../.dist')
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: [
                path.resolve(__dirname, 'node_modules'), 
                path.resolve(__dirname, 'src/client')
            ],
            loader: 'ts-loader'
        }]
    }
};