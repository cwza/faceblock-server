#!/usr/bin/env bash
PORT=3001 forever start ./bin/www
service nginx start
