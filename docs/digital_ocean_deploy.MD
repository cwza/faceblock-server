Replace "SECRET" for real private secret settings.

# Pull Source
``` bash
mkdir ~/faceblock
cd ~/faceblock
git clone https://github.com/cwza/faceblock-server.git faceblock-server
```

# docker initial
``` bash
cd ~/faceblock/faceblock-server/docker
docker-compose -f ./docker-compose.yml -d up
```

# docker production setting
## postgres change password
``` bash
docker exec -it docker_zombodb_postgres_1 /bin/bash
psql --username postgres
\password postgres
ALTER USER postgres WITH PASSWORD 'SECRET'
```

## faceblock-server use production setting
``` bash
docker exec -it docker_faceblock_1 /bin/bash
vim ~/.bashrc
# add followings to ~/.bashrc
export NODE_ENV="production"
export PRIVATE_KEY="SECRET"
export DB_PWD="SECRET"
export PORT=3001

#init DB and run faceblock-server
nvm use 7.4
cd ~/faceblock/faceblock-server
git pull
node -e 'require("./db/dbInit").initDatabase()'
forever start ~/faceblock/faceblock-server/bin/www
```

# pull new
``` bash
docker exec -it docker_faceblock_1 /bin/bash
cd ~/faceblock/faceblock-server
git pull
forever restart ~/faceblock/faceblock-server/bin/www
```
