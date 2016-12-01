var glob = require('glob');
var config = require('../config');
var path = require('path');
function PreHtmlPlugin(opt){
    this.opt = opt;
}
PreHtmlPlugin.prototype.apply = function(compiler){
    var ctx = this;
    compiler.plugin('compilation',function(compilation){
        compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
            var manifest = [
                ctx.opt.manifestPath+'/vendor.manifest.json',
                ctx.opt.manifestPath+'/lib.manifest.json'
            ];
            var globalValue = '';
            //项目路径
            globalValue+='<script>window.WEBPACK_TPATH="'+path.dirname(config.target)+'"</script>';
            //时间戳
            globalValue+='<script>window.START_TIMESTAMP = Date.now();</script>';
            //引用全局共同库
            manifest.map(function(dll){
                globalValue+='<script src="'+ctx.opt.publicPath+(require(dll).name.replace('_','.')+'.js')+'"></script>';
            });
            var htmlSource = file.html.source();
            //插入到其他script之前
            htmlSource = htmlSource.replace(/(<script type)(?![\s\S]*(<script type))/, globalValue + '<script type');
            file.html.source = function() {
                return htmlSource;
            };
            callback(null,file);
        });
    });
};
module.exports = PreHtmlPlugin;