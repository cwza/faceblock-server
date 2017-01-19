Replace "SECRET" for real private secret settings.

# Pull Source
``` bash
mkdir ~/faceblock
cd ~/faceblock
git clone https://github.com/cwza/faceblock-server.git faceblock-server
```

# run ./faceblock/install.sh

# docker initial
``` bash
cd ~/faceblock/faceblock-server/docker
vim docker-compose.yml
zombodb_postgres:
  environment:
   - POSTGRES_PASSWORD=SECRET
docker-compose -f ./docker-compose.yml up -d
```

# init database and run faceblock
``` bash
nvm use 7.4
nginx start
add followings to ~/.bashrc
export NODE_ENV="production"
export PRIVATE_KEY="SECRET"
export DB_PWD="SECRET"
export PORT=3001

source ~/.bashrc
# init Database
node -e 'require("./db/dbInit").initDatabase()'
forever start ~/faceblock/faceblock-server/bin/www
```

# firewall allow nginx
``` bash
ufw allow 'Nginx Full'
```

# digital ocean reboot
``` bash
shutdown -h now
source ~/.bashrc
compose-up -f ~/faceblock/faceblock-server/docker/docker-compose.yml up -d
forever start ~/faceblock/faceblock-server/bin/www
service start nginx
```
