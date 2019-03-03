
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        index: 'index.html',
        port: 8081,
        contentBase: path.join(__dirname, "src/client/web/.dist"),
        proxy: { 
            '/**': {  // Catch all requests.
                target: '/index.html',
                secure: false,
                bypass: function(req, res, opt) {
                    // Custom code, to check for any exceptions.
                    if (req.path.indexOf('bundle.js') !== -1) {
                        return '/bundle.js'
                    }

                    if (req.headers.accept.indexOf('html') !== -1) {
                        return '/index.html'
                    }
                }
            }
        }
    }
});
