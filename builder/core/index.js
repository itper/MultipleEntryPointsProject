const webpack = require('webpack');
const options = require('../config.js');
const colors = require('colors');
const Watchpack = require("watchpack");
const WebpackDevServer = require('webpack-dev-server');
const Server = require('./server');
const Helper = require('./helper')(options);
const path = require('path');
function core(){

}

core.buildAll =function(){
    core.buildDll(function(){
        core.buildAll();
    });
};
core.buildEntry = function(target,cb){
    var cp = webpack(Helper.createConfig(target));
    cp.run(function(e,r){
        if(e){
            console.log(colors.red(e));
        }else{
            Helper.friendlyLog(r);
            if(cb)cb(r);
        }
    });
};
core.build = function(cb){
    var cp = webpack(Helper.createGlobalConfig());
    cp.run(function(e,r){
        if(e){
            console.log(colors.red(e));
        }else{
            Helper.friendlyLog(r);
            if(cb)cb(r);
        }
    });
};

core.buildServerEntry = function(target,cb){
    var cp = webpack(Helper.createServerConfig(entry));
    cp.run(function(e,r){
        if(e){
            console.log(colors.red(e));
        }else{
            Helper.friendlyLog(r);
            if(cb)cb(r);
        }
    });
};
core.buildServerDll = function(libName,cb){
    var cp;
    cp = webpack(Helper.createServerDllConfig(libName||options.vendorLibName));
    cp.run(function(e,r){
        if(e){
            console.log(colors.red(e));
        }else{
            Helper.friendlyLog(r);
            if(cb)cb(r);
        }
    });
};
core.buildDll = function(libName,cb){
    var cp;
    cp = webpack(Helper.createDllConfig(libName||options.vendorLibName));
    cp.run(function(e,r){
        if(e){
            console.log(colors.red(e));
        }else{
            Helper.friendlyLog(r);
            if(cb)cb(r);
        }
    });
};
core.buildAndWatch = function(){
    var wp = new Watchpack();
    wp.on('change',function(file){
        if(file.indexOf(options.libPath)!==-1){
            forceUpdate();
        }
        if(file.toString().indexOf('/')===-1)return;
        this.buildEntry();
    });
    wp.watch([], [options.sourcePath], Date.now() - 10000);
};
core.runDevServer = function(target){
    var cp = webpack(Helper.createConfig(target));
    var server = new Server(cp,options);
    server.run();
};
function devServerForce(config,target){
    var dllCompiler = webpack(require('./webpack.dll.config')(options));
    dllCompiler.plugin("done", function(stats) {
        devServer(config,target);
    });
    dllCompiler.run(function(err,stats){
        console.log(err);
    });
}
function server(entry,cb){
    var compiler = webpack(Helper.createServerConfig(entry));
    compiler.run(function(e,r){
        if(e){
            console.log(colors.red(e));
        }else{
            Helper.friendlyLog(r);
            if(cb)cb(r);
        }
    });
}
function devServer(target){
    var compiler = webpack(config);
    var server = new WebpackDevServer(compiler,{
        hot: true,
        historyApiFallback: true,
    });
    server.listen(options.port);
}
module.exports = core;