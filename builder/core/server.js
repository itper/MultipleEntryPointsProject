const path = require('path');
const glob = require('glob');
const Koa = require('koa');
const fs = require("fs");
const colors = require('colors');
require('babel-polyfill');
const webpackMiddleware = require('koa-webpack-middleware');
const router = require('koa-router')();
const convert = require('koa-convert');
function Server(compiler,config){
    this.config = config;
    var dev = webpackMiddleware.devMiddleware(compiler,{
        noInfo: false,
        quiet: true,
        headers: { "X-Custom-Header": "yes" },
        stats: {
            colors: true
        }
    });
    var hot = webpackMiddleware.hotMiddleware(compiler,{});

    this.loadDll(compiler.outputFileSystem);
    this.app = new Koa();
    router.get('*',function(ctx,next){
        ctx.req.url = '/'+path.dirname(config.target);
        next();
    });
    //将所有文件重定向到dev/hot中间件去处理.
    this.app.use(dev).use(hot).use(router.routes()).use(router.allowedMethods()).use(dev).use(hot);
    compiler.plugin('done',function(result){
        console.log('构建完成',result);
    });
}
Server.prototype.run = function(){
    this.app.listen({port:this.config.port,hostname:'0.0.0.0'},function(){
        console.log(this.config.address);
    }.bind(this));
};
//加载dll文件
Server.prototype.loadDll = function (outputFileSystem){
    var ctx = this;
    outputFileSystem.mkdirpSync(this.config.outputPath);
    var manifest = glob.sync(path.join(ctx.config.manifestPath,'/*.manifest.json'));
    manifest.map(function(j){
        var content = require(j);
        var name = content.name.replace('_','.')+'.js';
        outputFileSystem.writeFileSync(path.join(ctx.config.outputPath,name),fs.readFileSync(path.join(ctx.config.outputPath,name)),'utf8');
    });
};


module.exports = Server;