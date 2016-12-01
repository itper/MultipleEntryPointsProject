#!/usr/bin/env bash
cd ./src/
cd information

pwd
git add .;
git commit -m 'update';
git push origin master;
cd ../lib

pwd
git add .
git commit -m 'update'
git push origin master;
cd ../../

pwd
git add .
git commit -m 'update'
git push origin master;

