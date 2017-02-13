Replace "SECRET" for real private secret settings.

# Pull Source
``` bash
mkdir ~/faceblock
cd ~/faceblock
git clone https://github.com/cwza/faceblock-server.git faceblock-server
```

# run ./docker/faceblock/install.sh

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
npm run db-init
forever start ~/faceblock/faceblock-server/bin/www
```

# firewall allow nginx
``` bash
ufw allow 'Nginx Full'
```

# firewall rate limit
``` sh
vim /etc/ufw/user.rules #use following file
ufw disable
ufw enable
```
``` sh
### Add those lines after *filter near the beginning of the file
:ufw-http - [0:0]
:ufw-http-logdrop - [0:0]



### Add those lines near the end of the file

### Start HTTP ###

# Enter rule
-A ufw-before-input -p tcp --dport 80   -j ufw-http
-A ufw-before-input -p tcp --dport 443  -j ufw-http

# Limit connections per Class C
-A ufw-http -p tcp --syn -m connlimit --connlimit-above 50 --connlimit-mask 24 -j ufw-http-logdrop

# Limit connections per IP
-A ufw-http -m state --state NEW -m recent --name conn_per_ip --set
-A ufw-http -m state --state NEW -m recent --name conn_per_ip --update --seconds 10 --hitcount 20 -j ufw-http-logdrop

# Limit packets per IP
-A ufw-http -m recent --name pack_per_ip --set
-A ufw-http -m recent --name pack_per_ip --update --seconds 1  --hitcount 20  -j ufw-http-logdrop

# Finally accept
-A ufw-http -j ACCEPT

# Log-A ufw-http-logdrop -m limit --limit 3/min --limit-burst 10 -j LOG --log-prefix "[UFW HTTP DROP] "
-A ufw-http-logdrop -j DROP

### End HTTP ###
```

# digital ocean reboot
``` bash
shutdown -h now
source ~/.bashrc
docker-compose -f ~/faceblock/faceblock-server/docker/docker-compose.yml up -d
forever start ~/faceblock/faceblock-server/bin/www
service nginx start
```

# Pull new code and restart faceblock
``` bash
cd ~/faceblock/faceblock-server
git clone
npm install --production
forever restartall
```
