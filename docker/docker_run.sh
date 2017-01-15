docker build -t zombodb_elastic ./zombodb_elastic/
docker build -t zombodb_postgres ./zombodb_postgres/
docker build -t faceblock ./faceblock/
docker run -d -p 9200:9200 9300:9300 -name zombodb_elastic_1 zombodb_elastic
docker run -d -p 5432:5432 -name zombodb_postgres_1 -link zombodb_elastic_1 zombodb_postgres
docker run -d -p 3001:3000 3043:443 -name faceblock_1 -link zombodb_postgres_1 faceblock ./faceblock/execute.sh
