var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var HashedModuleIdsPlugin = require('../../plugin/HashedModuleIdsPlugin');

var stats={hash: true,progress:true,chunks: false,version: true,timings: true,assets: true,modules: false,reasons: true,
    children: true,source: false,errors: true,errorDetails: true,warnings: true,publicPath: true
};
function DllConfig(entry,opt,server){
    var outputFilename = opt.manifestPath+'/'+'[name].manifest.json';
    this.module = {};
    this.profile = true;
    this.opt = opt;
    this.entry = entry;
    this.plugins = [];
    this.module.loaders = [];
    this.module.preLoaders = [];
    var vendors = opt.vendors;
    this.entry = {vendor:vendors};
    this.entry.lib = entry;
    this.stats = stats;
    this.context=opt.sourcePath;
    this.resolve = {
        alias: opt.alias,
        extensions:opt.extensions,
    };
    this.output={
        publicPath:opt.publicPath,
        path:opt.outputPath,
        filename:__HOT__?'[name].js':'[name].[chunkhash]'+(server?'.commonjs2':'')+'.js',
        library:__HOT__?'[name]':'[name]_[chunkhash]'+(server?'_commonjs2':''),
    };
    if(server){
        this.target = 'node';
        this.output.libraryTarget='commonjs2';
        outputFilename = opt.manifestPath+'/'+'[name].manifest.commonjs2.json';
    }
    this.module={
        preLoaders:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                include:opt.sourcePath,
                loader:'babel',
                query:require('./.babelrc-dll')
            },
            // { test: require.resolve('jquery'), loader: "script" }
        ]
    };
    this.eslint = {
        configFile: path.join(__dirname, './eslint.js'),
        useEslintrc: false
    };
    this.plugins=[
        new webpack.DllPlugin(
            {
                path:outputFilename,
                name:__HOT__?'[name]':'[name]_[chunkhash]'+(server?'_commonjs2':''),
                context:path.join(__dirname,'../')
            }),
        new HashedModuleIdsPlugin(),
    ];
    this.plugins.push(new webpack.ProvidePlugin(
        this.opt.provide
    ));

    if(!__DEV__){
        this.plugins.push(new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }));
        this.plugins.push(
            new webpack.optimize.UglifyJsPlugin(
                {
                    compress:{
                    },
                    output:{
                        comments:false
                    }
                })
        );
    }
}
module.exports = DllConfig;