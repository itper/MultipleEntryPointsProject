var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var path = require('path');
var webpack = require('webpack');
var HashedModuleIdsPlugin = require('../../plugin/HashedModuleIdsPlugin');
var PreHtmlPlugin = require('../../plugin/PreHtmlPlugin');

function Config(){
    this.module = {};
    this.module.loaders = [];
    this.module.preLoaders = [];
    this.plugins = [];

    this.stats = {
        hash: true,
        progress:true,
        chunks: false,
        version: true,timings: true,assets: true,modules: false,reasons: true,
        children: true,source: false,errors: true,errorDetails: true,warnings: true,publicPath: true
    };
    this.profile = true;
    if(__DEV__){
        this.devtool = "#source-map";
    }
}
// module.exports = Config;
module.exports.createConfig = function(entry,opt,serverSide){
    const config = new Config();
    config.output={
        publicPath:opt.publicPath,
        path:opt.outputPath,
        filename:serverSide||__HOT__?'[name].js':'[name].[chunkhash].js',
        chunkFilename:serverSide||__HOT__?'chunk-[name].js':'chunk-[name].[chunkhash].js'
    };
    config.resolve = {
        alias: opt.alias,
        extensions:opt.extensions
    };
    config.entry = entry;
    config.context=opt.sourcePath;
    config.eslint = {
        configFile: path.join(__dirname, './eslint.js'),
        useEslintrc: false
    };
    if(serverSide){
        config.target = 'node';
        config.output.libraryTarget='commonjs2';
    }
    var type = serverSide?'commonjs2':null;
    //使用hash左右module名称
    config.plugins.push(new HashedModuleIdsPlugin());
    //将css资源单独打包
    config.plugins.push(new ExtractTextPlugin('./static/css/[name].[contenthash].css'));
    //引用DLL资源
    config.plugins.push(new webpack.DllReferencePlugin({
        context:path.join(__dirname,'../'), //absolute path
        manifest:require(opt.manifestPath+'/vendor.manifest'+(serverSide?'.commonjs2':'')+'.json'),
        sourceType:type,
        name:serverSide?(outputPath+'/'+require(opt.manifestPath+'/vendor.manifest.commonjs2.json').name.replace(/_/g,'.')):null
    }));
    if(opt.libPath){
        config.plugins.push(new webpack.DllReferencePlugin({
            context:path.join(__dirname,'../'),
            manifest:require('../../dllconfig/lib.manifest'+(serverSide?'.commonjs2':'')+'.json'),
            sourceType:type,
            name:serverSide?(outputPath+'/'+require('../../dllconfig/lib.manifest.commonjs2.json').name.replace(/_/g,'.')):null
        }));
    }
    for(const e in config.entry){
        if(serverSide)break;
        let htmlPath = path.dirname(e)+'/index.html';
        config.plugins.push(new HtmlwebpackPlugin({
            filename: htmlPath,
            chunks: [e],
            template: opt.sourcePath + '/'+ htmlPath
        }));
    }
    config.plugins.push(new PreHtmlPlugin(opt));
    config.plugins.push(new webpack.ProvidePlugin(
        opt.provide
    ));
    config.plugins.push( new WebpackMd5Hash());

    config.module.preLoaders.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
    });

    config.module.loaders.push({
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        include:opt.sourcePath,
        loader:'babel',
        query:require('./.babelrc')()
    });
    config.module.loaders.push({
        test:/\.(css|scss)$/,
        loader:ExtractTextPlugin.extract('style','css','postcss'),
        exclude:/node_modules/
    });
    config.module.loaders.push({ test: /\.json$/, loader: 'json' });
    config.module.loaders.push({
        test:/\.module_(css|scss)$/,
        loader:ExtractTextPlugin.extract('style','css?modules&importLoaders=1&localIdentName=[hash:base64:5]','postcss'),
        exclude:/node_modules/
    });
    config.module.loaders.push({
        test:/\.(?:jpg|gif|png|svg)$/,
        loaders:[
            'url-loader?limit='+opt.dataurlLimit+'&name=img/[hash].[ext]',
            'image-webpack'
        ]
    });

    if(__DEV__) {
        return config;
    }
    config.plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress:{},
            output:{comments:false}
        })
    );
    return config;
};
module.exports.createDllConfig = function(libName,entry,opt,serverSide){
    const config = new Config();
    config.entry = {};
    if(libName === opt.vendorLibName) {
        config.entry[opt.vendorLibName]  = opt.vendors;
    }else{
        config.entry[libName] = entry;
    }
    var manifestPath = opt.manifestPath+'/'+'[name].manifest.json';
    if(serverSide){
        manifestPath = opt.manifestPath+'/'+'[name].manifest.commonjs2.json';
    }
    //文件输出路径
    var outputFilename =__HOT__?'[name].js':'[name].[chunkhash]'+(serverSide?'.commonjs2':'')+'.js';
    //输出的全局变量名,如果是libraryTarget为commonjs2,则输出exports = xxx;默认为'var',也就是输出var xxx =
    var libraryName = __HOT__?'[name]':'[name]_[chunkhash]'+(serverSide?'_commonjs2':'');
    var type = serverSide?'commonjs2':null;

    config.output={
        publicPath:opt.publicPath,
        path:opt.outputPath,
        filename:outputFilename,
        library:libraryName
    };
    config.context=opt.sourcePath;
    if(serverSide){
        config.target = 'node';
        config.output.libraryTarget='commonjs2';
    }
    config.module.loaders.push({
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        include:opt.sourcePath,
        loader:'babel',
        query:require('./.babelrc')(true)
    });
    if(libName !== opt.vendorLibName){
        config.plugins.push(new webpack.DllReferencePlugin({
            context:path.join(__dirname,'../'),
            manifest:require(opt.manifestPath+'/'+opt.vendorLibName+'.manifest'+(serverSide?'.commonjs2':'')+'.json'),
            sourceType:type,
            name:serverSide?(outputPath+'/'+require(opt.manifestPath+'/'+opt.vendorLibName+'.manifest.commonjs2.json').name.replace(/_/g,'.')):null
        }));
    }
    config.plugins.push(new webpack.DllPlugin({
        path:manifestPath,
        //要和output输出的library名称要一致.
        name:libraryName,
        context:path.join(__dirname,'../')
    }));
    config.plugins.push(new HashedModuleIdsPlugin());
    config.plugins.push(new webpack.ProvidePlugin(
        opt.provide
    ));
     if(__DEV__)return config;
    config.plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress:{
        },
        output:{
            comments:false
        }
    }));
    return config;
};
module.exports.getServerConfig = function(entry,opt,serverSide){

};