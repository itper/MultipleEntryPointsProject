var path = require('path');
var findCacheDir = require('find-cache-dir');
module.exports = {
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
        }]
    ]
};
