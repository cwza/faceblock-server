
# GO TO https://www.sslforfree.com/ to get cert files
will get three files:
ca_bundle.crt, certificate.crt, private.key
copy files to /etc/nginx/ssl
# nginx
nginx config file is at ./docker/faceblock/nginx.conf
``` bash
mv private.key nginx.key
#
cat certificate.crt ca_bundle.crt >> nginx.crt
vim nginx.crt
# change -----BEGIN-----END------ to
# -----BEGIN--------
# ----END--------
service nginx restart
```
