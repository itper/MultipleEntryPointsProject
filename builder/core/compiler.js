const webpack = require('webpack');
const options = require('../config.js');
const Helper = require('./helper')(options);
const path = require('path');

function compiler(){

}


compiler.getDllCompiler = function (){
    return webpack(Helper.createDllConfig());
};
compiler.getDevCompiler = function(){
    var config = require('./webpack.config')(options);
    config.entry={};
    Helper.findEntry().map(function(v){
        var chunk = path.parse(v).dir+'/'+path.parse(v).name;
        config.entry[chunk] = './'+v;
        return chunk;
    });
    config.init();
};
compiler.getGlobalCompiler = function(){
    return webpack(Helper.createGlobalConfig());
};
compiler.getServerCompiler = function(entry){
    return webpack(Helper.createServerConfig(entry));
};
compiler.getServerDllCompiler = function(entry){
    return webpack(Helper.createServerDllConfig(entry));
};
compiler.getCompiler = function(target){
     return webpack(Helper.createConfig(target));
};
module.exports = compiler;