// Dependencies
global.__SERVER_SIDE__=true;
import express from 'express';
import path from 'path';
require("babel-polyfill");
import http from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext, browserHistory } from 'react-router';
import fs from 'fs';
import request from 'request';
import { Provider } from 'react-redux'
import { Router } from 'react-router';
import * as history from 'history';
import _ from 'lodash';
var information = require("./news/Routes.js").default;
console.log(information);
var routerObj = {information:information};
import configureStore from 'news/store';

// consts
const app = express();
let host = 'http://modbs.ganji.cn/';
let api = {
  information: 'api/v1/msc/v1/common/news/v2/detail'
};
// Setup App

app.use('/dist',express.static('./dist/'));


const htmlSource = fs.readFileSync('./dist/news/index.html', { encoding: 'utf-8' });

app.use('/1',function(req,res,next){
    res.send('123');
})
app.use('/news/:tab$',function(req,res,next){
    console.log(' '+Date.now()/1000);
    const store = configureStore();
    match(
        {routes:information,location:req.originalUrl},
        async (err,redirectLocation,renderProps)=>{
            var components = renderProps.components;
            components.map(async Component => {
                Component = Component && Component.WrappedComponent || Component;
                if (!Component || !Component.fillStore) { return; }
                try{
                    await Component.fillStore(store,req.params);
                }catch(e){
                    console.log(e);
                }
                var html = ReactDOMServer.renderToString(
                    <Provider store={store}>
                        <RouterContext {...renderProps}/>
                    </Provider>
                );
                const initialState = JSON.stringify(store.getState());
                var output = htmlSource.replace(/(<\/head>)/, '<script>var __INITIALSTATE__='+initialState+';</script>$1');
                html = output.replace(/(<div id=\"app\">)/, '$1'+html);
                res.send(html);
                console.log(' '+Date.now()/1000);
            })
        }
    )
});
// Start App
app.use((req, res, next) => {
  let urls = req.url.split('/');
  let url = urls[1];
  let routes = routerObj[url];
  let reqpath = req.path;
  // Create Router
  match({ routes, location: req.url, history: browserHistory }, (error, redirect, renderProps) => {
      if(/.js|.css|.html|.ico/.test(reqpath)) {

        res.sendFile(path.join(__dirname, reqpath));
      } else if (error) {

        console.log(error);
        res.status(500).send(error.message);
      } else {
        renderProps.params.location = '0';
        renderProps.params.coordinate = '';
        renderProps.params.city_id = '';
        renderProps.params.user_id = '0';

        let option = {
          url : 'http://app.dns.ganji.com/api/v1/msc/v1/common/news/v2/detail?'+dealParam(renderProps.params),
          headers: {
            'Content-Type':'application/json',
            'X-Ganji-CustomerId':'801',
            'X-Ganji-VersionId':'6.0.0',
            'X-Ganji-InstallId':'BE83217369A16664CD7828E24D1485A0',
            'X-Ganji-ClientAgent':'sdk#320*480',
            'X-Ganji-Agency':'agencydefaultid',
            'X-Ganji-token':'625041364b4370596363785434634576625043543561564f',
            'interface':'InformationList'
          }
        };
        request(option, function(error, response, body){
          if(!error && response.statusCode === 200){
            console.log('request end！');
            renderProps.params.data = JSON.parse(body);

              const store = configureStore({
                  reducer:{
                      title:[
                          {title:'推荐',value:'recomm'},
                          {title:'本地',value:'local'},
                          {title:'搞笑',value:'joke'},
                          {title:'社会',value:'hot'},
                          {title:'汽车',value:'auto'},
                          {title:'八卦',value:'ent'},
                          {title:'房产',value:'house'}
                      ]
                  }
              });

              let html = ReactDOMServer.renderToString(<Provider store={store}>
              <RouterContext {...renderProps} /></Provider>);
            //添加html
            fs.readFile('./dist/'+url+'/index.html', 'utf-8', function(err, data){
              if(err) {
                res.end('<!DOCTYPE html>' + html);
                return;
              }
              html = data.replace(/(<div id=\"app\">)/, '$1'+html);
              html=  html.replace(/(<\/head>)/,'<script>window.__SERVER_RENDER_DATA__='+body+'</script>$1')
              res.end(html);

            });
          };
        });

      }
  });
});
// Start server
var port = process.argv[process.argv.indexOf('port')+1];
console.log(port);
if(isNaN(port))port=9005;
app.listen({port:port,hostname:'0.0.0.0'}, () => {
  console.log('React ES6 Server Side Render app listening at http://sta.ganji.com');
});

function dealParam(json){
    var param = [];
    for( var o in json) {
        param.push(o + '=' + json[o]);
    }
    return param.join('&');
}