var path = require('path');
var PORT = 9130;
const HOST = '//local.itper.top'
module.exports = {
     address:HOST,
     outputPath: path.join(__dirname,'../','dist'),
     buildPath:path.join(__dirname),
     // publicPath:'http://public.chendi.cn/webpack/project/dist/',
     publicPath:__HOT__?HOST+(PORT===0?'':':'+PORT)+"/":HOST,//like 'http://public.chendi.cn/webpack-project1/dist/',//cdn地址如require.ensure加载url
     sourcePath: path.join(__dirname,'../','src'),
     cachePath: path.join(__dirname,'../','.cache'),
     libPath: path.join(__dirname,'../src','lib'),
     vendors:[
          'react',
          'react-router',
          'redux',
          'react-dom',
          'react-redux',
          'redux-thunk',
          'react-router-redux',
     ],
     vendorLibName:'vendor',
     manifestPath:path.join(__dirname,'./dllconfig'),
     entry:'**/app.@(jsx|js)',
     node_module_path:path.join(__dirname,'../','node_modules'),
     port:PORT,
     babelrcdll:path.join(__dirname,'./.babelrc-dll'),
     babelrchot:path.join(__dirname,'./.babelrc-hot'),
     babelrc:path.join(__dirname,'./.babelrc'),
     extensions:['','.js','.jsx'],
     dataurlLimit:8000,
     alias:{
          // 'jquery':path.join(__dirname,'../','node_modules','@ganji/zepto/zepto.js'),
          // 'react':path.join(__dirname,'../','node_modules')+'/react/react.js',
          // 'react-dom':path.join(__dirname,'../','node_modules')+'/react-dom/app.js',
          // 'react-router': path.join(__dirname,'../','node_modules') + '/react-router/lib/app.js',
          // 'react-redux': path.join(__dirname,'../','node_modules') + '/react-redux/lib/app.js',
          // 'redux': path.join(__dirname,'../','node_modules') + '/redux/lib/app.js',
          // 'redux-thunk': path.join(__dirname,'../','node_modules') + '/redux-thunk/lib/app.js',
     },
     logconfig:{
          "none":true,// (or false) output nothing
          "errors-only":true,// only output when errors happen
          "minimal":true,// only output when errors or a new compilation happen
          "verbose":true,// output all the information webpack has
          "timings":true,// add timing information
          "chunks":false,// add chunk information (setting this to false allows for a less verbose output)
          "colors":true,
     },
     // devtool:"#source-map",
     // devtool:"#cheap-module-eval-source-map",
     provide:{
     }
};