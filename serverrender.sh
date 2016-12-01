#!/usr/bin/env bash
pwd
git pull origin master
cd ./src/news
pwd
git pull origin master
cd ../lib
pwd
git pull origin master
cd ../../
pwd
./builder/dev_cli.js buildDll
./builder/dev_cli.js build --target news/index
./builder/dev_cli.js buildServerDll
./builder/dev_cli.js buildServer --target    server
#node ./dist/server port 123123
#pm2 kill all
#pm2 start dist/server.js 30 -i
pm2 reload all