var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var path = require('path');
var webpack = require('webpack');
var HashedModuleIdsPlugin = require('../../plugin/HashedModuleIdsPlugin');
var PreHtmlPlugin = require('../../plugin/PreHtmlPlugin');


var stats={hash: true,progress:true,chunks: false,version: true,timings: true,assets: true,modules: false,reasons: true,
    children: true,source: false,errors: true,errorDetails: true,warnings: true,publicPath: true
};
function Config(entry,opt,server){
    this.module = {};
    this.profile = true;
    this.opt = opt;
    console.log(entry);
    this.entry = entry;
    this.plugins = [];
    this.module.loaders = [];
    this.module.preLoaders = [];
    this.resolve = {
        alias: opt.alias,
        extensions:opt.extensions,
    };
    this.eslint = {
        configFile: path.join(__dirname, './eslint.js'),
        useEslintrc: false
    };
    this.stats = stats;
    this.context=opt.sourcePath;
    if(__DEV__)
        this.devtool = opt.devtool;
    this.output={
        publicPath:opt.publicPath,
        path:opt.outputPath,
        filename:server||__HOT__?'[name].js':'[name].[chunkhash].js',
        chunkFilename:server||__HOT__?'chunk-[name].js':'chunk-[name].[chunkhash].js'
    };



    if(server){
        this.target = 'node';
        this.output.libraryTarget='commonjs2';
        outputFilename = opt.manifestPath+'/'+'[name].manifest.commonjs2.json';
    }
    this.__getPreloader().__getLoader().__getPlugin(server);
}
Config.prototype.__getPlugin = function(server){
    var type = server?'commonjs2':null;
    this.plugins.push(new HashedModuleIdsPlugin());
    this.plugins.push(new ExtractTextPlugin('./static/css/[name].[contenthash].css'));

    this.plugins.push(new webpack.DllReferencePlugin(
        {
            context:path.join(__dirname,'../'),
            manifest:require(this.opt.manifestPath+'/vendor.manifest'+(server?'.commonjs2':'')+'.json'),
            sourceType:type,
            name:server?(this.opt.outputPath+'/'+require(this.opt.manifestPath+'/vendor.manifest.commonjs2.json').name.replace(/_/g,'.')):null
        }
    ));
    if(this.opt.libPath){
        this.plugins.push(new webpack.DllReferencePlugin(
            {
                context:path.join(__dirname,'../'),
                manifest:require('../../dllconfig/lib.manifest'+(server?'.commonjs2':'')+'.json'),
                sourceType:type,
                name:server?(this.opt.outputPath+'/'+require('../../dllconfig/lib.manifest.commonjs2.json').name.replace(/_/g,'.')):null
            }
        ));
    }
    for(var e in this.entry){
        if(server)break;
        this.plugins.push(
            new HtmlwebpackPlugin(
                {
                    filename: path.dirname(e)+'/index.html',
                    chunks: [e],
                    template: this.opt.sourcePath + '/'+ path.dirname(e)+'/index.html'
                }
            )
        );
    }
    this.plugins.push(new PreHtmlPlugin(this.opt));
    if(!__DEV__){
        this.plugins.push(new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }));
        this.plugins.push(new webpack.optimize.UglifyJsPlugin({
                compress:{

                },
                output:{
                    comments:false
                }
            })
        );
    }
    this.plugins.push(new webpack.ProvidePlugin(
        this.opt.provide
    ));
    this.plugins.push( new WebpackMd5Hash());
    return this;
};
Config.prototype.__getPreloader = function (){
    this.module.preLoaders.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
    });
    return this;

};
Config.prototype.__getLoader = function (){
    this.module.loaders.push({
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        include:this.opt.sourcePath,
        loader:'babel',
        query:require('./.babelrc')
    });
    this.module.loaders.push({
        test:/\.(css|scss)$/,
        loader:ExtractTextPlugin.extract('style','css','postcss'),
        exclude:/node_modules/
    });
    this.module.loaders.push({ test: /\.json$/, loader: 'json' })
    this.module.loaders.push({
        test:/\.module_(css|scss)$/,
        loader:ExtractTextPlugin.extract('style','css?modules&importLoaders=1&localIdentName=[hash:base64:5]','postcss'),
        exclude:/node_modules/
    });
    this.module.loaders.push({
        test:/\.(?:jpg|gif|png|svg)$/,
        loaders:[
            'url-loader?limit='+this.opt.dataurlLimit+'&name=img/[hash].[ext]',
            'image-webpack'
        ]
    });
    // this.module.loaders.push({
    //     test:/\.(jpg|gif|png|svg)$/,
    //     loader:'file-loader'
    // });
    // this.module.loaders.push({ test: require.resolve('jquery'), loader: 'exports?window.$!script' });
    return this;

};
module.exports = Config;