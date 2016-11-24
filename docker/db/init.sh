#!/bin/bash
set -e

# this script is runned when the docker container is built
# it imports the base database structure and create the database for the tests

DATABASE_NAME="faceblock"
USER_NAME="faceblock"
USER_PASSWORD="faceblock"
DB_DUMP_LOCATION="~/psql_data/init_data.sql"

echo "*** CREATING DATABASE ***"

# create default database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER "$USER_NAME" WITH PASSWORD $USER_PASSWORD;
    CREATE DATABASE "$DATABASE_NAME";
    GRANT ALL PRIVILEGES ON DATABASE "$DATABASE_NAME" TO "$USER_NAME";
EOSQL

# clean sql_dump - because I want to have a one-line command

# remove indentation
sed "s/^[ \t]*//" -i "$DB_DUMP_LOCATION"

# remove comments
sed '/^--/ d' -i "$DB_DUMP_LOCATION"

# remove new lines
sed ':a;N;$!ba;s/\n/ /g' -i "$DB_DUMP_LOCATION"

# remove other spaces
sed 's/  */ /g' -i "$DB_DUMP_LOCATION"

# remove firsts line spaces
sed 's/^ *//' -i "$DB_DUMP_LOCATION"

# append new line at the end (suggested by @Nicola Ferraro)
sed -e '$a\' -i "$DB_DUMP_LOCATION"

# import sql_dump
psql --username "$USER_NAME" "$DATABASE_NAME" < "$DB_DUMP_LOCATION"

echo "*** DATABASE CREATED! ***"
