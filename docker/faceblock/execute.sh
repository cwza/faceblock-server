#!/usr/bin/env bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 7.4
service nginx start
cd ~/faceblock/faceblock-server
git pull
PORT=3001 NODE_ENV=docker node ~/faceblock/faceblock-server/bin/www
