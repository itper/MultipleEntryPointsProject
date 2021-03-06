var path = require('path');
var findCacheDir = require('find-cache-dir');
module.exports = function(isDll) {
    return {
        babelrc: false,
        cacheDirectory: findCacheDir({
            name: '.cache'
        }),
        presets: [
            require.resolve('babel-preset-latest'),
            require.resolve('babel-preset-react')
        ],
        plugins: [
            require.resolve('babel-plugin-transform-class-properties'),
            require.resolve('babel-plugin-transform-object-rest-spread'),
            [require.resolve('babel-plugin-transform-regenerator'), {
                async: false
            }],
            [require.resolve('babel-plugin-transform-runtime'), {
                helpers: false,
                polyfill: false,
                regenerator: true,
                moduleName: path.dirname(require.resolve('babel-runtime/package'))
            }],
            require.resolve('babel-plugin-transform-decorators-legacy'),
            [
                require.resolve('babel-plugin-react-css-modules'),
                {
                    "context": path.join(process.cwd(), 'src'),
                    "generateScopedName": "[local]-[hash:base64:5]",
                    "filetypes": {
                    ".scss": {
                        "syntax": "postcss-scss"
                    },
                    ".less": {
                        "syntax": "postcss-less"
                    }
                    },
                    "webpackHotModuleReloading": true
                }
            ]
        ],
        env: !isDll&&__HOT__ ? ({development: {presets: ["react-hmre"]}}) : {}
    };
}
