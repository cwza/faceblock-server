#!/usr/bin/env bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 7.4
service nginx start
cd ~/faceblock/faceblock-server
git pull
export NODE_ENV="docker"
export PORT=3001
npm run db-init
node ~/faceblock/faceblock-server/bin/www
