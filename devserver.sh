#!/usr/bin/env bash
./builder/dev_cli.js buildDll
./builder/dev_cli.js build --target news/index
sudo ./builder/dev_cli.js dev --target news/index