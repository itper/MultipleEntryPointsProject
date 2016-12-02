var path = require('path');
var glob = require('glob');
var Table = require('cli-table');
const colors = require('colors');
var webpack = require('webpack');
var fs = require('fs-extra');
var Config = require('./config/webpack.config');

var Helper =  function(options){
    if(!(this instanceof Helper)){
        return new Helper(options);
    }
    this.options = options||{};
    this.entry = [];
    this.context = options.sourcePath;
    this.libPath = options.libPath?options.libPath.indexOf('.')===0?path.join(this.context,options.libPath):options.libPath:options.libPath;
};
Helper.prototype.findEntry = function(){
    if(Object.prototype.toString.call(this.options.entry)==='[object Array]'){
        return this.options.entry.map(function(file){return file;}.bind(this));
    }
    return glob.sync(path.join(this.context,this.options.entry),{}).map(function(file){return path.relative(this.context,file);}.bind(this));
};
Helper.prototype.findLib = function(){
    if(!this.libPath)return [];
    return glob.sync(path.join(this.libPath,'**/*.@(js|jsx)'),{}).map(function(file){return './'+path.relative(this.context,file);}.bind(this));
};
Helper.prototype.findEntryFile = function(file){
    var f =  glob.sync(path.join(this.context,file+'.@(js|jsx)'));
    if(f && f.length>0){
        console.log(colors.green('找到入口文件 '+f[0]));
        return f;
    }else{
        console.log(colors.red('未找到入口文件 '+path.join(this.context,file+'.@(js|jsx)')));
    }
};
Helper.prototype.findFileEntry = function(file){
    var dir = path.dirname(file);
    if(dir===this.context || dir === file){
        return [];
    }
    var entry = glob.sync(path.join(dir,'/'+path.basename(this.options.entry)),{}).map(function(file){return path.relative(this.context,file);}.bind(this));
    if(entry.length===0){
        return this.findFileEntry(dir);
    }else{
        return entry;
    }
};

Helper.prototype.friendlyLog = function(r){
    var json = r.toJson();
    if(r.hasErrors()){
        console.log(colors.red('编译错误'));
        console.log(colors.red(json.errors));
    }
    if(r.hasWarnings()){
        console.log(colors.yellow(json.warnings));
    }
    if(!(r.hasErrors())){
        console.log(colors.green('编译成功 用时'+json.time/1000+"秒"));
        console.log('hash:    '+colors.green(json.hash));
        console.log('version: '+colors.green(json.version));
        fs.mkdirsSync('../log');
        fs.outputJson('../log/'+json.hash+'.json',json,'utf8');
        var table = new Table({
            head:['name','Chunks','size'],
            colWidths: [60, 10,15]
        });
        for(var t in json.assets){
            table.push([json.assets[t].name,json.assets[t].chunkNames.length,json.assets[t].size/1000+'kb']);
        }
        console.log(table.toString());
    }
};
Helper.prototype.createGlobalConfig = function(){
    var entry = {};
    this.findEntry().map(function(v){
        var chunk = path.parse(v).dir+'/'+path.parse(v).name;
        entry[chunk] = './'+v;
    });
    console.log(entry);
    var config = Config.createConfig(entry,this.options);
    return config;
};
Helper.prototype.createConfig = function(target){
    var entry = {};
    entry[target] = [this.findEntryFile(target)[0]];
    var config =  Config.createConfig(entry,this.options);
    console.log('__HOT__',__HOT__);
    if(__HOT__){
        config.entry[target].unshift("eventsource-polyfill","webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    return config;
};

Helper.prototype.createDllConfig = function(name){
    return  Config.createDllConfig(name,this.findLib(),this.options);
};

Helper.prototype.createServerConfig = function(target) {
    var entry = {};
    entry[target] = [this.findEntryFile(target)[0]];
    return  Config.createConfig(entry,this.options,true);
};
Helper.prototype.createServerDllConfig = function(name){
    return   Config.createDllConfig(name,this.findLib(),this.options,true);
};
module.exports = Helper;














