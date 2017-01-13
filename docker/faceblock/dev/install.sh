#!/usr/bin/env bash

apt-get -y update
apt-get install -y build-essential libssl-dev
apt-get install -y git

# nvm and nodejs
apt-get install -y curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 7.4
npm install forever -g

# faceblock
mkdir ~/faceblock
git clone https://github.com/cwza/faceblock-server.git ~/faceblock/faceblock-server
cd ~/faceblock/faceblock-server
npm install

# nginx
apt-get install -y nginx
cp ~/faceblock/faceblock-server/docker/faceblock/dev/nginx.conf /etc/nginx/sites-available/faceblock
ln -s /etc/nginx/sites-available/faceblock /etc/nginx/sites-enabled/faceblock
