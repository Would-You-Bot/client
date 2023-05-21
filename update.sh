#!/bin/bash

echo Updating Would You Bot...

if [ "$1" == "client" ]; then
  docker-compose stop client
  git pull
  docker-compose up -d --build --no-deps client
else
  docker-compose stop
  git pull
  docker-compose up -d --build
fi

echo Update finished!